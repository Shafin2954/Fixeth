'use client';
import React, { useEffect, useState } from 'react';

export default function DocsEditor({ slug }: { slug: string }) {
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/docs?slug=${slug}`).then((r) => r.json()).then((j) => {
      if (j.data) {
        setDoc(j.data as Record<string, unknown>);
        setTitle(String((j.data as Record<string, unknown>)['title'] ?? ''));
        setContent(JSON.stringify((j.data as Record<string, unknown>)['content'] ?? {}, null, 2));
      }
    });
  }, [slug]);

  async function save(publish?: boolean, override?: boolean, start_ts?: string | null, end_ts?: string | null) {
    setLoading(true);
    const body: Record<string, unknown> = { slug, content: JSON.parse(content), title };
    if (publish !== undefined) body.is_published = publish;
    if (override !== undefined) body.visible_override = override;
    if (start_ts !== undefined) body.start_ts = start_ts;
    if (end_ts !== undefined) body.end_ts = end_ts;
    const res = await fetch('/api/docs/admin', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json();
    setLoading(false);
    if (j.data) setDoc(j.data);
    alert(j.error ? `Error: ${j.error}` : 'Saved');
  }

  if (!doc) return <div className="min-h-screen bg-[#0d1117] text-gray-200 p-6">Loading...</div>;

  return (
    <div className="p-6 bg-[#0d1117] text-gray-200 rounded">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Editing: {String(doc['slug'] ?? '')}</h2>
          <a href="https://github.com/rafsan-j/Fixeth" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white">View repo</a>
        </div>
        <div className="text-right">
          <a href="https://github.com/rafsan-j/Fixeth/blob/main/docs/PROMPTS.md" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white mr-3">docs/PROMPTS.md</a>
          <a href="https://github.com/rafsan-j/Fixeth/blob/main/docs/PROMPTS_REGISTRY.csv" target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">docs/PROMPTS_REGISTRY.csv</a>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-[#010409] border border-gray-700 rounded text-gray-200" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Content (JSON)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full p-2 bg-[#010409] border border-gray-700 rounded font-mono text-sm text-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Publish</label>
          <select value={String(doc['is_published'] ?? 'false')} onChange={(e) => void save(e.target.value === 'true')} className="w-full p-2 bg-[#010409] border border-gray-700 rounded text-gray-200">
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Override Visibility</label>
          <select value={String(doc['visible_override'] ?? 'false')} onChange={(e) => void save(undefined, e.target.value === 'true')} className="w-full p-2 bg-[#010409] border border-gray-700 rounded text-gray-200">
            <option value="false">Use Schedule</option>
            <option value="true">Force Visible</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Start Date/Time (ISO)</label>
          <input type="datetime-local" value={doc['start_ts'] ? new Date(String(doc['start_ts'])).toISOString().slice(0,16) : ''} onChange={(e) => void save(undefined, undefined, e.target.value ? new Date(e.target.value).toISOString() : null)} className="w-full p-2 bg-[#010409] border border-gray-700 rounded text-gray-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">End Date/Time (ISO)</label>
          <input type="datetime-local" value={doc['end_ts'] ? new Date(String(doc['end_ts'])).toISOString().slice(0,16) : ''} onChange={(e) => void save(undefined, undefined, undefined, e.target.value ? new Date(e.target.value).toISOString() : null)} className="w-full p-2 bg-[#010409] border border-gray-700 rounded text-gray-200" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => void save(false)} className="px-4 py-2 bg-gray-700 text-white rounded">Save Draft</button>
        <button onClick={() => void save(true)} className="px-4 py-2 bg-emerald-600 text-white rounded">Save & Publish</button>
        <button
          onClick={() => void save(true, true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          title="Publish immediately and override any scheduled window"
        >
          Publish Now (Override)
        </button>
      </div>
    </div>
  );
}
