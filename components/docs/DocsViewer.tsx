'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import TeamGrid from './TeamGrid';
import FeatureMatrix from './FeatureMatrix';

export default function DocsViewer({ doc }: { doc: Record<string, unknown> | null }) {
  const content = (doc && (doc['content'] as Record<string, unknown> | null)) || {};
  const markdown = String((doc && doc['content_md']) || content['markdown'] || '');
  if (markdown.trim()) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-gray-200">
        <article className="prose prose-invert mx-auto max-w-4xl p-6">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </article>
      </div>
    );
  }

  const hero = (content['hero'] as Record<string, unknown> | null) ?? { title: doc ? doc['title'] : '' };
  const heroTitle = String((hero as Record<string, unknown>)['title'] ?? '');
  const heroSubtitle = String((hero as Record<string, unknown>)['subtitle'] ?? '');
  const slides = Array.isArray(content['slides']) ? (content['slides'] as unknown[]) : [];
  const sections = Array.isArray(content['sections']) ? (content['sections'] as unknown[]) : [];
  const team = Array.isArray(content['team']) ? (content['team'] as unknown[]) : [];
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-start justify-between mb-6">
          <header>
            <h1 className="text-4xl font-bold text-white">{heroTitle}</h1>
            {heroSubtitle && <p className="mt-2 text-gray-400">{heroSubtitle}</p>}
          </header>
          <div className="pt-2">
            <a href="https://github.com/rafsan-j/Fixeth" target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-white">View on GitHub</a>
          </div>
        </div>

        {/* Table of contents */}
        <nav className="mb-6">
          <ul className="flex flex-wrap gap-2">
            {sections.map((sec: unknown, idx: number) => {
              const s = sec as { title?: unknown };
              return (<li key={idx}><a href={`#section-${idx}`} className="text-sm text-gray-400 hover:text-white">{String(s.title ?? '')}</a></li>);
            })}
          </ul>
        </nav>

        {/* Slides / Pitch Deck (simple cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {slides.map((s: unknown, i: number) => {
            const slide = s as { title?: unknown; body?: unknown };
            return (
              <div key={i} className="p-6 border border-gray-800 rounded-lg bg-[#010409]">
                <h3 className="text-xl font-semibold text-white">{String(slide.title ?? '')}</h3>
                <hr className="my-3 border-gray-700" />
                <p className="mt-2 text-sm text-gray-300">{String(slide.body ?? '')}</p>
              </div>
            );
          })}
        </section>

        {/* Sections rendered as markdown blocks */}
        {sections.map((sec: unknown, i: number) => {
          const section = sec as { title?: unknown; body?: unknown };
          const titleStr = String(section.title ?? '');
          return (
            <section id={`section-${i}`} key={i} className="mb-6">
              <h2 className="text-2xl font-semibold text-white">{titleStr}</h2>
              <hr className="my-3 border-gray-700" />
              <div className="prose prose-invert mt-2 text-gray-200">
                {titleStr.toLowerCase().includes('feature matrix') ? (
                  <FeatureMatrix />
                ) : (
                  <ReactMarkdown>{String(section.body ?? '')}</ReactMarkdown>
                )}
              </div>
            </section>
          );
        })}

        {/* Team */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white">Team</h2>
          <TeamGrid members={team as Record<string, unknown>[]} />
        </section>
      </div>
    </div>
  );
}
