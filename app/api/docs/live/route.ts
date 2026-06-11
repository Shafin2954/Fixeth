import { NextResponse } from 'next/server';
import { getLiveStats } from '@/lib/supabase/queries/docs';

export async function GET() {
  try {
    const stats = await getLiveStats();
    return NextResponse.json({ data: stats, error: null });
  } catch (err) {
    console.error('[API /docs/live]', err);
    return NextResponse.json({ data: { tracks: 0, lessons: 0, users: 0, enrollments: 0, features: 0 }, error: null });
  }
}
