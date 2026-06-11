'use client';
import React from 'react';
import type { TeamMember } from '@/types';

function avatarUrl(member: TeamMember): string {
  if (member.avatar_url) return member.avatar_url;
  const name = encodeURIComponent(member.full_name || 'Team');
  return `https://ui-avatars.com/api/?name=${name}&background=0B1117&color=00C896&size=200&bold=true`;
}

export default function TeamGrid({ teamName, members }: { teamName?: string; members: TeamMember[] }) {
  return (
    <div>
      {teamName && (
        <p className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-widest">{teamName}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((m) => (
          <div
            key={m.id || m.full_name}
            className="flex flex-col items-center gap-3 rounded-xl border border-gray-800 bg-[#010409] p-5 text-center"
          >
            <div className="relative h-20 w-20 flex-shrink-0">
              <img
                src={avatarUrl(m)}
                alt={m.full_name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-700"
                onError={(e) => {
                  const img = e.currentTarget;
                  const name = encodeURIComponent(m.full_name || 'T');
                  img.src = `https://ui-avatars.com/api/?name=${name}&background=0B1117&color=00C896&size=200&bold=true`;
                }}
              />
            </div>
            <div>
              <div className="font-bold text-white leading-tight">{m.full_name}</div>
              <div className="mt-0.5 text-sm text-gray-400">{m.role}</div>
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="mt-1 block text-xs text-gray-500 hover:text-gray-300 truncate max-w-[160px] mx-auto"
                >
                  {m.email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
