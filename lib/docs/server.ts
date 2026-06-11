import { getDocBySlug as _getDocBySlug } from '@/lib/supabase/queries/docs';
import type { DocRecord } from '@/types';

export type { DocRecord };

export async function fetchDocBySlug(slug: string): Promise<DocRecord | null> {
  return _getDocBySlug(slug);
}

export function isDocVisible(doc: DocRecord | null, now = new Date()): boolean {
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
