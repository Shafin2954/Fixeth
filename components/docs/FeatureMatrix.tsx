'use client';
import React, { useEffect, useState } from 'react';

export default function FeatureMatrix({ slug }: { slug?: string }) {
  const [features, setFeatures] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/feature-matrix').then((r) => r.json()).then((j) => setFeatures(j.data || []));
  }, []);
  return (
    <div className="space-y-2">
      {features.map((f) => (
        <div key={f.id} className="p-3 border rounded flex justify-between items-start">
          <div>
            <div className="font-semibold">{f.name}</div>
            <div className="text-sm text-muted">{f.description}</div>
          </div>
          <div className="text-sm px-2 py-1 rounded" style={{ background: f.status === 'current' ? '#DCFCE7' : f.status === 'upcoming' ? '#FEF3C7' : '#FEE2E2' }}>{f.status}</div>
        </div>
      ))}
    </div>
  );
}
