"use client";

import { useCallback, useEffect, useState } from "react";
import MyTracksScreen from "@/components/screens/MyTracksScreen";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import {
  fetchUserEnrollmentsClient,
  type EnrollmentWithTrack
} from "@/lib/supabase/queries/enroll-client";

export default function MyTracksPage() {
  const { T, lang, authUser } = useAppTheme();
  const [enrollments, setEnrollments] = useState<EnrollmentWithTrack[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchUserEnrollmentsClient(authUser.id);
    setEnrollments(rows);
    setLoading(false);
  }, [authUser.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <MyTracksScreen
      T={T}
      lang={lang}
      enrollments={enrollments}
      loading={loading}
      onRefresh={load}
    />
  );
}
