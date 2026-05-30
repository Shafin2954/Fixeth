'use client';

import React from 'react';
import DocsEditor from '@/components/docs/DocsEditor';

export default function DocsAdminPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Docs Admin</h1>
          <a href="https://github.com/rafsan-j/Fixeth" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white">View on GitHub</a>
        </div>

        <DocsEditor slug="main" />
      </div>
    </div>
  );
}
