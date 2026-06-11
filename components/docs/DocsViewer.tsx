'use client';
import React, { lazy, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DocsNav from './DocsNav';
import TeamGrid from './TeamGrid';
import FeatureMatrix from './FeatureMatrix';
import LiveStats from './LiveStats';
import type { DocRecord, DocSlide, DocSection } from '@/types';

const MermaidRenderer = lazy(() => import('./MermaidRenderer'));

const YC_SLIDE_COLORS: Record<string, string> = {
  problem: 'border-red-900/60',
  solution: 'border-green-900/60',
  'why-now': 'border-blue-900/60',
  demo: 'border-purple-900/60',
  market: 'border-yellow-900/60',
  'business-model': 'border-cyan-900/60',
  traction: 'border-emerald-900/60',
  competition: 'border-orange-900/60',
  'unique-advantage': 'border-pink-900/60',
  gtm: 'border-indigo-900/60',
  vision: 'border-teal-900/60'
};

function Slide({ slide, index }: { slide: DocSlide; index: number }) {
  const borderColor = YC_SLIDE_COLORS[slide.id] ?? 'border-gray-800';
  return (
    <div className={`rounded-xl border-2 ${borderColor} bg-[#010409] p-5`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-black text-gray-400">
          {index + 1}
        </span>
        <div>
          <h3 className="text-base font-extrabold text-white">{slide.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">{slide.body}</p>
        </div>
      </div>
    </div>
  );
}

function MdContent({ body }: { body: string }) {
  return (
    <div className="docs-md text-sm leading-relaxed text-gray-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-black text-white mt-6 mb-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-5 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-gray-200 mt-4 mb-1">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-gray-300">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-[#00C896] hover:underline">
              {children}
            </a>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-');
            return isBlock ? (
              <code className="block bg-[#0d1117] border border-gray-800 rounded p-3 text-xs font-mono overflow-x-auto text-gray-300 mb-3">
                {children}
              </code>
            ) : (
              <code className="bg-gray-800 rounded px-1.5 py-0.5 text-xs font-mono text-gray-200">{children}</code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-700 bg-gray-900 px-3 py-2 text-left font-bold text-gray-200">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-800 px-3 py-2 text-gray-300">{children}</td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 mb-3">{children}</blockquote>
          ),
          strong: ({ children }) => <strong className="font-bold text-gray-100">{children}</strong>,
          hr: () => <hr className="my-4 border-gray-800" />
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

function Section({ section }: { section: DocSection }) {
  return (
    <section id={section.id} className="mb-10 scroll-mt-20">
      <h2 className="mb-4 text-2xl font-black text-white">{section.title}</h2>
      <div className="rounded-xl border border-gray-800 bg-[#010409] p-5">
        {section.type === 'mermaid' ? (
          <Suspense fallback={<div className="h-40 animate-pulse rounded bg-gray-800" />}>
            <MermaidRenderer code={section.body} />
          </Suspense>
        ) : section.type === 'feature-matrix' ? (
          <FeatureMatrix />
        ) : section.type === 'live-stats' ? (
          <LiveStats />
        ) : (
          <MdContent body={section.body} />
        )}
      </div>
    </section>
  );
}

export default function DocsViewer({ doc }: { doc: DocRecord | null }) {
  if (!doc) return null;

  const c = doc.content;
  const slides = c.slides ?? [];
  const sections = c.sections ?? [];
  const team = c.team ?? { members: [] };
  const githubUrl = c.meta?.github_url;

  const navItems = [
    { id: 'pitch-deck', label: 'Pitch Deck' },
    ...sections.map(s => ({ id: s.id, label: s.title })),
    { id: 'team', label: 'Team' }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      <DocsNav
        title={c.hero?.title ?? doc.title}
        items={navItems}
        githubUrl={githubUrl}
        slug={doc.slug}
      />

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00C896]/30 bg-[#00C896]/10 px-3 py-1 text-xs font-bold text-[#00C896] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C896]" />
            Live Documentation — Auto-synced
          </div>
          <h1 className="text-5xl font-black text-white">{c.hero?.title ?? doc.title}</h1>
          {c.hero?.subtitle && (
            <p className="mt-3 text-xl text-gray-400">{c.hero.subtitle}</p>
          )}
          {c.hero?.tagline && (
            <p className="mt-2 text-sm font-bold tracking-widest text-[#00C896] uppercase">
              {c.hero.tagline}
            </p>
          )}
        </header>

        {/* Pitch Deck */}
        <section id="pitch-deck" className="mb-12 scroll-mt-20">
          <h2 className="mb-1 text-2xl font-black text-white">Pitch Deck</h2>
          <p className="mb-5 text-sm text-gray-500">YC-style overview — problem to vision</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {slides.map((slide, i) => (
              <Slide key={slide.id} slide={slide} index={i} />
            ))}
          </div>
        </section>

        {/* Technical sections */}
        {sections.map(section => (
          <Section key={section.id} section={section} />
        ))}

        {/* Team */}
        <section id="team" className="mb-10 scroll-mt-20">
          <h2 className="mb-4 text-2xl font-black text-white">Team</h2>
          <div className="rounded-xl border border-gray-800 bg-[#010409] p-5">
            <TeamGrid teamName={team.name} members={team.members} />
          </div>
        </section>
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          nav { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-\\[\\#010409\\] { background: #f9f9f9 !important; }
          .bg-\\[\\#0d1117\\] { background: white !important; }
          .text-white, .text-gray-200, .text-gray-300, .text-gray-400 { color: #111 !important; }
          .border-gray-800, .border-gray-700 { border-color: #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
}
