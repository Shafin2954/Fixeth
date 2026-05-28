"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  ensureUserProfileRow,
  type UserProfileRow
} from "@/lib/supabase/queries/profile";
import { AppThemeProvider } from "@/components/providers/app-theme-provider";
import { CourseProvider } from "@/components/providers/course-provider";
import { AppChrome } from "@/components/layout/app-chrome";

export function AppAuthShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profileRow, setProfileRow] = useState<UserProfileRow | null>(null);

  const loadProfile = useCallback(
    async (user: SupabaseUser) => {
      const row = await ensureUserProfileRow(user);
      setProfileRow(row);
      return row;
    },
    []
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
      await loadProfile(user);
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
      void loadProfile(session.user);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile, router, supabase]);

  const handleSignOut = useCallback(async () => {
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
    <AppThemeProvider
      authUser={authUser}
      initialProfile={profileRow}
      onSignOut={handleSignOut}
    >
      <CourseProvider>
        <AppChrome>{children}</AppChrome>
      </CourseProvider>
    </AppThemeProvider>
  );
}
