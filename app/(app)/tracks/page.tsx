"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TrackLibraryScreen from "@/components/screens/TrackLibraryScreen";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import {
  fetchAllTracksClient,
  fetchUserEnrollmentsClient
} from "@/lib/supabase/queries/enroll-client";
import type { Track } from "@/types";

export default function TrackLibraryPage() {
  const { T, lang, authUser } = useAppTheme();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const [allTracks, enrollments] = await Promise.all([
      fetchAllTracksClient(),
      fetchUserEnrollmentsClient(authUser.id)
    ]);
    setTracks(allTracks);
    setEnrolledIds(new Set(enrollments.map((e) => e.track_id)));
  }, [authUser.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const enrolledTrackIds = useMemo(() => enrolledIds, [enrolledIds]);

  return (
    <TrackLibraryScreen
      T={T}
      lang={lang}
      tracks={tracks}
      enrolledTrackIds={enrolledTrackIds}
      userId={authUser.id}
      onEnrolled={load}
    />
  );
}
