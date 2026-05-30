'use client';
import React, { useEffect, useState } from 'react';

export default function DocsEditor({ slug }: { slug: string }) {
  const [doc, setDoc] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/docs?slug=${slug}`).then((r) => r.json()).then((j) => {
      if (j.data) {
        setDoc(j.data);
        setTitle(j.data.title || '');
        setContent(JSON.stringify(j.data.content || {}, null, 2));
      }
    });
  }, [slug]);

  async function save(publish?: boolean, override?: boolean) {
    setLoading(true);
    const body: any = { slug, content: JSON.parse(content), title };
    if (publish !== undefined) body.is_published = publish;
    if (override !== undefined) body.visible_override = override;
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
          <h2 className="text-lg font-semibold text-white">Editing: {doc.slug}</h2>
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
