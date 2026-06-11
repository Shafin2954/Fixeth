/**
 * Live Job Fetching Service
 * Fetches real job postings from multiple public sources:
 * - Jobicy (remote jobs RSS/API - free, no auth)
 * - We Work Remotely (public RSS feed)
 * - Remotive (free JSON API)
 * - BDJobs (HTML scrape via search endpoint)
 * - Adzuna (free tier API, requires keys)
 */

export interface LiveJobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  salary?: string;
  tags: string[];
  url: string;
  postedAt: string;
  source: string;
  sourceLogo?: string;
  description?: string;
  isRemote: boolean;
}

const FETCH_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    )
  ]);
}

/**
 * Remotive — free, no auth, CORS-friendly JSON API
 * Docs: https://remotive.com/api
 */
async function fetchRemotive(search: string): Promise<LiveJobPosting[]> {
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=15`;
  const res = await withTimeout(fetch(url, { cache: "no-store" }), FETCH_TIMEOUT_MS);
  if (!res.ok) throw new Error(`Remotive ${res.status}`);
  const json = (await res.json()) as {
    jobs: Array<{
      id: number;
      url: string;
      title: string;
      company_name: string;
      company_logo: string;
      category: string;
      tags: string[];
      job_type: string;
      publication_date: string;
      candidate_required_location: string;
      salary: string;
      description: string;
    }>;
  };
  return (json.jobs || []).map((j) => ({
    id: `remotive-${j.id}`,
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location || "Remote",
    type: "remote" as const,
    salary: j.salary || undefined,
    tags: j.tags?.slice(0, 6) ?? [],
    url: j.url,
    postedAt: j.publication_date,
    source: "Remotive",
    sourceLogo: j.company_logo,
    description: j.description?.replace(/<[^>]*>/g, "").slice(0, 200),
    isRemote: true
  }));
}

/**
 * Jobicy — free public API, no key required
 * Docs: https://jobicy.com/jobs-rss-feed
 */
async function fetchJobicy(search: string): Promise<LiveJobPosting[]> {
  const url = `https://jobicy.com/api/v2/remote-jobs?count=15&geo=worldwide&industry=tech&tag=${encodeURIComponent(search)}`;
  const res = await withTimeout(fetch(url, { cache: "no-store" }), FETCH_TIMEOUT_MS);
  if (!res.ok) throw new Error(`Jobicy ${res.status}`);
  const json = (await res.json()) as {
    jobs: Array<{
      id: number;
      url: string;
      jobTitle: string;
      companyName: string;
      companyLogo: string;
      jobType: string[];
      jobGeo: string;
      jobIndustry: string[];
      jobExcerpt: string;
      pubDate: string;
      annualSalaryMin?: number;
      annualSalaryMax?: number;
      salaryCurrency?: string;
    }>;
  };
  return (json.jobs || []).map((j) => {
    const salaryStr =
      j.annualSalaryMin && j.annualSalaryMax
        ? `${j.salaryCurrency ?? "USD"} ${j.annualSalaryMin.toLocaleString()}–${j.annualSalaryMax.toLocaleString()}/yr`
        : undefined;
    return {
      id: `jobicy-${j.id}`,
      title: j.jobTitle,
      company: j.companyName,
      location: j.jobGeo || "Remote",
      type: "remote" as const,
      salary: salaryStr,
      tags: j.jobIndustry?.slice(0, 4) ?? [],
      url: j.url,
      postedAt: j.pubDate,
      source: "Jobicy",
      sourceLogo: j.companyLogo,
      description: j.jobExcerpt?.replace(/<[^>]*>/g, "").slice(0, 200),
      isRemote: true
    };
  });
}

/**
 * Adzuna — free tier available, 250 calls/day
 * Requires ADZUNA_APP_ID and ADZUNA_APP_KEY env vars
 * Falls back gracefully if not configured.
 */
