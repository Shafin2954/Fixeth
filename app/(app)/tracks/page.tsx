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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchAllTracksClient(),
      fetchUserEnrollmentsClient(authUser.id)
    ]).then(([allTracks, enrollments]) => {
      if (!cancelled) {
        setTracks(allTracks);
        setEnrolledIds(new Set(enrollments.map((e) => e.track_id)));
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [authUser.id]);

  const load = useCallback(async () => {
    setLoading(true);
    const [allTracks, enrollments] = await Promise.all([
      fetchAllTracksClient(),
      fetchUserEnrollmentsClient(authUser.id)
    ]);
    setTracks(allTracks);
    setEnrolledIds(new Set(enrollments.map((e) => e.track_id)));
    setLoading(false);
  }, [authUser.id]);

  const enrolledTrackIds = useMemo(() => enrolledIds, [enrolledIds]);

  return (
    <TrackLibraryScreen
      T={T}
      lang={lang}
      tracks={tracks}
      enrolledTrackIds={enrolledTrackIds}
      userId={authUser.id}
      loading={loading}
      onEnrolled={load}
    />
  );
}
