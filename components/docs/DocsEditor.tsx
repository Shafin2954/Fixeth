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

  if (!doc) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Content (JSON)</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full p-2 border rounded font-mono text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => void save(false)} className="px-4 py-2 bg-gray-200 rounded">Save Draft</button>
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
