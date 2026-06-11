import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isPlatformAdmin } from '@/lib/supabase/admin';

type ApiKeySlot = {
  slot: number;
  key: string;
  status: 'active' | 'limit_used' | 'empty';
};

function maskKey(key: string) {
  if (!key) return '';
  return key.length <= 8 ? `${key.slice(0, 4)}...` : `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export async function GET() {
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

    const admin = createAdminClient();

    const [docResult, keysResult, logsResult] = await Promise.all([
      admin
        .from('docs')
        .select('id, slug, title, content, is_published, visible_override, start_ts, end_ts, updated_at')
        .eq('slug', 'main')
        .maybeSingle(),
      admin
        .from('admin_config')
        .select('value')
        .eq('key', 'api_keys')
        .maybeSingle(),
      admin
        .from('admin_audit')
        .select('action, details, actor, created_at')
        .order('created_at', { ascending: false })
        .limit(100)
    ]);

    if (docResult.error) throw docResult.error;
    if (keysResult.error) throw keysResult.error;
    if (logsResult.error) throw logsResult.error;

    const slots = (keysResult.data?.value as { slots?: ApiKeySlot[] } | null)?.slots ?? [];

    return NextResponse.json({
      data: {
        doc: docResult.data,
        apiKeys: slots.map(slot => ({
          slot: slot.slot,
          key: maskKey(slot.key),
          status: slot.status
        })),
        auditLogs: logsResult.data ?? []
      },
      error: null
    });
  } catch (err) {
    console.error('[API Admin Overview]', err);
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
