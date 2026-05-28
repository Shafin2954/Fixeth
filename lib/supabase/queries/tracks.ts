import { createClient } from "@/lib/supabase/server";
import { Track } from '@/types'

export async function getAllTracks(): Promise<Track[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tracks')
    .select('*')
    .eq('published', true)
  return data || []
}

export async function getTrackBySlug(slug: string): Promise<Track | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tracks')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getTrackById(id: string): Promise<Track | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .single()
  return data
}
