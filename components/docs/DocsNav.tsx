'use client';
import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, GitBranch, Menu, X } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
}

interface DocsNavProps {
  title: string;
  items: NavItem[];
  githubUrl?: string;
  slug?: string;
}

export default function DocsNav({ title, items, githubUrl, slug = 'main' }: DocsNavProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  const filtered = search.trim()
    ? items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : items;

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    items.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  function handleJump(id: string) {
    setSearch('');
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleExportMd() {
    window.location.href = `/api/docs/export?slug=${slug}`;
  }

  function handlePrint() {
    window.print();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#010409]/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center gap-4">
          {/* Brand */}
          <span className="shrink-0 text-base font-black text-white">{title}</span>

          {/* Search bar */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Jump to section…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#0d1117] py-1.5 pl-8 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
            {search && filtered.length > 0 && (
              <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-700 bg-[#0d1117] shadow-xl z-50">
                {filtered.slice(0, 8).map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleJump(item.id)}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
              >
                <GitBranch size={13} />
                GitHub
              </a>
            )}
            <button
              onClick={handleExportMd}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
            >
              <Download size={13} />
              Markdown
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white"
            >
              <FileText size={13} />
              PDF
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(v => !v)}
            className="sm:hidden rounded-lg border border-gray-700 p-2 text-gray-400"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Desktop section links */}
        <div className="hidden sm:flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleJump(item.id)}
              className={`shrink-0 rounded-md px-3 py-1 text-xs transition-colors ${
                activeId === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-gray-800 bg-[#010409] px-4 py-3">
          <input
            type="text"
            placeholder="Search sections…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-3 w-full rounded-lg border border-gray-700 bg-[#0d1117] px-3 py-2 text-sm text-gray-200"
          />
          <div className="flex flex-col gap-1">
            {filtered.map(item => (
              <button
                key={item.id}
                onClick={() => handleJump(item.id)}
                className="rounded-md px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2 border-t border-gray-800 pt-3">
            {githubUrl && (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400">
                <GitBranch size={13} /> GitHub
              </a>
            )}
            <button onClick={handleExportMd} className="flex items-center gap-1.5 text-xs text-gray-400">
              <Download size={13} /> Markdown
            </button>
            <button onClick={handlePrint} className="flex items-center gap-1.5 text-xs text-gray-400">
              <FileText size={13} /> PDF
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
