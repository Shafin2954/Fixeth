import React from 'react';
import { fetchDocBySlug, isDocVisible } from '@/lib/docs/server';

export default async function DocsDebugPage() {
  const doc = await fetchDocBySlug('main');
  const now = new Date();
  const visible = isDocVisible(doc, now);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Docs Debug</h1>
      <p className="mb-2">Current server time: <strong>{now.toISOString()}</strong></p>
      <p className="mb-4">Visibility check: <strong>{visible ? 'VISIBLE' : 'HIDDEN'}</strong></p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Raw doc record</h2>
        <pre className="mt-2 p-4 bg-surface-muted rounded">{JSON.stringify(doc, null, 2)}</pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="mt-2 text-sm text-muted">If the record shows start_ts/end_ts that prevent visibility, run the SQL to clear them or click Publish Now in /docs/admin.</p>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">UPDATE docs SET visible_override = true, is_published = true, start_ts = NULL, end_ts = NULL, published_at = now() WHERE slug = 'main';</pre>
      </div>
    </div>
  );
}
