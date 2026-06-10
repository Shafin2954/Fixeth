import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getTrendingJobSignals } from '@/lib/supabase/queries/jobs'

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
})

export async function GET(request: Request) {
  const parsed = QuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams))
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const limit = parsed.data.limit ?? 10
    const trendingSkills = await getTrendingJobSignals(limit)
    const curriculumGaps = trendingSkills
      .filter((skill) => !skill.inCurriculum)
      .map((skill) => ({
        skill: skill.skill,
        demandScore: skill.mentionCount,
        recommendation: `Add or expand ${skill.skill} coverage in active tracks`,
      }))

    return NextResponse.json({ data: { trendingSkills, curriculumGaps }, error: null })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}
