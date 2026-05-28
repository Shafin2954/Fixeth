"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import FrontendApp from "@/frontend/src/App";
import { createClient } from "@/utils/supabase/client";

type FrontendUser = {
  name: string;
  email: string;
  title?: string;
  location?: string;
  bio?: string;
};

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  preferred_language: string | null;
  preferred_theme: string | null;
  goal: string | null;
  experience_level: string | null;
  onboarding_complete: boolean | null;
};

const getDisplayName = (authUser: SupabaseUser, row?: UserRow | null) =>
  row?.name ||
  authUser.user_metadata?.full_name ||
  authUser.user_metadata?.name ||
  authUser.email?.split("@")[0] ||
  "Learner";

const toFrontendUser = (authUser: SupabaseUser, row?: UserRow | null): FrontendUser => ({
  name: getDisplayName(authUser, row),
  email: authUser.email || row?.email || "",
  title: "Learner",
  location: "Dhaka, Bangladesh",
  bio: "Focused on practical, job-ready engineering skills."
});

export function FinalizedFrontendShell() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profileRow, setProfileRow] = useState<UserRow | null>(null);

  const ensureUserRow = useCallback(
    async (user: SupabaseUser) => {
      const baseRow = {
        id: user.id,
        email: user.email || "",
        name: getDisplayName(user),
        avatar_url: user.user_metadata?.avatar_url || null,
        last_active: new Date().toISOString()
      };

      const { data } = await supabase
        .from("users")
        .upsert(baseRow, { onConflict: "id" })
        .select(
          "id,email,name,avatar_url,preferred_language,preferred_theme,goal,experience_level,onboarding_complete"
        )
        .single();

      setProfileRow((data as UserRow | null) ?? null);
    },
    [supabase]
  );

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) return;

      const user = data.session?.user ?? null;
      if (!user) {
        router.replace("/login");
        return;
      }

      setAuthUser(user);
      await ensureUserRow(user);
      if (isMounted) setIsLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        router.replace("/login");
        return;
      }

      setAuthUser(session.user);
      void ensureUserRow(session.user);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [ensureUserRow, router, supabase]);

  const syncUser = useCallback(
    async (nextUser: FrontendUser) => {
      if (!authUser) return;

      await supabase.from("users").upsert(
        {
          id: authUser.id,
          email: authUser.email || nextUser.email,
          name: nextUser.name,
          last_active: new Date().toISOString()
        },
        { onConflict: "id" }
      );
    },
    [authUser, supabase]
  );

  const syncPreferences = useCallback(
    async ({ lang, isDark }: { lang: string; isDark: boolean }) => {
      if (!authUser) return;

      await supabase
        .from("users")
        .update({
          preferred_language: lang,
          preferred_theme: isDark ? "dark" : "light",
          last_active: new Date().toISOString()
        })
        .eq("id", authUser.id);
    },
    [authUser, supabase]
  );

  const completeOnboarding = useCallback(
    async (data: { lang: string; goal: string; level: string }) => {
      if (!authUser) return;

      await supabase
        .from("users")
        .update({
          preferred_language: data.lang,
          goal: data.goal,
          experience_level: data.level,
          onboarding_complete: true,
          last_active: new Date().toISOString()
        })
        .eq("id", authUser.id);

      setProfileRow((row) =>
        row
          ? {
              ...row,
              preferred_language: data.lang,
              goal: data.goal,
              experience_level: data.level,
              onboarding_complete: true
            }
          : row
      );
    },
    [authUser, supabase]
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem("fixeth.userProfile");
    localStorage.removeItem("fixeth.userPreferences");
    await supabase.auth.signOut();
    router.replace("/login");
  }, [router, supabase]);

  if (isLoading || !authUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] text-[#EEEEF8]">
        <div className="text-sm font-semibold text-[#00C896]">Loading Fixeth...</div>
      </main>
    );
  }

  return (
    <FrontendApp
      initialUser={toFrontendUser(authUser, profileRow)}
      initialOnboardingComplete={Boolean(profileRow?.onboarding_complete)}
      onUserChange={syncUser}
      onPreferencesChange={syncPreferences}
      onOnboardingComplete={completeOnboarding}
      onSignOut={signOut}
    />
  );
}
