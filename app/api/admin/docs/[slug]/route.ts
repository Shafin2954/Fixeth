import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isPlatformAdmin } from '@/lib/supabase/admin';
import { updateDocContent, updateDocVisibility } from '@/lib/supabase/queries/docs';
import { z } from 'zod';
import type { DocVisibilityMode } from '@/types';

const SlideSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string()
});

const SectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['markdown', 'mermaid', 'feature-matrix', 'live-stats']),
  body: z.string()
});

const TeamMemberSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  role: z.string(),
  email: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional()
});

const ContentSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    tagline: z.string().optional()
  }),
  slides: z.array(SlideSchema),
  sections: z.array(SectionSchema),
  team: z.object({
    name: z.string().optional(),
    members: z.array(TeamMemberSchema)
  }),
  meta: z.object({
    github_url: z.string().optional()
  }).optional()
});

const VisibilitySchema = z.object({
  mode: z.enum(['off', 'scheduled', 'always-on']),
  start_ts: z.string().nullable().optional(),
  end_ts: z.string().nullable().optional()
});

const BodySchema = z.object({
  content: ContentSchema.optional(),
  visibility: VisibilitySchema.optional()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isPlatformAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json({ data: null, error: 'Forbidden: insufficient permissions' }, { status: 403 });
    }

    const { slug } = await params;
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ data: null, error: 'Invalid slug' }, { status: 400 });
    }

    const rawBody = await request.json();
    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.message }, { status: 400 });
    }

    const { content, visibility } = parsed.data;

    if (content) {
      await updateDocContent(slug, content as Parameters<typeof updateDocContent>[1], user.email ?? 'admin');
    }

    if (visibility) {
      await updateDocVisibility(
        slug,
        visibility.mode as DocVisibilityMode,
        visibility.start_ts ?? null,
        visibility.end_ts ?? null,
        user.email ?? 'admin'
      );
    }

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (err) {
    console.error('[API Admin Docs]', err);
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
