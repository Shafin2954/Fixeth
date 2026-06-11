'use client';
import React, { useEffect, useState } from 'react';
import type { LiveStats } from '@/types';

const STAT_LABELS: { key: keyof LiveStats; label: string; suffix?: string }[] = [
  { key: 'tracks', label: 'Published Tracks' },
  { key: 'lessons', label: 'Lessons' },
  { key: 'users', label: 'Registered Learners' },
  { key: 'enrollments', label: 'Enrollments' },
  { key: 'features', label: 'Platform Features' }
];

export default function LiveStats() {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    fetch('/api/docs/live')
      .then(r => r.json())
      .then(j => { if (j.data) setStats(j.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 my-4">
      {STAT_LABELS.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-xl border border-gray-800 bg-[#010409] p-4 text-center"
        >
          <div className="text-3xl font-black text-white">
            {stats === null ? (
              <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-800" />
            ) : (
              stats[key].toLocaleString()
            )}
          </div>
          <div className="mt-1 text-xs text-gray-400">{label}</div>
        </div>
      ))}
    </div>
  );
}
