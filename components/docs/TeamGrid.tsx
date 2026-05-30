'use client';
import React from 'react';

export default function TeamGrid({ members }: { members: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {members.map((m: any) => (
        <div key={m.email || m.full_name} className="flex items-center gap-4 p-3 border rounded-lg bg-white/80">
          <img
            src={m.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.full_name || 'Team')}&background=0D9488&color=fff`}
            alt={m.full_name}
            className="w-16 h-16 rounded-full object-cover"
            width={64}
            height={64}
          />
          <div>
            <div className="font-semibold">{m.full_name}</div>
            <div className="text-sm text-muted">{m.role}</div>
            <div className="text-xs text-muted">{m.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
