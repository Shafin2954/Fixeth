import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/docs/server';
import { createClient } from '@/lib/supabase/server';

const PatchSchema = z.object({
  slug: z.string().default('main'),
  is_published: z.boolean().optional(),
  visible_override: z.boolean().optional(),
  start_ts: z.string().nullable().optional(),
  end_ts: z.string().nullable().optional(),
  title: z.string().optional(),
  content: z.any().optional()
});

export async function PATCH(req: Request) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const parsed = PatchSchema.parse(body);
    const supabase = await createClient();
    const updates: any = {};
    if (parsed.is_published !== undefined) updates.is_published = parsed.is_published;
    if (parsed.visible_override !== undefined) updates.visible_override = parsed.visible_override;
    if (parsed.start_ts !== undefined) updates.start_ts = parsed.start_ts;
    if (parsed.end_ts !== undefined) updates.end_ts = parsed.end_ts;
    if (parsed.title !== undefined) updates.title = parsed.title;
    if (parsed.content !== undefined) updates.content = parsed.content;

    const { data, error } = await supabase.from('docs').update(updates).eq('slug', parsed.slug).select().single();
    if (error) throw error;
    if (parsed.content !== undefined) {
      await supabase.from('docs_versions').insert({ docs_id: data.id, version_number: 1, content: parsed.content });
    }
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
