import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isPlatformAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isPlatformAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ data: null, error: 'No file provided' }, { status: 400 });
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json({ data: null, error: 'Invalid file type. Use JPEG, PNG, or WebP.' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ data: null, error: 'File too large. Max 2MB.' }, { status: 400 });
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = await file.arrayBuffer();

    const admin = createAdminClient();
    const { error: uploadError } = await admin.storage
      .from('team-avatars')
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = admin.storage.from('team-avatars').getPublicUrl(filename);

    return NextResponse.json({ data: { url: urlData.publicUrl }, error: null });
  } catch (err) {
    console.error('[API admin/team/avatar]', err);
    return NextResponse.json(
      { data: null, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
