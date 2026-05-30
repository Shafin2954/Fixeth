'use client';
import React, { useEffect, useState } from 'react';

export default function FeatureMatrix({ slug }: { slug?: string }) {
  const [features, setFeatures] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    fetch('/api/feature-matrix').then((r) => r.json()).then((j) => setFeatures((j.data as Record<string, unknown>[]) || []));
  }, []);
  return (
    <div className="space-y-2">
      {features.map((f) => {
        const status = String(f['status'] ?? '');
        const pillClass = status === 'current'
          ? 'bg-emerald-700 text-white'
          : status === 'upcoming'
          ? 'bg-yellow-600 text-white'
          : 'bg-red-600 text-white';
        return (
          <div key={String(f['id'])} className="p-3 border rounded flex justify-between items-start bg-[#010409] border-gray-700">
            <div>
              <div className="font-semibold text-white">{String(f['name'])}</div>
              <div className="text-sm text-gray-400">{String(f['description'] ?? '')}</div>
            </div>
            <div className={`text-sm px-2 py-1 rounded ${pillClass}`}>{status}</div>
          </div>
        );
      })}
    </div>
  );
}
