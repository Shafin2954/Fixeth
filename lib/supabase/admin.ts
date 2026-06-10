import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPACKAGE_SERVICE_KEY;

export function createAdminClient() {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Check if a user is a platform admin.
 * @param supabase - A supabase client (can be service role or regular)
 * @param userId - The user's id (UUID)
 * @returns Promise<boolean> - true if the user is a platform admin
 */
export async function isPlatformAdmin(supabase: any, userId: string): Promise<boolean> {
  // TODO: Fix typing to properly accept Supabase client
  // Using 'any' for now to work around type incompatibilities between
  // different Supabase client variants (ssr vs js)
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[isPlatformAdmin] Error fetching user role:', error);
    return false;
  }

  return data?.role === 'platform_admin';
}

