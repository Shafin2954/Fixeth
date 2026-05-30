import React from 'react';
import DocsViewer from '@/components/docs/DocsViewer';
import { fetchDocBySlug, isDocVisible } from '@/lib/docs/server';

export default async function DocsIndexPage() {
  const doc = await fetchDocBySlug('main');
  const visible = isDocVisible(doc);
  if (!visible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold">Documentation Not Available</h1>
          <p className="mt-2 text-muted">This documentation is not currently public. Please check back later.</p>
        </div>
      </div>
    );
  }

  return <DocsViewer doc={doc} />;
}
