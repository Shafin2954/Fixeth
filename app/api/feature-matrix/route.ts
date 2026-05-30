import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SEED = [
  { name: 'RAG Tutor', description: 'Retrieval-augmented tutor using pgvector and LLMs', status: 'current' },
  { name: 'Playwright Job Scraper', description: 'Weekly job market scraping via Playwright', status: 'current' },
  { name: 'Docs Live Module', description: 'Public docs + pitch deck with scheduling and admin controls', status: 'current' }
];

export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('features').select('*').order('created_at', { ascending: true });
    if (error) {
      // If table missing or other DB error, return sample (non-persistent)
      return NextResponse.json({ data: SEED.map((s, i) => ({ id: `sample-${i+1}`, ...s })) });
    }

    // If table exists but empty, seed it and return the inserted rows
    if (!data || data.length === 0) {
      const { data: inserted, error: insertErr } = await supabase.from('features').insert(SEED).select();
      if (insertErr) {
        // Insert failed, but still return sample
        return NextResponse.json({ data: SEED.map((s, i) => ({ id: `sample-${i+1}`, ...s })) });
      }
      return NextResponse.json({ data: inserted });
    }

    return NextResponse.json({ data });
  } catch (err) {
    // Fallback: return sample
    return NextResponse.json({ data: SEED.map((s, i) => ({ id: `sample-${i+1}`, ...s })) });
  }
}
