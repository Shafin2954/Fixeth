import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runJobMatchesAgent } from "@/lib/agents/job-intelligence";

const QuerySchema = z.object({
  userId: z.string().uuid().optional()
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = QuerySchema.parse({
      userId: url.searchParams.get("userId") ?? undefined
    });

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const userId = parsed.userId || user?.id;
    if (!userId) {
      return NextResponse.json(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await runJobMatchesAgent(userId);
    return NextResponse.json({ data, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message || "Failed to fetch job matches" },
      { status: 400 }
    );
  }
}
