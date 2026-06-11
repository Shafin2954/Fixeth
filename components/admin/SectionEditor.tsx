'use client';
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { DocSlide, DocSection, DocSectionType } from '@/types';

// ── Slides Editor ────────────────────────────────────────────

interface SlidesEditorProps {
  slides: DocSlide[];
  onChange: (slides: DocSlide[]) => void;
}

export function SlidesEditor({ slides, onChange }: SlidesEditorProps) {
  function update(index: number, field: keyof DocSlide, value: string) {
    const next = slides.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange(next);
  }

  function add() {
    onChange([...slides, { id: `slide-${Date.now()}`, title: 'New Slide', body: '' }]);
  }

  function remove(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {slides.map((slide, i) => (
        <div key={slide.id} className="rounded-lg border border-gray-700 bg-[#010409] p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-black text-gray-400">
              {i + 1}
            </span>
            <div className="flex-1 space-y-2">
              <input
                value={slide.title}
                onChange={e => update(i, 'title', e.target.value)}
                placeholder="Slide title"
                className="w-full rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
              <textarea
                value={slide.body}
                onChange={e => update(i, 'body', e.target.value)}
                rows={3}
                placeholder="Slide body…"
                className="w-full rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-y"
              />
            </div>
            <button
              onClick={() => remove(i)}
              className="mt-1 rounded p-1 text-gray-600 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200 w-full justify-center"
      >
        <Plus size={14} /> Add Slide
      </button>
    </div>
  );
}

// ── Sections Editor ──────────────────────────────────────────

interface SectionsEditorProps {
  sections: DocSection[];
  onChange: (sections: DocSection[]) => void;
}

const SECTION_TYPES: { value: DocSectionType; label: string }[] = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'mermaid', label: 'Mermaid Diagram' },
  { value: 'feature-matrix', label: 'Feature Matrix (live)' },
  { value: 'live-stats', label: 'Live Stats (live)' }
];

export function SectionsEditor({ sections, onChange }: SectionsEditorProps) {
  function update(index: number, field: keyof DocSection, value: string) {
    const next = sections.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange(next);
  }

  function add() {
    onChange([...sections, { id: `section-${Date.now()}`, title: 'New Section', type: 'markdown' as DocSectionType, body: '' }]);
  }

  function remove(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {sections.map((section, i) => (
        <div key={section.id} className="rounded-lg border border-gray-700 bg-[#010409] p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  value={section.title}
                  onChange={e => update(i, 'title', e.target.value)}
                  placeholder="Section title"
                  className="flex-1 rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
                <select
                  value={section.type}
                  onChange={e => update(i, 'type', e.target.value)}
                  className="rounded border border-gray-700 bg-[#0d1117] px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
                >
                  {SECTION_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {section.type !== 'feature-matrix' && section.type !== 'live-stats' && (
                <textarea
                  value={section.body}
                  onChange={e => update(i, 'body', e.target.value)}
                  rows={section.type === 'mermaid' ? 6 : 5}
                  placeholder={section.type === 'mermaid' ? 'Mermaid diagram code…' : 'Markdown content…'}
                  className="w-full rounded border border-gray-700 bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-y"
                />
              )}
              {(section.type === 'feature-matrix' || section.type === 'live-stats') && (
                <p className="text-xs text-gray-500 italic">
                  This section renders live data — no manual content needed.
                </p>
              )}
            </div>
            <button
              onClick={() => remove(i)}
              className="mt-1 rounded p-1 text-gray-600 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200 w-full justify-center"
      >
        <Plus size={14} /> Add Section
      </button>
    </div>
  );
}
