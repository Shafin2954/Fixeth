import { NextResponse } from 'next/server'
import { getJobMarketInsights } from '@/lib/supabase/queries/jobs'

export async function GET() {
  try {
    const insights = await getJobMarketInsights()
    return NextResponse.json({ data: insights, error: null })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch job market insights'
    return NextResponse.json({ data: null, error: message }, { status: 500 })
  }
}