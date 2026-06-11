import { NextRequest, NextResponse } from 'next/server';
import { fetchDocBySlug, isDocVisible } from '@/lib/docs/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'main';

  try {
    const doc = await fetchDocBySlug(slug);
    if (!doc || !isDocVisible(doc)) {
      return new NextResponse('Not available', { status: 404 });
    }

    const c = doc.content;
    const lines: string[] = [];

    lines.push(`# ${doc.title}`);
    if (c.hero?.subtitle) lines.push(`\n> ${c.hero.subtitle}`);
    if (c.hero?.tagline) lines.push(`\n*${c.hero.tagline}*`);
    lines.push('');

    if (c.meta?.github_url) {
      lines.push(`**GitHub:** ${c.meta.github_url}\n`);
    }

    if (c.slides?.length) {
      lines.push('## Pitch Deck\n');
      for (const slide of c.slides) {
        lines.push(`### ${slide.title}\n\n${slide.body}\n`);
      }
    }

    if (c.sections?.length) {
      for (const section of c.sections) {
        if (section.type === 'feature-matrix' || section.type === 'live-stats') continue;
        lines.push(`## ${section.title}\n\n${section.body}\n`);
      }
    }

    if (c.team) {
      lines.push('## Team\n');
      if (c.team.name) lines.push(`**${c.team.name}**\n`);
      for (const m of c.team.members ?? []) {
        const emailPart = m.email ? ` — ${m.email}` : '';
        lines.push(`- **${m.full_name}** (${m.role})${emailPart}`);
      }
    }

    const markdown = lines.join('\n');
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}.md"`
      }
    });
  } catch (err) {
    console.error('[API docs/export]', err);
    return new NextResponse('Export failed', { status: 500 });
  }
}
