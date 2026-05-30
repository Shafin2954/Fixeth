import React from 'react';
import { fetchDocBySlug, isDocVisible } from '@/lib/docs/server';

export default async function DocsDebugPage() {
  const doc = await fetchDocBySlug('main');
  const now = new Date();
  const visible = isDocVisible(doc, now);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Docs Debug</h1>
          <a href="https://github.com/rafsan-j/Fixeth" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white">View on GitHub</a>
        </div>
        <p className="mb-2">Current server time: <strong>{now.toISOString()}</strong></p>
        <p className="mb-4">Visibility check: <strong>{visible ? 'VISIBLE' : 'HIDDEN'}</strong></p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Raw doc record</h2>
          <pre className="mt-2 p-4 bg-[#010409] rounded">{JSON.stringify(doc, null, 2)}</pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Quick actions</h2>
          <p className="mt-2 text-sm text-gray-400">If the record shows start_ts/end_ts that prevent visibility, run the SQL to clear them or click Publish Now in /docs/admin.</p>
          <pre className="mt-2 p-2 bg-gray-800 rounded text-sm">UPDATE docs SET visible_override = true, is_published = true, start_ts = NULL, end_ts = NULL, published_at = now() WHERE slug = 'main';</pre>
        </div>
      </div>
    </div>
  );
}
