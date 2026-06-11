/**
 * lib/supabase/queries/jobs.ts
 *
 * All job intelligence queries — real data only, no static templates.
 *
 * Architecture:
 * - `user_skills` table stores skill IDs earned by completing lessons
 * - `lesson_skills` table maps lessons → skill IDs awarded on completion
 * - Job matching uses Jaccard similarity (intersection / union × 100)
 * - Market signals come from `job_market_signals` table (seeded by scraper)
 */

import { createClient } from "@/lib/supabase/server";
import { jaccardMatch, getSkillBreakdown, SKILL_TAXONOMY } from "@/lib/skills/taxonomy";

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Job role definitions — used for "My Matches" when no live postings exist ──
// These are data science / tech focused roles with skills from our taxonomy.
const ROLE_DEFINITIONS: Array<{
  role: string;
  required: string[];
  preferred: string[];
}> = [
  {
    role: "Junior Data Analyst",
    required: ["python", "sql", "pandas", "data-visualization", "statistics"],
    preferred: ["tableau", "power-bi", "eda", "excel"]
  },
  {
    role: "Data Scientist",
    required: ["python", "pandas", "machine-learning", "statistics", "scikit-learn"],
    preferred: ["sql", "deep-learning", "feature-engineering", "data-visualization"]
  },
  {
    role: "ML Engineer",
    required: ["python", "machine-learning", "scikit-learn", "docker", "git"],
    preferred: ["mlflow", "fastapi", "xgboost", "pytorch", "github-actions"]
  },
  {
    role: "Analytics Engineer",
    required: ["sql", "dbt", "python", "data-wrangling"],
    preferred: ["duckdb", "git", "tableau", "parquet"]
  },
  {
    role: "Business Intelligence Analyst",
    required: ["sql", "data-visualization", "tableau", "statistics"],
    preferred: ["power-bi", "looker-studio", "python", "eda"]
  },
  {
    role: "NLP Engineer",
    required: ["python", "nlp", "transformers", "deep-learning"],
    preferred: ["pytorch", "hugging-face", "machine-learning", "scikit-learn"]
  },
  {
    role: "MLOps Engineer",
    required: ["python", "docker", "git", "github-actions", "mlflow"],
    preferred: ["wandb", "fastapi", "dvc", "kubernetes", "streamlit"]
  },
  {
    role: "Data Engineer",
    required: ["python", "sql", "sql-advanced", "dbt", "git"],
    preferred: ["duckdb", "docker", "parquet", "airflow"]
  },
  {
    role: "Deep Learning Researcher",
    required: ["python", "pytorch", "deep-learning", "linear-algebra", "calculus"],
    preferred: ["tensorflow", "transformers", "cnn", "rnn-lstm"]
  },
  {
    role: "Freelance Data Analyst",
    required: ["python", "sql", "data-visualization", "eda"],
    preferred: ["tableau", "power-bi", "looker-studio", "data-storytelling"]
  }
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSignal(row: JobSignalRow): JobSignal {
  return {
    skill: row.skill,
    source: row.source || "market",
    mentionCount: row.mention_count ?? 0,
    weekChangePct: Number(row.week_change_pct ?? 0),
    avgSalaryBdt: row.avg_salary_bdt ?? 0,
    inCurriculum: Boolean(row.in_curriculum),
    status: row.status || "active",
    scrapedAt: row.scraped_at
  };
}

function skillIdToLabel(id: string): string {
  return SKILL_TAXONOMY[id]?.label ?? id;
}

// ── Market Signals ────────────────────────────────────────────────────────────

export async function getTrendingJobSignals(limit = 10): Promise<JobSignal[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_market_signals")
    .select(
      "id,skill,source,mention_count,week_change_pct,avg_salary_bdt,in_curriculum,status,scraped_at"
    )
    .eq("status", "active")
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
    .select(
      "id,skill,source,mention_count,week_change_pct,avg_salary_bdt,in_curriculum,status,scraped_at"
    )
    .eq("status", "active")
    .order("week_change_pct", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRisingJobSignals]", error.message);
    return [];
  }
  return ((data || []) as JobSignalRow[]).map(toSignal);
}

// ── User Skill Profile ────────────────────────────────────────────────────────

/**
 * Get a user's earned skill IDs from the user_skills table.
 * Falls back to inferring from track.skills[] if user_skills is empty
 * (backward compat for users who enrolled before the skill system existed).
 */
