'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Calendar, CheckCircle } from 'lucide-react';
import type { DocVisibilityMode } from '@/types';

interface Props {
  slug: string;
  initialMode: DocVisibilityMode;
  initialStartTs: string | null;
  initialEndTs: string | null;
  onSaved?: () => void;
}

function toDatetimeLocal(ts: string | null): string {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ''; }
}

function fromDatetimeLocal(val: string): string | null {
  if (!val) return null;
  return new Date(val).toISOString();
}

function statusBadge(mode: DocVisibilityMode, startTs: string | null, endTs: string | null) {
  const now = new Date();
  if (mode === 'off') return { label: 'Hidden — /docs returns 403', color: 'text-red-400', icon: EyeOff };
  if (mode === 'always-on') return { label: 'Public — always visible', color: 'text-green-400', icon: Eye };
  if (startTs && endTs) {
    const s = new Date(startTs), e = new Date(endTs);
    if (now < s) return { label: `Scheduled — visible from ${s.toLocaleDateString()}`, color: 'text-yellow-400', icon: Calendar };
    if (now > e) return { label: `Expired — window ended ${e.toLocaleDateString()}`, color: 'text-red-400', icon: EyeOff };
    return { label: `Public now — until ${e.toLocaleDateString()} ${e.toLocaleTimeString()}`, color: 'text-green-400', icon: CheckCircle };
  }
  return { label: 'Scheduled — no window set', color: 'text-yellow-400', icon: Calendar };
}

export default function VisibilityScheduler({ slug, initialMode, initialStartTs, initialEndTs, onSaved }: Props) {
  const [mode, setMode] = useState<DocVisibilityMode>(initialMode);
  const [startTs, setStartTs] = useState(toDatetimeLocal(initialStartTs));
  const [endTs, setEndTs] = useState(toDatetimeLocal(initialEndTs));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const badge = statusBadge(mode, initialStartTs, initialEndTs);
  const BadgeIcon = badge.icon;

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/admin/docs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visibility: {
            mode,
            start_ts: mode === 'scheduled' ? fromDatetimeLocal(startTs) : null,
            end_ts: mode === 'scheduled' ? fromDatetimeLocal(endTs) : null
          }
        })
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Save failed');
      setStatus('Saved');
      onSaved?.();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-[#0d1117] p-5">
      <h3 className="mb-1 text-sm font-bold text-white">Visibility & Access Control</h3>
      <div className={`mb-4 flex items-center gap-2 text-xs ${badge.color}`}>
        <BadgeIcon size={13} />
        {badge.label}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {(['off', 'scheduled', 'always-on'] as DocVisibilityMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition-colors ${
              mode === m
                ? 'border-[#00C896] bg-[#00C896]/10 text-[#00C896]'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {m === 'off' ? 'Off' : m === 'scheduled' ? 'Scheduled' : 'Always On'}
          </button>
        ))}
      </div>

      {mode === 'scheduled' && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block mb-1 text-xs text-gray-400">Start date &amp; time</label>
            <input
              type="datetime-local"
              value={startTs}
              onChange={e => setStartTs(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#010409] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
          </div>
          <div>
            <label className="block mb-1 text-xs text-gray-400">End date &amp; time</label>
            <input
              type="datetime-local"
              value={endTs}
              onChange={e => setEndTs(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#010409] px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-[#00C896] px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Visibility'}
        </button>
        {status && (
          <span className={`text-xs ${status === 'Saved' ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
