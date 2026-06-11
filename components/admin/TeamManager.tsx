'use client';
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TeamMember, DocTeam } from '@/types';
import ImageUpload from './ImageUpload';

interface Props {
  team: DocTeam;
  onChange: (team: DocTeam) => void;
}

export default function TeamManager({ team, onChange }: Props) {
  const members = team.members ?? [];

  function updateName(val: string) {
    onChange({ ...team, name: val });
  }

  function updateMember(index: number, field: keyof TeamMember, value: string | null) {
    const next = members.map((m, i) => i === index ? { ...m, [field]: value } : m);
    onChange({ ...team, members: next });
  }

  function addMember() {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      full_name: '',
      role: '',
      email: null,
      avatar_url: null
    };
    onChange({ ...team, members: [...members, newMember] });
  }

  function removeMember(index: number) {
    onChange({ ...team, members: members.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-xs text-gray-400">Team name (optional)</label>
        <input
          value={team.name ?? ''}
          onChange={e => updateName(e.target.value)}
          placeholder="e.g. Team Fixeth"
          className="w-full max-w-xs rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
        />
      </div>

      {members.map((m, i) => (
        <div key={m.id} className="rounded-lg border border-gray-700 bg-[#010409] p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <ImageUpload
                currentUrl={m.avatar_url}
                memberName={m.full_name}
                onUploaded={url => updateMember(i, 'avatar_url', url)}
              />
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-xs text-gray-400">Full name *</label>
                  <input
                    value={m.full_name}
                    onChange={e => updateMember(i, 'full_name', e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-400">Role *</label>
                  <input
                    value={m.role}
                    onChange={e => updateMember(i, 'role', e.target.value)}
                    placeholder="e.g. Team Lead"
                    className="w-full rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-xs text-gray-400">Email (optional)</label>
                  <input
                    type="email"
                    value={m.email ?? ''}
                    onChange={e => updateMember(i, 'email', e.target.value || null)}
                    placeholder="email@example.com"
                    className="w-full rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => removeMember(i)}
              className="rounded p-1 text-gray-600 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addMember}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200 w-full justify-center"
      >
        <Plus size={14} /> Add Team Member
      </button>
    </div>
  );
}
