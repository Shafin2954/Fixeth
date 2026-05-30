'use client';
import React, { useEffect, useState } from 'react';

export default function FeatureMatrix({ slug }: { slug?: string }) {
  const [features, setFeatures] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/feature-matrix').then((r) => r.json()).then((j) => setFeatures(j.data || []));
  }, []);
  return (
    <div className="space-y-2">
      {features.map((f) => {
        const pillClass = f.status === 'current'
          ? 'bg-emerald-700 text-white'
          : f.status === 'upcoming'
          ? 'bg-yellow-600 text-white'
          : 'bg-red-600 text-white';
        return (
          <div key={f.id} className="p-3 border rounded flex justify-between items-start bg-[#010409] border-gray-700">
            <div>
              <div className="font-semibold text-white">{f.name}</div>
              <div className="text-sm text-gray-400">{f.description}</div>
            </div>
            <div className={`text-sm px-2 py-1 rounded ${pillClass}`}>{f.status}</div>
          </div>
        );
      })}
    </div>
  );
}
