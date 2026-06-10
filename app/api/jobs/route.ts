import { NextResponse } from "next/server";
import { z } from "zod";
import { runJobSignalsAgent } from "@/lib/agents/job-intelligence";

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(25).optional().default(10)
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = QuerySchema.parse({
      limit: url.searchParams.get("limit") ?? undefined
    });

    const data = await runJobSignalsAgent(parsed.limit);
    return NextResponse.json({ data, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message || "Failed to fetch job signals" },
      { status: 400 }
    );
  }
}
