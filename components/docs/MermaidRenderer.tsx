'use client';
import React, { useEffect } from 'react';
import mermaid from 'mermaid';

export default function MermaidRenderer({ code }: { code: string }) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
    try { mermaid.contentLoaded(); } catch (e) {}
  }, [code]);
  return (
    <div className="mermaid">
      {code}
    </div>
  );
}
