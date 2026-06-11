/**
 * BDJobs Scraper — Server-side fetch scraper for bdjobs.com
 *
 * Strategy: BDJobs exposes job data through their search page which
 * returns HTML. We fetch & parse it server-side (no browser/CORS issue).
 * We hit their mobile/lightweight endpoint to get structured data.
 */

export interface BDJobsPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  deadline?: string;
  url: string;
  postedAt: string;
  source: "BDJobs";
}

const BDJOBS_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.bdjobs.com/"
};

function parseJobsFromHTML(html: string, query: string): BDJobsPosting[] {
  const jobs: BDJobsPosting[] = [];
  const q = query.toLowerCase();

  // BDJobs job listing pattern — extract job card data from HTML
  // Pattern: job titles appear in <a> tags with href containing /job-details-
  const jobBlockPattern =
    /<div[^>]*class="[^"]*jobBlock[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  const titlePattern = /<a[^>]+href="([^"]+)"[^>]*>\s*([^<]+)/i;
  const companyPattern = /company[^>]*>([^<]+)/i;
  const locationPattern = /location[^>]*>([^<]+)/i;
  const deadlinePattern = /deadline[^>]*>([^<]+)/i;

  let match;
  let idxCounter = 0;

  // Simpler fallback: Extract all job-detail links + surrounding text
  const linkPattern =
    /href="(https?:\/\/jobs\.bdjobs\.com\/jobDetails\.asp\?id=(\d+)[^"]*)"[^>]*>\s*<[^>]+>\s*([^<]{5,120})/gi;

  while ((match = linkPattern.exec(html)) !== null && jobs.length < 20) {
    const url = match[1];
    const jobId = match[2];
    const rawTitle = match[3].trim();

    if (!rawTitle || rawTitle.length < 4) continue;
    // Filter relevance
    const titleWords = rawTitle.toLowerCase();
    const queryWords = q.split(" ").filter((w) => w.length > 2);
    const relevant = queryWords.some((word) => titleWords.includes(word));
    if (!relevant && queryWords.length > 0) continue;

    jobs.push({
      id: `bdjobs-${jobId || idxCounter++}`,
      title: rawTitle,
      company: "See BDJobs",
      location: "Bangladesh",
      url,
      postedAt: new Date().toISOString().slice(0, 10),
      source: "BDJobs"
    });
  }

  return jobs;
}

function parseJobsFromJsonLd(html: string): BDJobsPosting[] {
  // Some pages include JSON-LD structured data
  const jsonLdPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  const jobs: BDJobsPosting[] = [];
  let match;
  let idx = 0;

  while ((match = jsonLdPattern.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data["@type"] === "JobPosting") {
        jobs.push({
          id: `bdjobs-jsonld-${idx++}`,
          title: data.title || "Job Opening",
          company: data.hiringOrganization?.name || "Company",
          location: data.jobLocation?.address?.addressLocality || "Bangladesh",
          salary: data.baseSalary?.value
            ? `BDT ${data.baseSalary.value.minValue}–${data.baseSalary.value.maxValue}`
            : undefined,
          deadline: data.validThrough,
          url: data.url || "https://bdjobs.com",
          postedAt: data.datePosted || new Date().toISOString(),
          source: "BDJobs"
        });
      } else if (Array.isArray(data)) {
        for (const item of data) {
          if (item["@type"] === "JobPosting") {
            jobs.push({
              id: `bdjobs-jsonld-${idx++}`,
              title: item.title || "Job Opening",
              company: item.hiringOrganization?.name || "Company",
              location: item.jobLocation?.address?.addressLocality || "Bangladesh",
              url: item.url || "https://bdjobs.com",
              postedAt: item.datePosted || new Date().toISOString(),
              source: "BDJobs"
            });
          }
        }
      }
    } catch {
      // Skip malformed JSON-LD
    }
  }
  return jobs;
}

/**
 * Scrape BDJobs search results for a given query.
 *
 * BDJobs search URL:
 * https://jobs.bdjobs.com/jobssearch.asp?txt=python+developer&Category=15
 *
 * Category codes (relevant ones):
 * 15 = IT / Telecommunication
 * 1  = Accounting / Finance
 * 22 = Data Entry / Operator
 */
export async function scrapeBDJobs(
  query: string,
  categoryCode = 15
): Promise<BDJobsPosting[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://jobs.bdjobs.com/jobssearch.asp?txt=${encoded}&Category=${categoryCode}&Country=1&fage=2&iPageSize=20`;

  try {
    const res = await fetch(url, {
      headers: BDJOBS_HEADERS,
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      console.warn(`[BDJobs] HTTP ${res.status} for query "${query}"`);
      return [];
    }

    const html = await res.text();

    // Try JSON-LD first (structured, reliable)
    const jsonLdJobs = parseJobsFromJsonLd(html);
    if (jsonLdJobs.length > 0) return jsonLdJobs;

    // Fall back to HTML parsing
    return parseJobsFromHTML(html, query);
  } catch (err) {
    console.warn(`[BDJobs] Fetch error:`, err instanceof Error ? err.message : String(err));
    return [];
  }
}

/**
 * Convert BDJobs postings to the standard LiveJobPosting shape
 * (imported from live-fetch.ts at usage site to avoid circular dep).
 */
export function toBDJobsLiveFormat(postings: BDJobsPosting[]) {
  return postings.map((p) => ({
    id: p.id,
    title: p.title,
    company: p.company,
    location: p.location,
    type: "onsite" as const,
    salary: p.salary,
    tags: [],
    url: p.url,
    postedAt: p.postedAt,
    source: "BDJobs" as const,
    description: p.deadline ? `Deadline: ${p.deadline}` : undefined,
    isRemote: false
  }));
}
