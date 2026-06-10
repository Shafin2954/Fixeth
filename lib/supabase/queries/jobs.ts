import { createClient } from "@/lib/supabase/server";

type JobSignalRow = {
  id: string;
  skill: string;
  source: string | null;
  mention_count: number | null;
  week_change_pct: number | null;
  avg_salary_bdt: number | null;
  in_curriculum: boolean | null;
  status: string | null;
  scraped_at: string | null;
};

export type JobSignal = {
  skill: string;
  source: string;
  mentionCount: number;
  weekChangePct: number;
  avgSalaryBdt: number;
  inCurriculum: boolean;
  status: string;
  scrapedAt: string | null;
};

export type JobRoleMatch = {
  role: string;
  matchPercentage: number;
  requiredCoverage: number;
  proficiencyScore: number;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  nextStep: string | null;
  readiness: "strong" | "near_ready" | "learning_gap";
};

type RoleTemplate = {
  role: string;
  required: string[];
  preferred: string[];
};

const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    role: "Junior Data Analyst",
    required: ["excel", "sql", "data analysis"],
    preferred: ["python", "power bi", "communication"]
  },
  {
    role: "Junior Frontend Developer",
    required: ["html", "css", "javascript"],
    preferred: ["react", "git", "tailwind"]
  },
  {
    role: "Digital Marketing Executive",
    required: ["digital marketing", "communication"],
    preferred: ["seo", "canva", "excel"]
  },
  {
    role: "Office Assistant",
    required: ["excel", "google sheets", "communication"],
    preferred: ["word", "email", "data entry"]
  }
];

function normalizeSkill(raw: string): string {
  return raw.trim().toLowerCase();
}

function toSignal(row: JobSignalRow): JobSignal {
  return {
    skill: row.skill,
    source: row.source || "unknown",
    mentionCount: row.mention_count ?? 0,
    weekChangePct: Number(row.week_change_pct ?? 0),
    avgSalaryBdt: row.avg_salary_bdt ?? 0,
    inCurriculum: Boolean(row.in_curriculum),
    status: row.status || "pending_review",
    scrapedAt: row.scraped_at
  };
}

export async function getTrendingJobSignals(limit = 10): Promise<JobSignal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_market_signals")
    .select("id,skill,source,mention_count,week_change_pct,avg_salary_bdt,in_curriculum,status,scraped_at")
    .order("mention_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getTrendingJobSignals]", error.message);
    return [];
  }

  return ((data || []) as JobSignalRow[]).map(toSignal);
}

export async function getRisingJobSignals(limit = 10): Promise<JobSignal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_market_signals")
    .select("id,skill,source,mention_count,week_change_pct,avg_salary_bdt,in_curriculum,status,scraped_at")
    .order("week_change_pct", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRisingJobSignals]", error.message);
    return [];
  }

  return ((data || []) as JobSignalRow[]).map(toSignal);
}

type UserSkillProfile = {
  skills: Set<string>;
  proficiencyScore: number;
};

async function getUserSkillProfile(userId: string): Promise<UserSkillProfile> {
  const supabase = await createClient();

  const [enrollmentRes, progressRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("progress_percent, track:tracks(skills)")
      .eq("user_id", userId)
      .is("completed_at", null),
    supabase
      .from("progress")
      .select("completed")
      .eq("user_id", userId)
      .eq("completed", true)
  ]);

  if (enrollmentRes.error) {
    console.error("[getUserSkillProfile enrollments]", enrollmentRes.error.message);
  }

  if (progressRes.error) {
    console.error("[getUserSkillProfile progress]", progressRes.error.message);
  }

  const skillSet = new Set<string>();
  const enrollmentRows = (enrollmentRes.data || []) as Array<{
    progress_percent: number | null;
    track: { skills?: string[] } | { skills?: string[] }[] | null;
  }>;

  let progressAccumulator = 0;
  let enrollmentCount = 0;

  for (const row of enrollmentRows) {
    const track = Array.isArray(row.track) ? row.track[0] : row.track;
    for (const skill of track?.skills || []) {
      skillSet.add(normalizeSkill(skill));
    }
    progressAccumulator += Number(row.progress_percent ?? 0);
    enrollmentCount += 1;
  }

  const avgEnrollmentProgress = enrollmentCount
    ? progressAccumulator / enrollmentCount
    : 0;
  const completedLessons = (progressRes.data || []).length;
  const completionBonus = Math.min(20, completedLessons * 2);

  return {
    skills: skillSet,
    proficiencyScore: Math.min(100, Math.round(avgEnrollmentProgress * 0.8 + completionBonus))
  };
}

function scoreRoleMatch(userSkills: Set<string>, proficiencyScore: number, template: RoleTemplate): JobRoleMatch {
  const matchedRequired = template.required.filter((skill) => userSkills.has(skill));
  const matchedPreferred = template.preferred.filter((skill) => userSkills.has(skill));

  const missingRequired = template.required.filter((skill) => !userSkills.has(skill));
  const missingPreferred = template.preferred.filter((skill) => !userSkills.has(skill));

  const requiredCoverage = template.required.length
    ? matchedRequired.length / template.required.length
    : 1;
  const preferredCoverage = template.preferred.length
    ? matchedPreferred.length / template.preferred.length
    : 1;

  const weighted = requiredCoverage * 0.7 + preferredCoverage * 0.2 + (proficiencyScore / 100) * 0.1;
  const matchPercentage = Math.round(weighted * 100);

  let readiness: JobRoleMatch["readiness"] = "learning_gap";
  if (matchPercentage >= 85 && requiredCoverage >= 0.8) readiness = "strong";
  else if (matchPercentage >= 70 && requiredCoverage >= 0.6) readiness = "near_ready";

  return {
    role: template.role,
    matchPercentage,
    requiredCoverage: Math.round(requiredCoverage * 100),
    proficiencyScore,
    matchedSkills: [...matchedRequired, ...matchedPreferred],
    missingRequiredSkills: missingRequired,
    missingPreferredSkills: missingPreferred,
    nextStep: missingRequired[0] || missingPreferred[0] || null,
    readiness
  };
}

export async function getPersonalizedJobMatches(userId: string): Promise<{
  strongMatches: JobRoleMatch[];
  nearReadyMatches: JobRoleMatch[];
  learningGapMatches: JobRoleMatch[];
}> {
  const profile = await getUserSkillProfile(userId);
  const matches = ROLE_TEMPLATES.map((template) =>
    scoreRoleMatch(profile.skills, profile.proficiencyScore, template)
  ).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    strongMatches: matches.filter((m) => m.readiness === "strong"),
    nearReadyMatches: matches.filter((m) => m.readiness === "near_ready"),
    learningGapMatches: matches.filter((m) => m.readiness === "learning_gap")
  };
}

export async function getJobMarketInsights() {
  const [trendingSkills, risingSkills] = await Promise.all([
    getTrendingJobSignals(8),
    getRisingJobSignals(8)
  ]);

  const curriculumGaps = trendingSkills
    .filter((skill) => !skill.inCurriculum)
    .map((skill) => ({
      skill: skill.skill,
      demandScore: skill.mentionCount,
      weekChangePct: skill.weekChangePct,
      recommendation: `Add or expand ${skill.skill} coverage in active tracks`
    }))
    .slice(0, 5);

  return {
    trendingSkills,
    risingSkills,
    curriculumGaps,
    roleTemplates: ROLE_TEMPLATES.map((role) => ({
      role: role.role,
      requiredSkills: role.required,
      preferredSkills: role.preferred
    }))
  };
}
