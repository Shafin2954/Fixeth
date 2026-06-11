import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { DocContent, DocVisibilityMode, DocRecord, LiveStats } from '@/types';
import fs from 'fs';
import path from 'path';

function loadSeedContent(): DocContent | null {
  try {
    const p = path.join(process.cwd(), 'docs', 'seed_main_doc.json');
    const raw = fs.readFileSync(p, 'utf8');
    const seed = JSON.parse(raw) as Record<string, unknown>;
    // Normalize legacy seed format (team as array) to new shape
    if (Array.isArray(seed.team)) {
      seed.team = { name: 'Team Fixeth', members: seed.team };
    }
    return seed as unknown as DocContent;
  } catch {
    return null;
  }
}

export async function getDocBySlug(slug: string): Promise<DocRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('docs')
    .select('id, slug, title, content, is_published, visible_override, start_ts, end_ts, updated_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const content = (data.content ?? {}) as Partial<DocContent>;
  const slidesExist = Array.isArray(content.slides) && content.slides.length > 0;
  const sectionsExist = Array.isArray(content.sections) && content.sections.length > 0;
  const teamExist = content.team && Array.isArray(content.team.members) && content.team.members.length > 0;

  if (!slidesExist || !sectionsExist || !teamExist) {
    const seed = loadSeedContent();
    if (seed) {
      data.content = { ...seed, ...content } as DocContent;
    }
  }

  return data as DocRecord;
}

export async function updateDocContent(
  slug: string,
  content: DocContent,
  editor: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('docs')
    .update({ content: content as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
    .eq('slug', slug);
  if (error) throw error;

  await admin.from('admin_audit').insert({
    action: 'doc_updated',
    details: { slug, updated_by: editor },
    actor: editor
  });
}

export async function updateDocVisibility(
  slug: string,
  mode: DocVisibilityMode,
  startTs: string | null,
  endTs: string | null,
  editor: string
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin
    .from('docs')
    .update({
      is_published: mode !== 'off',
      visible_override: mode === 'always-on',
      start_ts: mode === 'scheduled' ? startTs : null,
      end_ts: mode === 'scheduled' ? endTs : null,
      updated_at: new Date().toISOString()
    })
    .eq('slug', slug);
  if (error) throw error;

  await admin.from('admin_audit').insert({
    action: 'doc_visibility_updated',
    details: { slug, mode, updated_by: editor },
    actor: editor
  });
}

export async function getAdminDocOverview(slug: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('docs')
    .select('id, slug, title, content, is_published, visible_override, start_ts, end_ts, updated_at')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as DocRecord | null;
}

export async function getLiveStats(): Promise<LiveStats> {
  const supabase = await createClient();

  const results = await Promise.allSettled([
    supabase.from('tracks').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('lessons').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }),
    supabase.from('features').select('id', { count: 'exact', head: true })
  ]);

  const [tracks, lessons, users, enrollments, features] = results.map(r =>
    r.status === 'fulfilled' ? (r.value.count ?? 0) : 0
  );

  return {
    tracks: tracks as number,
    lessons: lessons as number,
    users: users as number,
    enrollments: enrollments as number,
    features: features as number
  };
}