async function getUserSkillIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  // Primary: read from user_skills table
  const { data: userSkillRows, error } = await supabase
    .from("user_skills")
    .select("skill_id")
    .eq("user_id", userId);

  if (!error && userSkillRows && userSkillRows.length > 0) {
    return (userSkillRows as { skill_id: string }[]).map((r) => r.skill_id);
  }

  // Fallback: infer from enrollment progress via lesson_skills
  // (handles users who completed lessons before user_skills was introduced)
  const { data: completedProgress } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true);

  if (!completedProgress?.length) {
    // Final fallback: use track-level skills tags
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("track:tracks(skills)")
      .eq("user_id", userId)
      .is("completed_at", null);

    const skillSet = new Set<string>();
    for (const row of enrollments || []) {
      const track = Array.isArray((row as any).track) ? (row as any).track[0] : (row as any).track;
      for (const s of track?.skills ?? []) {
        skillSet.add(String(s).toLowerCase());
      }
    }
    return [...skillSet];
  }

  const lessonIds = completedProgress.map((r) => (r as any).lesson_id as string);
  const { data: lessonSkills } = await supabase
    .from("lesson_skills")
    .select("skill_id")
    .in("lesson_id", lessonIds);

  const skillIds = new Set<string>();
  for (const row of lessonSkills || []) {
    skillIds.add((row as any).skill_id as string);
  }
  return [...skillIds];
}

// ── Job Matching Engine (Jaccard) ─────────────────────────────────────────────

function buildRoleMatch(
  role: string,
  required: string[],
  preferred: string[],
  userSkillIds: string[]
): JobRoleMatch {
  const { matchedSkills, missingRequired, missingPreferred, matchPct } =
    getSkillBreakdown(userSkillIds, required, preferred);

  const requiredCoverage = required.length
    ? Math.round(
        (required.filter((s) => userSkillIds.includes(s)).length / required.length) * 100
      )
    : 100;

  const proficiencyScore = Math.min(
    100,
    Math.round(matchPct * 0.8 + (userSkillIds.length / 20) * 20)
  );

  let readiness: JobRoleMatch["readiness"] = "learning_gap";
  if (matchPct >= 70 && requiredCoverage >= 70) readiness = "strong";
  else if (matchPct >= 45 && requiredCoverage >= 50) readiness = "near_ready";

  return {
    role,
    matchPercentage: matchPct,
    requiredCoverage,
    proficiencyScore,
    matchedSkills: matchedSkills.map(skillIdToLabel),
    missingRequiredSkills: missingRequired.map(skillIdToLabel),
    missingPreferredSkills: missingPreferred.map(skillIdToLabel),
    nextStep: missingRequired[0] ? `Learn ${skillIdToLabel(missingRequired[0])}` : null,
    readiness
  };
}

export async function getPersonalizedJobMatches(userId: string): Promise<{
  strongMatches: JobRoleMatch[];
  nearReadyMatches: JobRoleMatch[];
  learningGapMatches: JobRoleMatch[];
}> {
  const userSkillIds = await getUserSkillIds(userId);

  const matches = ROLE_DEFINITIONS.map((def) =>
    buildRoleMatch(def.role, def.required, def.preferred, userSkillIds)
  ).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    strongMatches: matches.filter((m) => m.readiness === "strong"),
    nearReadyMatches: matches.filter((m) => m.readiness === "near_ready"),
    learningGapMatches: matches.filter((m) => m.readiness === "learning_gap")
  };
}

// ── Skill awarding on lesson completion ───────────────────────────────────────

/**
 * Called after a lesson is marked complete.
 * Looks up lesson_skills for the lesson and upserts them into user_skills.
 */
export async function awardSkillsForLesson(
  userId: string,
  lessonId: string
): Promise<string[]> {
  const supabase = await createClient();

  // Get skills associated with this lesson
  const { data: lessonSkills, error } = await supabase
    .from("lesson_skills")
    .select("skill_id")
    .eq("lesson_id", lessonId);

  if (error || !lessonSkills?.length) return [];

  const skillIds = (lessonSkills as { skill_id: string }[]).map((r) => r.skill_id);

  // Upsert into user_skills (ignore conflicts — skill already earned)
  const rows = skillIds.map((skill_id) => ({
    user_id: userId,
    skill_id,
    earned_at: new Date().toISOString(),
    source_lesson_id: lessonId
  }));

  const { error: upsertErr } = await supabase
    .from("user_skills")
    .upsert(rows, { onConflict: "user_id,skill_id", ignoreDuplicates: true });

  if (upsertErr) {
    console.error("[awardSkillsForLesson]", upsertErr.message);
  }

  return skillIds;
}

// ── Market Insights (for insights endpoint) ───────────────────────────────────

export async function getJobMarketInsights() {
  const [trendingSkills, risingSkills] = await Promise.all([
    getTrendingJobSignals(10),
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
    roleDefinitions: ROLE_DEFINITIONS.map((r) => ({
      role: r.role,
      requiredSkills: r.required.map(skillIdToLabel),
      preferredSkills: r.preferred.map(skillIdToLabel)
    }))
  };
}
