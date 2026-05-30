'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import TeamGrid from './TeamGrid';

export default function DocsViewer({ doc }: { doc: any }) {
  const content = doc?.content || {};
  const hero = content.hero || { title: doc.title };
  const slides = content.slides || [];
  const sections = content.sections || [];
  const team = content.team || [];
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">{hero.title}</h1>
          {hero.subtitle && <p className="mt-2 text-gray-400">{hero.subtitle}</p>}
        </header>

        {/* Slides / Pitch Deck (simple cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {slides.map((s: any, i: number) => (
            <div key={i} className="p-6 border border-gray-800 rounded-lg bg-[#010409]">
              <h3 className="text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{s.body}</p>
            </div>
          ))}
        </section>

        {/* Sections rendered as markdown blocks */}
        {sections.map((sec: any, i: number) => (
          <section key={i} className="mb-6">
            <h2 className="text-2xl font-semibold text-white">{sec.title}</h2>
            <div className="prose prose-invert mt-2 text-gray-200">
              <ReactMarkdown>{sec.body || ''}</ReactMarkdown>
            </div>
          </section>
        ))}

        {/* Team */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-white">Team</h2>
          <TeamGrid members={team} />
        </section>
      </div>
    </div>
  );
}
