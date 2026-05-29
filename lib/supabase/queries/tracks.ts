import { createClient } from "@/lib/supabase/server";
import type { Track } from "@/types";

/** All tracks for the library (published + coming soon) */
export async function getTrackLibrary(): Promise<Track[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("tier")
    .order("title_en");

  if (error) {
    console.error("[getTrackLibrary]", error.message);
    return [];
  }
  return (data as Track[]) || [];
}

export async function getAllTracks(): Promise<Track[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("published", true)
    .order("tier")
    .order("title_en");

  if (error) {
    console.error("[getAllTracks]", error.message);
    return [];
  }
  return (data as Track[]) || [];
}

export async function getPublishedTracksForOnboarding(): Promise<Track[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("published", true)
    .order("tier")
    .order("title_en");

  if (error) {
    console.error("[getPublishedTracksForOnboarding]", error.message);
    return [];
  }
  return (data as Track[]) || [];
}

export async function getTrackBySlug(slug: string): Promise<Track | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getTrackBySlug]", error.message);
    return null;
  }
  return data as Track | null;
}

export async function getTrackById(id: string): Promise<Track | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getTrackById]", error.message);
    return null;
  }
  return data as Track | null;
}
