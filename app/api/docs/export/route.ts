import { NextResponse } from 'next/server';
import { fetchDocBySlug } from '@/lib/docs/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || 'main';
  const format = url.searchParams.get('format') || 'md';
  const doc = await fetchDocBySlug(slug);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (format === 'md') {
    const content = doc.content || {};
    let md = `# ${doc.title}\n\n`;
    (content.sections || []).forEach((s: any) => {
      md += `## ${s.title}\n\n${s.body || ''}\n\n`;
    });
    return new NextResponse(md, { headers: { 'Content-Type': 'text/markdown' } });
  }
  return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
}
