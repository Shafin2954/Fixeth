import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { normalizeUiTier, type UiTier } from "@/lib/tier/config";
import { createEnrollment } from "@/lib/supabase/queries/enrollments";

export type UserProfileRow = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  preferred_theme: string | null;
  goal: string | null;
  experience_level: string | null;
  onboarding_complete: boolean | null;
  ui_tier: number | null;
  streak: number | null;
  role: string | null;
};

export type AppUserProfile = {
  name: string;
  email: string;
  title?: string;
  location?: string;
  bio?: string;
};

export type OnboardingPayload = {
  lang: string;
  /** Track UUID from Supabase */
  trackId: string;
  trackTier?: UiTier;
  goal: string;
  level: string;
  assessmentScore?: number;
  skippedAssessment?: boolean;
  firstLessonId?: string | null;
};

export class ProfileQueryError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ProfileQueryError";
  }
}

const PROFILE_SELECT =
  "id,email,name,avatar_url,preferred_language,preferred_theme,goal,experience_level,onboarding_complete,ui_tier,streak,role";

export function getDisplayName(authUser: SupabaseUser, row?: UserProfileRow | null) {
  return (
    row?.name ||
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    authUser.email?.split("@")[0] ||
    "Learner"
  );
}

export function toAppUser(authUser: SupabaseUser, row?: UserProfileRow | null): AppUserProfile {
  return {
    name: getDisplayName(authUser, row),
    email: authUser.email || row?.email || "",
    title: "Learner",
    location: "Dhaka, Bangladesh",
    bio: "Focused on practical, job-ready engineering skills."
  };
}

export async function ensureUserProfileRow(user: SupabaseUser): Promise<UserProfileRow | null> {
  const supabase = createClient();
  const baseRow = {
    id: user.id,
    email: user.email || "",
    name: getDisplayName(user),
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) || null,
    last_active: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(baseRow, { onConflict: "id" })
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    console.error("[ensureUserProfileRow]", error.message, error.code);
    return null;
  }

  return (data as UserProfileRow | null) ?? null;
}

export async function syncUserProfile(
  userId: string,
  email: string,
  profile: AppUserProfile
) {
  const supabase = createClient();
  const { error } = await supabase.from("users").upsert(
    {
      id: userId,
      email,
      name: profile.name,
      last_active: new Date().toISOString()
    },
    { onConflict: "id" }
  );
  if (error) console.error("[syncUserProfile]", error.message);
}

export async function syncUserPreferences(
  userId: string,
  lang: string,
  isDark: boolean
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("users")
    .update({
      preferred_language: lang,
      preferred_theme: isDark ? "dark" : "light",
      last_active: new Date().toISOString()
    })
    .eq("id", userId);
  if (error) console.error("[syncUserPreferences]", error.message);
}

export async function completeUserOnboarding(
  authUser: SupabaseUser,
  data: OnboardingPayload
): Promise<UserProfileRow> {
  const supabase = createClient();
  const email = authUser.email;
  if (!email) {
    throw new ProfileQueryError("Signed-in user has no email on the auth account.");
  }

  if (!data.trackId) {
    throw new ProfileQueryError("Please select a learning track before continuing.");
  }

  const uiTier = normalizeUiTier(data.trackTier ?? 1);

  const { data: row, error } = await supabase
    .from("users")
    .upsert(
      {
        id: authUser.id,
        email,
        name: getDisplayName(authUser),
        preferred_language: data.lang,
        goal: data.goal,
        experience_level: data.level,
        ui_tier: uiTier,
        onboarding_complete: true,
        last_active: new Date().toISOString()
      },
      { onConflict: "id" }
    )
    .select(PROFILE_SELECT)
    .single();

  if (error) {
    throw new ProfileQueryError(
      error.message ||
        "Could not save onboarding. Check Supabase RLS policies on the users table.",
      error.code
    );
  }

  if (!row?.onboarding_complete) {
    throw new ProfileQueryError(
      "Onboarding was saved but onboarding_complete is still false. Check database defaults and RLS."
    );
  }

  const enrollment = await createEnrollment(
    authUser.id,
    data.trackId,
    data.firstLessonId ?? null
  );

  if (!enrollment) {
    throw new ProfileQueryError(
      "Profile saved but enrollment could not be created. Check RLS on enrollments."
    );
  }

  return row as UserProfileRow;
}
