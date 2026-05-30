'use client';

import React from 'react';
import DocsEditor from '@/components/docs/DocsEditor';

export default function DocsAdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Docs Admin</h1>
      <DocsEditor slug="main" />
    </div>
  );
}
