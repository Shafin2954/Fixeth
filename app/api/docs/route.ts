import { NextResponse } from 'next/server';
import { fetchDocBySlug } from '@/lib/docs/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'main';
  try {
    const doc = await fetchDocBySlug(slug);
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: doc });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
