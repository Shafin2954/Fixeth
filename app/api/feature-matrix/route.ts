import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('features').select('*').order('created_at', { ascending: true });
    if (error) {
      return NextResponse.json({ data: [
        { id: 'sample-1', name: 'RAG Tutor', description: 'Retrieval-augmented tutor using pgvector and LLMs', status: 'current' },
        { id: 'sample-2', name: 'Playwright Job Scraper', description: 'Weekly job market scraping via Playwright', status: 'current' },
        { id: 'sample-3', name: 'Docs Live Module', description: 'Public docs + pitch deck with scheduling and admin controls', status: 'current' }
      ]});
    }
    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ data: [
      { id: 'sample-1', name: 'RAG Tutor', description: 'Retrieval-augmented tutor using pgvector and LLMs', status: 'current' }
    ]});
  }
}