async function fetchAdzuna(search: string): Promise<LiveJobPosting[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  // Use 'in' (India) or 'gb' (UK) — 'bd' (Bangladesh) not yet supported by Adzuna
  const country = "in";
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=15&what=${encodeURIComponent(search)}&content-type=application/json`;
  const res = await withTimeout(fetch(url, { cache: "no-store" }), FETCH_TIMEOUT_MS);
  if (!res.ok) throw new Error(`Adzuna ${res.status}`);
  const json = (await res.json()) as {
    results: Array<{
      id: string;
      title: string;
      company: { display_name: string };
      location: { display_name: string };
      salary_min?: number;
      salary_max?: number;
      redirect_url: string;
      created: string;
      description: string;
      category: { label: string };
    }>;
  };
  return (json.results || []).map((j) => {
    const salaryStr =
      j.salary_min && j.salary_max
        ? `INR ${Math.round(j.salary_min).toLocaleString()}–${Math.round(j.salary_max).toLocaleString()}/yr`
        : undefined;
    return {
      id: `adzuna-${j.id}`,
      title: j.title,
      company: j.company.display_name,
      location: j.location.display_name,
      type: "onsite" as const,
      salary: salaryStr,
      tags: [j.category.label],
      url: j.redirect_url,
      postedAt: j.created,
      source: "Adzuna",
      description: j.description?.slice(0, 200),
      isRemote: false
    };
  });
}

/**
 * We Work Remotely — scrape their RSS feed via a public RSS-to-JSON proxy
 */
async function fetchWeWorkRemotely(search: string): Promise<LiveJobPosting[]> {
  // Use allorigins to bypass CORS for the RSS feed
  const rssUrl = `https://weworkremotely.com/categories/remote-programming-jobs.rss`;
  const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=20`;
  const res = await withTimeout(fetch(proxyUrl, { cache: "no-store" }), FETCH_TIMEOUT_MS);
  if (!res.ok) throw new Error(`WWR ${res.status}`);
  const json = (await res.json()) as {
    items: Array<{
      guid: string;
      title: string;
      link: string;
      pubDate: string;
      description: string;
      author: string;
    }>;
  };
  const q = search.toLowerCase();
  return (json.items || [])
    .filter((item) => {
      const text = `${item.title} ${item.description}`.toLowerCase();
      return q.split(" ").some((word) => word.length > 2 && text.includes(word));
    })
    .slice(0, 10)
    .map((item, idx) => {
      // Title format: "Company: Job Title"
      const [company, ...titleParts] = item.title.split(": ");
      const title = titleParts.join(": ") || item.title;
      return {
        id: `wwr-${idx}-${item.guid?.slice(-8) ?? idx}`,
        title,
        company: company ?? "Unknown",
        location: "Remote",
        type: "remote" as const,
        tags: [],
        url: item.link,
        postedAt: item.pubDate,
        source: "We Work Remotely",
        description: item.description?.replace(/<[^>]*>/g, "").slice(0, 200),
        isRemote: true
      };
    });
}

/**
 * Main aggregator — tries all sources in parallel, collects results,
 * deduplicates by title+company, and returns sorted by date.
 */
export async function fetchLiveJobs(
  searchQuery = "software developer"
): Promise<{ jobs: LiveJobPosting[]; sources: string[]; errors: string[] }> {
  const results = await Promise.allSettled([
    fetchRemotive(searchQuery),
    fetchJobicy(searchQuery),
    fetchAdzuna(searchQuery),
    fetchWeWorkRemotely(searchQuery)
  ]);

  const jobs: LiveJobPosting[] = [];
  const sources: string[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length > 0) {
      jobs.push(...result.value);
      const source = result.value[0]?.source;
      if (source && !sources.includes(source)) sources.push(source);
    } else if (result.status === "rejected") {
      errors.push(String(result.reason));
    }
  }

  // Deduplicate by normalized title+company
  const seen = new Set<string>();
  const deduped = jobs.filter((job) => {
    const key = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by date descending
  deduped.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  return { jobs: deduped, sources, errors };
}
