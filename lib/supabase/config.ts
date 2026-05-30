// Central Supabase connection config.
//
// The app's curriculum, auth, enrollments and progress all live in the
// project below. These are PUBLIC values (a project URL + an RLS-protected
// publishable key), so it is safe to commit them as defaults.
//
// To point the app at a different project, set NEXT_PUBLIC_SUPABASE_DATA_URL
// and NEXT_PUBLIC_SUPABASE_DATA_KEY. We intentionally do NOT fall back to the
// generic NEXT_PUBLIC_SUPABASE_URL / *_KEY vars, because a connected v0
// integration may inject those pointing at a different (empty) project.

const DEFAULT_SUPABASE_URL = "https://oxfynuytsnifqqhbmpcv.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_ATVf_la2Z6kuYO3rp1MIyg_SnBm0Snd";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_DATA_URL || DEFAULT_SUPABASE_URL;

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_DATA_KEY || DEFAULT_SUPABASE_KEY;
