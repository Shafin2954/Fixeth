import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchLiveJobs } from "@/lib/jobs/live-fetch";

const QuerySchema = z.object({
  q: z.string().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional()
});

export async function GET(request: Request) {
  const parsed = QuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const query = parsed.data.q ?? "software developer";
    const limit = parsed.data.limit ?? 30;
    const { jobs, sources, errors } = await fetchLiveJobs(query);
    const sliced = jobs.slice(0, limit);

    return NextResponse.json({
      data: { jobs: sliced, sources, total: sliced.length },
      error: errors.length > 0 ? errors.join("; ") : null
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch live jobs";
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
