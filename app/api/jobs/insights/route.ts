import { NextResponse } from "next/server";
import { runJobInsightsAgent } from "@/lib/agents/job-intelligence";

export async function GET() {
  try {
    const data = await runJobInsightsAgent();
    return NextResponse.json({ data, error: null });
  } catch (err) {
    return NextResponse.json(
      { data: null, error: (err as Error).message || "Failed to fetch job insights" },
      { status: 500 }
    );
  }
}
