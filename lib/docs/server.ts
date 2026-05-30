import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export type DocRecord = {
  id: string;
  slug: string;
  title: string;
  content: any;
  is_published: boolean;
  visible_override: boolean;
  start_ts: string | null;
  end_ts: string | null;
};

function loadSeedContent() {
  try {
    const p = path.join(process.cwd(), 'docs', 'seed_main_doc.json');
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export async function fetchDocBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('docs').select('*').eq('slug', slug).limit(1).single();
  if (error) throw error;
  const seed = loadSeedContent();
  // If DB row exists but content is empty or missing key parts, merge with seed so viewer shows something
  if (data) {
    const content = data.content || {};
    const needsSeed = !content.slides || content.slides.length === 0 || !content.sections || content.sections.length === 0 || !content.team || content.team.length === 0;
    if (needsSeed && seed) {
      data.content = {
        ...seed,
        ...content // DB content overrides seed where present
      };
    }
  }
  return data as DocRecord | null;
}

export function isDocVisible(doc: DocRecord | null, now = new Date()) {
  if (!doc) return false;
  if (!doc.is_published) return false;
  if (doc.visible_override) return true;
  if (doc.start_ts && doc.end_ts) {
    const s = new Date(doc.start_ts);
    const e = new Date(doc.end_ts);
    return now >= s && now <= e;
  }
  return true;
}

export async function requireAdmin(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  const { data: profile } = await supabase.from('users').select('role,is_admin').eq('id', user.id).limit(1).single();
  const isAdmin = (profile && (profile.is_admin === true || profile.role === 'admin')) || false;
  if (!isAdmin) throw new Error('Forbidden');
  return user;
}
