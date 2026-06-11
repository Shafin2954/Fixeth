import React from 'react';
import DocsViewer from '@/components/docs/DocsViewer';
import { fetchDocBySlug, isDocVisible } from '@/lib/docs/server';

export const revalidate = 60;

export default async function DocsIndexPage() {
  const doc = await fetchDocBySlug('main');
  const visible = isDocVisible(doc);

  if (!visible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0d1117]">
        <div className="max-w-xl text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-white">Documentation Not Available</h1>
          <p className="mt-2 text-gray-400">
            This documentation is not currently public. Please check back during the judging window.
          </p>
        </div>
      </div>
    );
  }

  return <DocsViewer doc={doc} />;
}
