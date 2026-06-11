import { NextResponse } from 'next/server';
import { fetchDocBySlug } from '@/lib/docs/server';
import type { DocTeam } from '@/types';

export async function GET() {
  try {
    const doc = await fetchDocBySlug('main');
    const team: DocTeam = doc?.content?.team ?? { members: [] };
    return NextResponse.json({ data: team, error: null });
  } catch (err) {
    console.error('[API /team]', err);
    return NextResponse.json({ data: { members: [] }, error: null });
  }
}
