'use client';
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

let idCounter = 0;

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

export default function MermaidRenderer({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !code.trim()) return;
    const id = `mermaid-${++idCounter}`;
    mermaid.render(id, code.trim())
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => {
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-xs text-gray-400 overflow-x-auto p-2">${code}</pre>`;
        }
      });
  }, [code]);

  return <div ref={ref} className="overflow-x-auto rounded-lg bg-[#0d1117] p-4" />;
}
