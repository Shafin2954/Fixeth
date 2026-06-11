import { NextResponse } from "next/server";
import { z } from "zod";
import { awardSkillsForLesson } from "@/lib/supabase/queries/jobs";

const BodySchema = z.object({
  userId: z.string().uuid(),
  lessonId: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, lessonId } = parsed.data;
    const awardedSkills = await awardSkillsForLesson(userId, lessonId);

    return NextResponse.json({
      data: { awardedSkills, count: awardedSkills.length },
      error: null
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to award skills";
    return NextResponse.json({ data: null, error: message }, { status: 500 });
  }
}
