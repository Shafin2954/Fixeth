# FIXETH — MASTER BUILD PROMPT v3
# Merged from both team plans. Use in Cursor / Claude Code / Lovable.
# Repo: monorepo with /frontend (Next.js, Vercel, git submodule)

---

## SYSTEM CONTEXT

You are building **Fixeth (ফিক্সেথ)** — a Bengali-first, AI-native adaptive LMS.
Stack: Next.js 14 + Supabase (PostgreSQL + pgvector) + MCP agents.
The frontend lives at `/frontend` as a git submodule, deployed to Vercel.
Implement every feature below fully. No stubs. Production quality throughout.

---

## IDENTITY

```
Name        : Fixeth (ফিক্সেথ)
Tagline     : Learn. Prove. Build. / শিখুন। প্রমাণ করুন। গড়ুন।
Accent      : #00C896
Font        : DM Sans (UI) · DM Mono (code)
Themes      : Dark (default) + Light — toggle, persist to users table
Languages   : English (default) + Bengali — toggle, persist to users table
```

---

## REPOSITORY STRUCTURE

```
fixeth/
├── frontend/                        ← git submodule (Next.js, Vercel)
│   ├── app/
│   │   ├── (auth)/login/
│   │   ├── (auth)/signup/
│   │   ├── (onboarding)/onboarding/ ← 5-step flow
│   │   ├── (app)/dashboard/
│   │   ├── (app)/track/[trackId]/
│   │   ├── (app)/learn/[lessonId]/  ← 3-column workspace
│   │   ├── (app)/notebook/
│   │   ├── (app)/quiz/[quizId]/
│   │   ├── (app)/submissions/
│   │   ├── (app)/codespace/
│   │   ├── (app)/tools/
│   │   ├── (app)/mentor/
│   │   ├── (public)/profile/[username]/
│   │   └── (public)/verify/[hash]/
│   ├── components/
│   │   ├── layout/     ← TopBar, BottomNav (8 items)
│   │   ├── video/      ← Player, SubtitleOverlay, TimestampBadge
│   │   ├── ai/         ← MentorChat, VideoChatPanel, BYOAConfig
│   │   ├── assessment/ ← QuizEngine, RubricPanel, SubmissionUpload
│   │   ├── notebook/   ← JupyterLiteEmbed
│   │   └── dashboard/  ← StatsGrid, TrackCard, JobMarketFeed
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── byoa.ts       ← localStorage key manager, never server
│   │   ├── youtube.ts    ← IFrame API wrapper + seekTo
│   │   ├── i18n.ts       ← EN/BN translation map + LangContext
│   │   └── agents/
│   │       ├── orchestrator.ts
│   │       ├── curriculum.ts
│   │       ├── tutor.ts
│   │       ├── assessment.ts
│   │       ├── jobMarket.ts
│   │       └── subtitleQuality.ts
│   └── types/index.ts
├── backend/                         ← Railway (background jobs)
│   ├── jobs/
│   │   ├── jobMarketScraper.ts
│   │   └── subtitlePipeline.ts
│   └── mcp/indeedMCP.ts
├── supabase/
│   ├── migrations/
│   └── functions/
├── ARCHITECTURE.md                  ← living dev file, judges read this
└── scripts/seedCurriculum.ts
```

---

## ENVIRONMENT VARIABLES

```env
# /frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://fixeth.vercel.app
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
RESEND_API_KEY=
YOUTUBE_DATA_API_KEY=
NEXT_PUBLIC_APP_URL=https://fixeth.vercel.app
PLATFORM_GEMINI_KEY=   # server-side only, 50 AI calls/day/user fallback

# BYOA keys: localStorage ONLY — never here
```

---

## DATABASE SCHEMA

Run all migrations in Supabase before building any features.

```sql
-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT UNIQUE NOT NULL,
  name                TEXT,
  username            TEXT UNIQUE,
  avatar_url          TEXT,
  role                TEXT DEFAULT 'learner',
  plan                TEXT DEFAULT 'free',
  institution_id      UUID,
  preferred_language  TEXT DEFAULT 'en',
  preferred_theme     TEXT DEFAULT 'dark',
  goal                TEXT,
  experience_level    TEXT,
  byoa_provider       TEXT,
  streak              INT DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  last_active         TIMESTAMPTZ
);

-- ── CURRICULUM ──────────────────────────────────────────────
CREATE TABLE tracks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title_en        TEXT NOT NULL,
  title_bn        TEXT,
  description_en  TEXT,
  description_bn  TEXT,
  price_bdt       INT DEFAULT 0,
  is_free         BOOLEAN DEFAULT FALSE,
  difficulty      TEXT,
  estimated_hours INT,
  skills          TEXT[],
  tools           TEXT[],
  published       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id    UUID REFERENCES tracks(id) ON DELETE CASCADE,
  title_en    TEXT NOT NULL,
  title_bn    TEXT,
  order_index INT NOT NULL
);

CREATE TABLE lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID REFERENCES modules(id) ON DELETE CASCADE,
  title_en         TEXT NOT NULL,
  title_bn         TEXT,
  youtube_video_id TEXT,
  notes_md         TEXT,
  notes_bn_md      TEXT,
  order_index      INT NOT NULL,
  estimated_mins   INT,
  concept_ids      UUID[]
);

CREATE TABLE lesson_resources (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  label     TEXT,
  url       TEXT
);

-- ── CONCEPT GRAPH (PostgreSQL, no separate graph DB) ────────
CREATE TABLE concepts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  track_id   UUID REFERENCES tracks(id),
  difficulty INT CHECK (difficulty BETWEEN 1 AND 5)
);

CREATE TABLE concept_edges (
  from_concept UUID REFERENCES concepts(id),
  to_concept   UUID REFERENCES concepts(id),
  type         TEXT CHECK (type IN ('requires','reinforces')),
  PRIMARY KEY (from_concept, to_concept)
);

-- ── LEARNER STATE ────────────────────────────────────────────
CREATE TABLE learner_mastery (
  user_id     UUID REFERENCES users(id),
  concept_id  UUID REFERENCES concepts(id),
  score       NUMERIC DEFAULT 0,
  mastered    BOOLEAN DEFAULT FALSE,
  attempts    INT DEFAULT 0,
  mastered_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, concept_id)
);

CREATE TABLE adaptive_paths (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES users(id),
  track_id  UUID REFERENCES tracks(id),
  path_json JSONB NOT NULL,
  built_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enrollments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  track_id          UUID REFERENCES tracks(id),
  enrolled_at       TIMESTAMPTZ DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  current_lesson_id UUID REFERENCES lessons(id),
  progress_percent  NUMERIC DEFAULT 0,
  final_score       NUMERIC,
  grade             TEXT,
  certificate_id    UUID,
  financial_aid     BOOLEAN DEFAULT FALSE,
  UNIQUE (user_id, track_id)
);

CREATE TABLE progress (
  user_id      UUID REFERENCES users(id),
  lesson_id    UUID REFERENCES lessons(id),
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  watch_pct    INT DEFAULT 0,
  PRIMARY KEY (user_id, lesson_id)
);

-- ── KNOWLEDGE RETRIEVAL (pgvector RAG) ──────────────────────
CREATE TABLE transcript_chunks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  UUID REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  start_time NUMERIC,
  end_time   NUMERIC,
  embedding  VECTOR(1536)
);

CREATE INDEX ON transcript_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- pgvector similarity search RPC
CREATE OR REPLACE FUNCTION match_transcript_chunks(
  query_embedding VECTOR(1536),
  target_lesson_id UUID,
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID, chunk_text TEXT,
  start_time NUMERIC, end_time NUMERIC, similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT id, chunk_text, start_time, end_time,
         1 - (embedding <=> query_embedding) AS similarity
  FROM transcript_chunks
  WHERE lesson_id = target_lesson_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- ── SUBTITLES ────────────────────────────────────────────────
CREATE TABLE subtitles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      UUID REFERENCES lessons(id),
  lang           TEXT NOT NULL,
  vtt_url        TEXT,
  cues_json      JSONB,
  quality_score  NUMERIC,
  auto_published BOOLEAN DEFAULT FALSE,
  reviewed       BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (lesson_id, lang)
);

-- ── ASSESSMENT ──────────────────────────────────────────────
CREATE TABLE quiz_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID REFERENCES lessons(id),
  concept_id   UUID REFERENCES concepts(id),
  question_en  TEXT NOT NULL,
  question_bn  TEXT,
  options      JSONB NOT NULL,
  difficulty   INT DEFAULT 2,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  quiz_item_id    UUID REFERENCES quiz_items(id),
  selected_index  INT,
  is_correct      BOOLEAN,
  time_taken_secs INT,
  attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  lesson_id         UUID REFERENCES lessons(id),
  type              TEXT,
  file_urls         TEXT[],
  notes             TEXT,
  score             NUMERIC,
  max_score         NUMERIC DEFAULT 100,
  grade_breakdown   JSONB,
  ai_feedback       TEXT,
  ai_feedback_bn    TEXT,
  peer_reviews      JSONB,
  status            TEXT DEFAULT 'submitted',
  plagiarism_score  NUMERIC,
  integrity_flagged BOOLEAN DEFAULT FALSE,
  graded_by         TEXT DEFAULT 'pending',
  submitted_at      TIMESTAMPTZ DEFAULT NOW(),
  graded_at         TIMESTAMPTZ
);

-- ── CERTIFICATES ─────────────────────────────────────────────
CREATE TABLE certificates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  track_id      UUID REFERENCES tracks(id),
  enrollment_id UUID REFERENCES enrollments(id),
  cert_hash     TEXT UNIQUE NOT NULL,
  score         NUMERIC,
  grade         TEXT,
  pdf_url       TEXT,
  issued_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── JOB MARKET ───────────────────────────────────────────────
CREATE TABLE job_market_signals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill           TEXT NOT NULL,
  source          TEXT,
  mention_count   INT,
  week_change_pct NUMERIC,
  avg_salary_bdt  INT,
  in_curriculum   BOOLEAN DEFAULT FALSE,
  status          TEXT DEFAULT 'pending_review',
  scraped_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── FINANCIAL AID ────────────────────────────────────────────
CREATE TABLE financial_aid (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  track_id     UUID REFERENCES tracks(id),
  reason       TEXT,
  income_range TEXT,
  status       TEXT DEFAULT 'pending',
  applied_at   TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE enrollments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own rows only" ON enrollments
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON learner_mastery
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON progress
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON quiz_results
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON submissions
  USING (auth.uid() = user_id);
```

---

## BYOA SYSTEM

```typescript
// lib/byoa.ts — keys NEVER leave the browser

export const PROVIDERS = {
  groq:       { baseURL: 'https://api.groq.com/openai/v1',            free: true  },
  gemini:     { baseURL: 'https://generativelanguage.googleapis.com/v1beta', free: true },
  openai:     { baseURL: 'https://api.openai.com/v1',                 free: false },
  anthropic:  { baseURL: 'https://api.anthropic.com/v1',              free: false },
  openrouter: { baseURL: 'https://openrouter.ai/api/v1',              free: false },
  ollama:     { baseURL: 'http://localhost:11434/v1',                  free: true  },
};

export const saveConfig = (c: BYOAConfig) =>
  localStorage.setItem('fixeth_byoa', JSON.stringify(c));

export const getConfig = (): BYOAConfig | null => {
  const raw = localStorage.getItem('fixeth_byoa');
  return raw ? JSON.parse(raw) : null;
};

export async function callLLM(messages: Message[], system?: string): Promise<string> {
  const config = getConfig();
  // Fallback: platform Gemini Flash (server route, rate-limited)
  if (!config) return callPlatformFallback(messages, system);

  const res = await fetch(`${PROVIDERS[config.provider].baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages: system ? [{ role:'system', content:system }, ...messages] : messages,
      max_tokens: 1000
    })
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function embedQuery(text: string): Promise<number[]> {
  const config = getConfig();
  if (!config) throw new Error('BYOA not configured for embeddings');
  const res = await fetch(`${PROVIDERS[config.provider].baseURL}/embeddings`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text })
  });
  const data = await res.json();
  return data.data[0].embedding;
}
```

---

## MCP AGENT CONTRACTS

### Curriculum Agent

```typescript
// lib/agents/curriculum.ts
// Trigger: enrollment | quiz_result | module_complete | cross_track

interface CurriculumInput {
  user_id: string;
  track_id: string;
  trigger: 'enrollment' | 'quiz_result' | 'module_complete' | 'cross_track';
  mastery: { concept_id: string; score: number; mastered: boolean }[];
}

interface CurriculumOutput {
  path: { lesson_id: string; skip: boolean; reason?: string; injected_remedial?: boolean }[];
  skipped_count: number;
  message: string; // shown to learner, Bengali if preferred
}

export async function runCurriculumAgent(input: CurriculumInput): Promise<CurriculumOutput> {
  // 1. Recursive CTE: fetch concept DAG for track in topological order
  const { data: graph } = await supabase.rpc('get_concept_path', { p_track_id: input.track_id });

  // 2. Walk graph, apply mastery rules
  const path = [];
  for (const node of graph) {
    const m = input.mastery.find(x => x.concept_id === node.id);
    if (m?.mastered) {
      path.push({ lesson_id: node.lesson_id, skip: true, reason: 'Already mastered' });
    } else if (m && m.score < 60 && m.score > 0) {
      path.push({ lesson_id: `remedial_${node.id}`, skip: false, injected_remedial: true });
      path.push({ lesson_id: node.lesson_id, skip: false });
    } else {
      path.push({ lesson_id: node.lesson_id, skip: false });
    }
  }

  // 3. Persist path
  await supabase.from('adaptive_paths').upsert({
    user_id: input.user_id, track_id: input.track_id, path_json: path
  });

  const skipped = path.filter(p => p.skip).length;
  return {
    path,
    skipped_count: skipped,
    message: skipped > 0
      ? `Skipping ${skipped} concepts you already know.`
      : 'Starting from the beginning.'
  };
}

// Supabase RPC for concept DAG traversal
// supabase/migrations/concept_path.sql
/*
CREATE OR REPLACE FUNCTION get_concept_path(p_track_id UUID)
RETURNS TABLE (id UUID, label TEXT, lesson_id UUID, depth INT)
LANGUAGE SQL STABLE AS $$
  WITH RECURSIVE concept_tree AS (
    SELECT c.id, c.label, l.id AS lesson_id, 0 AS depth
    FROM concepts c
    JOIN lessons l ON l.concept_ids @> ARRAY[c.id]
    WHERE c.track_id = p_track_id
      AND NOT EXISTS (
        SELECT 1 FROM concept_edges e WHERE e.to_concept = c.id
          AND e.from_concept IN (SELECT id FROM concepts WHERE track_id = p_track_id)
      )
    UNION ALL
    SELECT c.id, c.label, l.id, ct.depth + 1
    FROM concepts c
    JOIN concept_edges e ON e.to_concept = c.id
    JOIN concept_tree ct ON ct.id = e.from_concept
    JOIN lessons l ON l.concept_ids @> ARRAY[c.id]
  )
  SELECT DISTINCT id, label, lesson_id, depth FROM concept_tree ORDER BY depth;
$$;
*/
```

---

### Tutor Agent

```typescript
// lib/agents/tutor.ts

interface TutorInput {
  question: string;
  lesson_id: string;
  current_timestamp_sec?: number;
  language: 'en' | 'bn';
  generate_questions?: boolean;
}

interface TutorOutput {
  answer: string;
  language: 'en' | 'bn';
  timestamp: { seek_to_seconds: number; label: string } | null;
  action: null | 'show_in_practice_tab' | 'seek_video';
  quiz_items?: QuizItem[];
  source_chunks: { chunk_id: string; similarity: number }[];
}

export async function runTutorAgent(input: TutorInput): Promise<TutorOutput> {
  // 1. Embed query (client-side via BYOA)
  const embedding = await embedQuery(input.question);

  // 2. pgvector similarity search
  const { data: chunks } = await supabase.rpc('match_transcript_chunks', {
    query_embedding: embedding,
    target_lesson_id: input.lesson_id,
    match_threshold: 0.75,
    match_count: 5
  });

  if (!chunks?.length) {
    return {
      answer: input.language === 'bn'
        ? 'ভিডিওতে এই বিষয়টি খুঁজে পাইনি।'
        : "I couldn't find this in the video.",
      language: input.language,
      timestamp: null,
      action: null,
      source_chunks: []
    };
  }

  // 3. LLM grounded response
  const context = chunks.map(c => `[${c.start_time}s–${c.end_time}s] ${c.chunk_text}`).join('\n');
  const bestChunk = chunks[0];

  const SYSTEM = `You are a tutor. Use ONLY the following transcript excerpts to answer.
Do not use outside knowledge. If no excerpt answers the question, say so.
Language: ${input.language === 'bn' ? 'Bengali — preserve all technical terms in English' : 'English'}
Excerpts:\n${context}`;

  const answer = await callLLM([{ role: 'user', content: input.question }], SYSTEM);

  // 4. Generate quiz items if requested
  let quiz_items;
  if (input.generate_questions) {
    quiz_items = await generateQuizItems(input.lesson_id, context, input.language);
  }

  return {
    answer,
    language: input.language,
    timestamp: { seek_to_seconds: bestChunk.start_time, label: `At ${formatTime(bestChunk.start_time)}` },
    action: input.generate_questions ? 'show_in_practice_tab' : 'seek_video',
    quiz_items,
    source_chunks: chunks.map(c => ({ chunk_id: c.id, similarity: c.similarity }))
  };
}
```

---

### Assessment Agent

```typescript
// lib/agents/assessment.ts

interface AssessmentInput {
  submission_id: string;
  submission_content: string;
  rubric: { criterion: string; weight: number; description: string }[];
  language: 'en' | 'bn';
}

export async function runAssessmentAgent(input: AssessmentInput): Promise<void> {
  const SYSTEM = `You are an assessment agent. Evaluate the submission against the rubric.
Return ONLY valid JSON — no markdown, no preamble.`;

  const prompt = `Submission:\n${input.submission_content}\n\nRubric:\n${JSON.stringify(input.rubric)}

Return JSON:
{
  "scores": {"criterion_name": score},
  "total": number,
  "max": number,
  "feedback": "constructive paragraph, max 200 words",
  "pass": boolean,
  "per_criterion": [{"criterion","score","note"}]
}`;

  const raw = await callLLM([{ role:'user', content: prompt }], SYSTEM);

  let result;
  try { result = JSON.parse(raw); }
  catch { result = { total: 0, feedback: 'Evaluation failed — please resubmit.', pass: false }; }

  // Bengali feedback if needed
  let feedback_bn = null;
  if (input.language === 'bn') {
    feedback_bn = await translateToBengali(result.feedback);
  }

  await supabase.from('submissions').update({
    score: result.total,
    grade_breakdown: result.per_criterion,
    ai_feedback: result.feedback,
    ai_feedback_bn: feedback_bn,
    status: 'graded',
    graded_by: 'ai_assisted',
    graded_at: new Date().toISOString()
  }).eq('id', input.submission_id);
}
```

---

### Job Market Agent

```typescript
// backend/jobs/jobMarketScraper.ts
// Runs: Supabase pg_cron '0 9 * * 1' (Monday 09:00)

import { chromium } from 'playwright';

const SOURCES = [
  { name: 'bdjobs',  url: 'https://www.bdjobs.com/jobssearch.asp?q=developer', selector: '.job-title' },
  { name: 'chakri',  url: 'https://www.chakri.com/jobs?q=software', selector: '.job-card' },
  { name: 'indeed',  usesMCP: true },
];

const TRACKED_SKILLS = [
  'Python','JavaScript','TypeScript','React','Node.js','SQL','MongoDB',
  'Docker','Kubernetes','AWS','GCP','LangChain','FastAPI','dbt','Airflow',
  'Scikit-learn','TensorFlow','PyTorch','Git','REST API','GraphQL',
  'PostgreSQL','Redis','Pandas','NumPy','Tailwind','Next.js','Express'
];

export async function runJobMarketScraper() {
  const browser = await chromium.launch();
  const allPostings: string[] = [];

  for (const src of SOURCES.filter(s => !s.usesMCP)) {
    const page = await browser.newPage();
    await page.goto(src.url, { waitUntil: 'networkidle' });
    const texts = await page.$$eval(src.selector, els => els.map(e => e.textContent ?? ''));
    allPostings.push(...texts);
    await page.close();
  }

  // Indeed via MCP
  const indeedResults = await indeedMCP.searchJobs({ query: 'developer Bangladesh', limit: 500 });
  allPostings.push(...indeedResults.map(j => `${j.title} ${j.description}`));

  await browser.close();

  // Count skill mentions
  const corpus = allPostings.join(' ');
  const counts: Record<string, number> = {};
  for (const skill of TRACKED_SKILLS) {
    const re = new RegExp(`\\b${skill}\\b`, 'gi');
    counts[skill] = (corpus.match(re) ?? []).length;
  }

  // Compare to previous week + upsert
  for (const [skill, count] of Object.entries(counts)) {
    const { data: prev } = await supabase
      .from('job_market_signals').select('mention_count')
      .eq('skill', skill).order('scraped_at', { ascending: false }).limit(1).single();

    const changePct = prev ? ((count - prev.mention_count) / (prev.mention_count || 1)) * 100 : 0;

    await supabase.from('job_market_signals').insert({
      skill, source: 'aggregated', mention_count: count,
      week_change_pct: changePct,
      in_curriculum: await isSkillInCurriculum(skill),
      status: 'pending_review'
    });
  }
}
```

---

### Subtitle Quality Agent

```typescript
// lib/agents/subtitleQuality.ts

export async function scoreAndGate(
  source_text: string,
  translated_text: string
): Promise<{ score: number; auto_publish: boolean; notes: string }> {

  const SYSTEM = `You are a Bengali translation quality evaluator.
Score 0.0–1.0 across three criteria:
  fluency      (0.4 weight) — reads naturally as Bengali
  accuracy     (0.4 weight) — meaning preserved vs source
  term_preserve (0.2 weight) — technical terms kept in English

Return ONLY JSON: {"fluency": float, "accuracy": float, "term_preserve": float, "notes": string}`;

  const raw = await callLLM([{
    role: 'user',
    content: `Source:\n${source_text}\n\nTranslation:\n${translated_text}`
  }], SYSTEM);

  let result;
  try { result = JSON.parse(raw); }
  catch { return { score: 0, auto_publish: false, notes: 'Scoring failed — queued for review' }; }

  const score = (result.fluency * 0.4) + (result.accuracy * 0.4) + (result.term_preserve * 0.2);
  return { score, auto_publish: score >= 0.85, notes: result.notes };
}
```

---

## AGENT ORCHESTRATOR

```typescript
// lib/agents/orchestrator.ts

export type UserEvent =
  | { type: 'quiz_submitted';    payload: { results: QuizResult[]; lesson_id: string } }
  | { type: 'lesson_completed';  payload: { lesson_id: string } }
  | { type: 'track_enrolled';    payload: { track_id: string } }
  | { type: 'chat_query';        payload: { message: string; lesson_id: string; language: 'en'|'bn' } }
  | { type: 'submission_saved';  payload: { submission_id: string; content: string } };

export async function orchestrate(user_id: string, event: UserEvent) {
  const user = await getUser(user_id);

  switch (event.type) {
    case 'quiz_submitted': {
      // Update mastery, rebuild path, check pacing
      await updateMastery(user_id, event.payload.results);
      const enrollment = await getActiveEnrollment(user_id);
      if (enrollment) {
        const mastery = await getMastery(user_id);
        await runCurriculumAgent({ user_id, track_id: enrollment.track_id, trigger: 'quiz_result', mastery });
      }
      // Pacing: 3rd consecutive score < 60 → nudge
      const recentScores = await getRecentQuizScores(user_id, 3);
      if (recentScores.every(s => s < 60)) await sendPacingNudge(user_id, 'slow_down');
      break;
    }

    case 'track_enrolled': {
      const mastery = await getMastery(user_id);
      // Cross-track memory: diff new track's concepts vs existing mastery
      await runCurriculumAgent({ user_id, track_id: event.payload.track_id, trigger: 'cross_track', mastery });
      break;
    }

    case 'chat_query': {
      const result = await runTutorAgent({
        question: event.payload.message,
        lesson_id: event.payload.lesson_id,
        language: event.payload.language,
        generate_questions: /question|quiz|practice/i.test(event.payload.message)
      });
      return result;
    }

    case 'submission_saved': {
      const submission = await getSubmission(event.payload.submission_id);
      if (submission?.lesson_id) {
        const lesson = await getLesson(submission.lesson_id);
        await runAssessmentAgent({
          submission_id: event.payload.submission_id,
          submission_content: event.payload.content,
          rubric: lesson.rubric,
          language: user.preferred_language as 'en' | 'bn'
        });
      }
      // Plagiarism check
      await checkPlagiarism(event.payload.submission_id);
      break;
    }
  }
}
```

---

## FEATURE IMPLEMENTATION GUIDE

### F1 — AUTH + ONBOARDING

```
NextAuth.js v5: providers = [Google, GitHub, LinkedIn, Email]
Middleware: matcher = ['/(app)/(.*)'] → redirect to /login if no session
Post-login: if !onboarding_complete → redirect to /onboarding

Onboarding (5 steps, all state in URL params for back-button support):
  Step 0: Language selection (EN | বাংলা) → saves to users.preferred_language
  Step 1: Goal (job | upskill | switch | explore) → saves to users.goal
  Step 2: Experience (beginner | some | pro) → saves to users.experience_level
  Step 3: Track selection → creates enrollment record
  Step 4: Diagnostic quiz (8 questions, skippable via URL param ?skip=true)
           Skip → curriculum agent builds default path
           Complete → curriculum agent builds personalised path with skips

On complete: set users.onboarding_complete = true → redirect to /dashboard
```

### F2 — DASHBOARD

All data from Supabase real-time queries. Sections:
```
1. Hero: greeting + name + streak week-grid (7 day boxes, green=active)
   "Continue Learning" CTA → links to enrollments.current_lesson_id

2. Stats row (4 cards):
   Lessons Done | Quiz Average | Day Streak | Certificates earned

3. Active Tracks (2-column):
   Left: ring progress + module/lesson name + progress bar per track
   Right: Weekly goal tracker — 5-lesson checklist, show completions

4. Job Market Feed:
   SELECT * FROM job_market_signals
   WHERE status = 'pending_review' OR status = 'actioned'
   ORDER BY ABS(week_change_pct) DESC LIMIT 8
   Show as skill tags with Δ% badge

5. Recent Activity:
   JOIN progress + quiz_results + submissions
   ORDER BY created_at DESC LIMIT 5

6. Career Intelligence:
   Skill trend mini-bars — top 5 skills for current track
   From job_market_signals WHERE in_curriculum = true
```

### F3 — GUIDED VIDEO WORKSPACE (/learn/[lessonId])

Three-column layout, no page scroll — panels scroll independently:

```
LEFT (240px fixed):
  CourseExplorer component:
  - Track title + Ring progress (from enrollments.progress_percent)
  - Module accordion (open/close state in localStorage)
  - Lesson items: check circle + title + duration
  - Active lesson: accent left border + accentDim background
  - Prev / Next lesson buttons

MIDDLE (flex):
  TOP — VideoPlayer component:
    YouTube IFrame loaded via youtube.ts
    SubtitleOverlay div: absolute, bottom 12px, centered
      useEffect setInterval 250ms → player.getCurrentTime() → match cue
    Language toggle: EN | বাংলা | Off (cues_json from subtitles table)
    Scrubber: amber dots at concept timestamp positions
    TimestampBadge: shown 4s after seekTo() call

  BOTTOM — 4-tab panel (Notes | Transcript | Chat with Video | Practice):
    Notes: auto-saving textarea (Supabase upsert on blur, debounced 1000ms)
           + pro tip callout from lesson notes_md
    Transcript: cues_json rendered as clickable timestamp rows
                amber highlight on AI-matched chunk
                click → player.seekTo(start_time)
    Chat with Video:
                user input → orchestrate('chat_query') → TutorAgent
                AI reply with timestamp → player.seekTo()
                "Generate questions" → populates Practice tab, switches tab
    Practice:   MCQ items (from quiz_items or AI-generated)
                self-graded, colour feedback (green/red)
                tracks results in quiz_results table

RIGHT (290px fixed):
  AIMentorChat component:
  - Level selector: ELI5 | Student | Pro | Research
  - Context pills: current lesson + track + quiz avg
  - Quick prompts: Explain this | 5 questions | Summarize | Example
  - Timestamp buttons on AI replies → player.seekTo()
  - EN/BN toggle
  - Voice input via Web Speech API (lang = 'bn-BD' or 'en-US')
  - Input + send → orchestrate('chat_query')
```

### F4 — VIDEO TIMESTAMP INTELLIGENCE

```typescript
// This is the hero demo feature — implement completely, no shortcuts

// In VideoPlayer component:
const [seekTime, setSeekTime] = useState<number | null>(null);
const [badgeLabel, setBadgeLabel] = useState<string | null>(null);

const handleTimestampSeek = (seconds: number, label: string) => {
  playerRef.current?.seekTo(seconds, true);
  playerRef.current?.playVideo();
  setBadgeLabel(label);
  setSeekTime(seconds);
  setTimeout(() => setBadgeLabel(null), 4000);
};

// In TutorAgent response handler:
if (result.timestamp) {
  handleTimestampSeek(result.timestamp.seek_to_seconds, result.timestamp.label);
}

// Amber badge rendered absolute over video:
{badgeLabel && (
  <div style={timestampBadgeStyle}>⏱ {badgeLabel}</div>
)}
```

### F5 — BENGALI SUBTITLE OVERLAY

```typescript
// components/video/SubtitleOverlay.tsx
interface Cue { start: number; end: number; text: string }

export function SubtitleOverlay({ cues, playerRef, lang }: Props) {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    if (lang === 'off' || !cues?.length) { setCurrent(''); return; }
    const id = setInterval(() => {
      const t = playerRef.current?.getCurrentTime() ?? 0;
      const cue = cues.find(c => t >= c.start && t <= c.end);
      setCurrent(cue?.text ?? '');
    }, 250);
    return () => clearInterval(id);
  }, [cues, lang]);

  if (!current) return null;
  return (
    <div className="subtitle-overlay">
      {current}
    </div>
  );
}
// Fetch cues: SELECT cues_json FROM subtitles WHERE lesson_id = ? AND lang = ?
```

### F6 — SUBMISSIONS (edX-style)

```
Three views toggled by tab:

LIST VIEW:
  Query: SELECT * FROM submissions WHERE user_id = auth.uid() ORDER BY submitted_at DESC
  Each card: title + status badge + score bar (if graded) + date + feedback/peer indicators
  Status colours: graded=#00C896 | peer_review=#4A9EFF | submitted=#F5A623 | needs_revision=#FF5B5B
  Click → DETAIL VIEW

NEW SUBMISSION VIEW:
  Assignment brief from lessons.notes_md
  Drag-and-drop upload → Supabase Storage → get public URL → store in submissions.file_urls
  Accepted: .ipynb .py .pdf .zip .md — max 50MB
  Notes textarea
  Submit → INSERT into submissions → orchestrate('submission_saved')

DETAIL VIEW (edX tabs):
  Tab 1 — Grading Rubric:
    FROM submissions.grade_breakdown JSONB
    Each criterion: label + weight + score + mini progress bar

  Tab 2 — AI Feedback:
    submissions.ai_feedback (or ai_feedback_bn if Bengali)
    Overall paragraph + per-criterion cards (✅ / ⚠️)
    "Regenerate feedback" button → re-runs Assessment Agent

  Tab 3 — Peer Review:
    submissions.peer_reviews JSONB array
    Anonymous reviewer cards with score + comment
    "Flag review" button
```

### F7 — CODE SPACE (/codespace)

```
State machine: disconnected → github_connected → repo_selected → launching → launched

DISCONNECTED:
  "Connect GitHub" button → GitHub OAuth → store access_token in session

GITHUB_CONNECTED:
  GET /api/github/repos → GitHub API list user repos
  Show: user repos + Fixeth starter templates (pinned)
  Each row: repo name + description + branch + "Launch ⚡" button

LAUNCHING:
  POST https://api.github.com/repos/{owner}/{repo}/codespaces
  Poll GET /codespaces/{name} every 3s until state = 'Available'
  Show spinner + "Starting your environment..."

LAUNCHED:
  Redirect to codespace.web_url
  Show: "Open in VS Code Web →" + "Open in Desktop VS Code →"
  Badge: "● Codespace running · 2-core · Python 3.11"
  "Stop Codespace" button → DELETE /codespaces/{name}

ALTERNATIVES grid (always shown):
  Google Colab | Kaggle | StackBlitz | CodeSandbox
```

### F8 — TOOLS & RESOURCES (/tools)

```
Section 1 — BYOA Configuration:
  Provider grid (6 options): Groq | Gemini | OpenAI | Anthropic | OpenRouter | Ollama
  Each: icon + name + free/paid badge
  Selected provider: API key input (type=password) + "Save & Test" button
  Test: make /v1/models call → show ✓ Connected or error
  Ollama: show curl install commands + "Test localhost:11434" button
  Key stored: localStorage.setItem('fixeth_byoa', JSON.stringify({provider, apiKey, model}))
  "Your key never leaves your device" copy always visible

Section 2 — Indeed MCP:
  Show connection status + last sync timestamp
  "Last sync: Monday 09:14 · 1,248 postings analysed"
  Manual "Sync now" button → triggers job market scraper
  Top 5 rising skills shown inline

Section 3 — Cloud Services:
  BigQuery | AWS | GCP | Azure — OAuth connect buttons
  Credentials via OAuth only, never stored by Fixeth
  Connected state: show account email + "Disconnect" button

Section 4 — Resource Library:
  Curated docs/cheatsheets filterable by current track
  Inline: NumPy Docs | Pandas Cheatsheet | Git Commands | Scikit-learn API
```

### F9 — AI MENTOR (/mentor)

```
Layout: session history sidebar (200px) + main chat (flex)

SESSION HISTORY (left):
  List past sessions from localStorage (session title + date)
  Active session highlighted
  "+ New Session" button

CHAT HEADER:
  Level selector: ELI5 | Student | Pro | Research (persists to localStorage)
  Context pills: current lesson + track + quiz avg + struggling concepts
    struggling concepts: SELECT concept_id FROM learner_mastery
                         WHERE user_id = ? AND score < 60 LIMIT 3

CHAT MESSAGES:
  ChatBubble component (user right, AI left)
  AI bubbles: timestamp button if result.timestamp present → dispatches seekTo event
  Markdown rendering for code blocks (use react-markdown + rehype-highlight)

QUICK PROMPTS (scrollable horizontal row):
  "Explain this" | "5 questions" | "Summarize video" | "Code example" | "What's next?"
  Each → callLLM with appropriate system prompt

VOICE INPUT:
  Web Speech API: recognition.lang = user.preferred_language === 'bn' ? 'bn-BD' : 'en-US'
  Interim results shown in input field
  Final result → send message

INPUT + SEND:
  Textarea (Enter = send, Shift+Enter = newline)
  Send → orchestrate('chat_query') → display streaming response
```

### F10 — NOTEBOOK (/notebook)

```
JupyterLite iframe:
<iframe
  src="https://jupyterlite.github.io/demo/lab/index.html"
  sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
  className="w-full h-full border-0"
/>

Toolbar above iframe:
- Pre-installed: numpy · pandas · sklearn · matplotlib · plotly · seaborn
- "Install library" → opens micropip modal
- BYOA indicator badge (provider name)
- "Connect BigQuery" → triggers cloud OAuth flow from Tools page
- Dark/light class injected via postMessage on theme toggle
```

### F11 — PUBLIC PORTFOLIO + CERTIFICATE VERIFICATION

```
/profile/[username] — SSR (generateStaticParams):
  SELECT users + enrollments + certificates + submissions
  Render: name, avatar, track completions with score/grade, projects, badges
  "Share" button → clipboard copy
  "Download PDF" → @react-pdf/renderer
  "Add to LinkedIn" → https://www.linkedin.com/profile/add?certId={hash}&...

/verify/[hash] — SSR:
  SELECT * FROM certificates WHERE cert_hash = hash
  JOIN users(name) + tracks(title_en) + enrollments
  Show: full name + track + score + grade + issue date + "Verified ✓" seal
  QR code: qrcode.react pointing back to /verify/[hash]
  "Not found" state if hash doesn't exist
```

### F12 — I18N SYSTEM

```typescript
// lib/i18n.ts — complete translation map
export const T = {
  en: {
    brand: 'Fixeth', tagline: 'Learn. Prove. Build.',
    nav_dashboard: 'Dashboard', nav_video: 'Guided Video',
    nav_notebook: 'Notebook', nav_quiz: 'Quiz & Assignment',
    nav_submissions: 'Submissions', nav_codespace: 'Code Space',
    nav_tools: 'Tools & Resources', nav_mentor: 'AI Mentor',
    continue: 'Continue Learning →',
    byoa_note: 'Your key never leaves your device',
    // ... all strings
  },
  bn: {
    brand: 'ফিক্সেথ', tagline: 'শিখুন। প্রমাণ করুন। গড়ুন।',
    nav_dashboard: 'ড্যাশবোর্ড', nav_video: 'গাইডেড ভিডিও',
    nav_notebook: 'নোটবুক', nav_quiz: 'কুইজ ও অ্যাসাইনমেন্ট',
    nav_submissions: 'সাবমিশন', nav_codespace: 'কোড স্পেস',
    nav_tools: 'টুলস', nav_mentor: 'এআই মেন্টর',
    continue: 'শিক্ষা চালিয়ে যান →',
    byoa_note: 'আপনার কী কখনো আমাদের সার্ভারে যায় না',
    // ... all strings
  }
};

// React context — wrap in layout
export const LangContext = createContext<{
  lang: 'en' | 'bn';
  setLang: (l: 'en' | 'bn') => void;
  t: typeof T['en'];
}>({ lang: 'en', setLang: () => {}, t: T.en });

export const useLang = () => useContext(LangContext);

// Toggle persists to: localStorage + users table (via debounced PATCH)
```

### F13 — DARK/LIGHT MODE

```typescript
// CSS variables in globals.css
:root {
  --bg-0: #0B0B0F; --bg-1: #13131A; --bg-2: #1A1A24;
  --bg-3: #22222E; --bg-4: #2C2C3A;
  --border: #2E2E3E; --border-hi: #44445A;
  --txt-0: #EEEEF8; --txt-1: #8888A8; --txt-2: #4A4A62;
  --accent: #00C896; --accent-dim: #00C89618;
  --amber: #F5A623; --blue: #4A9EFF; --red: #FF5B5B; --purple: #A78BFA;
}
.light {
  --bg-0: #F4F4F8; --bg-1: #FFFFFF; --bg-2: #F0F0F6;
  --bg-3: #E8E8F2; --bg-4: #DCDCE8;
  --border: #DCDCE8; --border-hi: #C0C0D0;
  --txt-0: #18182A; --txt-1: #5A5A78; --txt-2: #9898B0;
  --accent: #008A68; --accent-dim: #008A6812;
}

// ThemeContext: toggle adds/removes .light class on <html>
// Persists to localStorage + users.preferred_theme
```

---

## TRANSCRIPT PIPELINE (backend/jobs/subtitlePipeline.ts)

```typescript
export async function processVideo(lesson_id: string, youtube_video_id: string) {
  // 1. English captions via YouTube Data API v3
  let transcript = await fetchYouTubeCaptions(youtube_video_id, 'en');

  // 2. Whisper fallback
  if (!transcript?.length) {
    const audioBlob = await downloadVideoAudio(youtube_video_id);
    transcript = await whisperTranscribe(audioBlob);
  }

  // 3. Sentence-boundary chunking, 2-3 sentence overlap, max 300 tokens
  const chunks = sentenceBoundaryChunk(transcript, { overlap: 2, maxTokens: 300 });

  // 4. Embed all chunks
  const embeddings = await Promise.all(
    chunks.map(c => embedQueryServerSide(c.text))
  );

  // 5. Store in pgvector
  await supabase.from('transcript_chunks').insert(
    chunks.map((c, i) => ({
      lesson_id, chunk_text: c.text,
      start_time: c.start, end_time: c.end,
      embedding: embeddings[i]
    }))
  );

  // 6. Bengali translation via GPT-4o
  const GLOSSARY = ['Python','function','return','DataFrame','API','Git',
    'variable','loop','class','import','npm','React','Node.js','SQL',
    'Docker','AWS','Pandas','NumPy','Jupyter','useState','useEffect'];

  const bnTranslation = await translateWithGPT4o(transcript, {
    glossary: GLOSSARY,
    maxWordsPerSegment: 12
  });

  // 7. Quality gate
  const fullSourceText = transcript.map(c => c.text).join(' ');
  const fullBnText = bnTranslation.map(c => c.text).join(' ');
  const { score, auto_published, notes } = await scoreAndGate(fullSourceText, fullBnText);

  // 8. Store subtitles
  const vttContent = buildVTT(bnTranslation);
  const { data: vttFile } = await supabase.storage
    .from('subtitles').upload(`${lesson_id}/bn.vtt`, vttContent);

  await supabase.from('subtitles').upsert({
    lesson_id, lang: 'bn',
    vtt_url: vttFile?.path,
    cues_json: bnTranslation,
    quality_score: score,
    auto_published,
    reviewed: false
  }, { onConflict: 'lesson_id,lang' });
}
```

---

## SEED CURRICULUM (scripts/seedCurriculum.ts)

```typescript
// Data Science Track concepts — seed these FIRST before building AI features
const DS_CONCEPTS = [
  { label: 'python.variables',       difficulty: 1 },
  { label: 'python.datatypes',       difficulty: 1 },
  { label: 'python.control_flow',    difficulty: 1 },
  { label: 'python.functions',       difficulty: 2 },
  { label: 'python.scope',           difficulty: 2 },
  { label: 'python.return',          difficulty: 2 },
  { label: 'python.comprehensions',  difficulty: 2 },
  { label: 'numpy.arrays',           difficulty: 2 },
  { label: 'numpy.operations',       difficulty: 3 },
  { label: 'pandas.dataframe',       difficulty: 3 },
  { label: 'pandas.cleaning',        difficulty: 3 },
  { label: 'viz.matplotlib',         difficulty: 2 },
  { label: 'stats.distributions',    difficulty: 3 },
  { label: 'ml.supervised',         difficulty: 4 },
  { label: 'ml.evaluation',         difficulty: 4 },
];

const DS_EDGES = [
  ['python.variables',    'python.datatypes',    'requires'],
  ['python.datatypes',    'python.control_flow', 'requires'],
  ['python.control_flow', 'python.functions',    'requires'],
  ['python.functions',    'python.scope',        'requires'],
  ['python.scope',        'python.return',       'reinforces'],
  ['python.functions',    'python.comprehensions','requires'],
  ['python.datatypes',    'numpy.arrays',        'requires'],
  ['numpy.arrays',        'numpy.operations',    'requires'],
  ['numpy.operations',    'pandas.dataframe',    'requires'],
  ['pandas.dataframe',    'pandas.cleaning',     'requires'],
  ['pandas.cleaning',     'viz.matplotlib',      'reinforces'],
  ['stats.distributions', 'ml.supervised',       'requires'],
  ['ml.supervised',       'ml.evaluation',       'requires'],
];
```

---

## IMPLEMENTATION ORDER

Build in this exact sequence to avoid dependency failures:

```
1.  Run all SQL migrations (schema + RLS + pgvector index + concept_path RPC)
2.  Auth: NextAuth v5 (Google + GitHub + LinkedIn + Email) + middleware
3.  i18n: T map + LangContext + ThemeContext + CSS variables
4.  TopBar (lang/theme toggles, BYOA badge) + BottomNav (8 icons, active state)
5.  BYOA: localStorage manager + /api/byoa/test proxy route
6.  Onboarding: 5 steps + Curriculum Agent integration
7.  Dashboard: all 6 sections, real Supabase data
8.  Lesson viewer: 3-column layout + YouTube IFrame + subtitle overlay + 4 tabs
9.  Video Timestamp Intelligence: embed query → pgvector RPC → seekTo
10. Transcript pipeline: Whisper + chunking + pgvector insert (backend job)
11. Bengali subtitle pipeline: GPT-4o translation + quality gate + VTT storage
12. Curriculum Agent: concept graph seed + recursive CTE + path builder
13. Tutor Agent: RAG chat + timestamp retrieval + quiz generation
14. Quiz engine: item loader + Judge0 for code + score handler + mastery update
15. Submissions: upload → Supabase Storage + Assessment Agent + edX detail view
16. AI Mentor: full chat + level selector + voice input + session history
17. Notebook: JupyterLite iframe + toolbar
18. Code Space: GitHub OAuth + Codespace API + launch state machine
19. Tools: BYOA config UI + Indeed status + cloud OAuth stubs
20. Portfolio: SSR profile + certificate PDF + /verify/[hash]
21. Job Market Agent: Playwright scraper + pg_cron weekly job
22. Payment: Stripe checkout + SSLCommerz + financial aid flow
```

---

## QUALITY STANDARDS

- Every AI feature: loading skeleton + graceful error fallback (never crashes)
- BYOA not configured: show setup modal, platform fallback used silently
- All user-facing strings: through i18n — zero hardcoded UI text
- Bengali strings: all technical terms (Python, function, return, API, etc.) stay in English
- Supabase RLS: enforced on all user-scoped tables — verified in migrations
- No console.log in production — remove all before commit
- Forms: Zod validation client-side, mirror server-side in API routes
- API routes: Upstash Redis rate limiting (identifier = user_id + route)
- Mobile: BottomNav hides labels below 768px, icon-only mode
- Semantic HTML: proper heading hierarchy for accessibility

---

## ARCHITECTURE.md (maintain throughout development)

```markdown
# Fixeth — Architecture
## System Layers
[6-layer diagram from plan.md Section 2]

## Storage
- Supabase PostgreSQL: users, tracks, modules, lessons, enrollments,
  concepts, concept_edges, learner_mastery, adaptive_paths, progress,
  quiz_items, quiz_results, submissions, certificates, job_market_signals
- pgvector: transcript_chunks (1536-dim, ivfflat index, lists=100)
- Supabase Storage: subtitles/[lesson_id]/bn.vtt, certificates/[id].pdf,
  submissions/[user_id]/[file], avatars/[user_id]

## Processing
- Transcript: YouTube ID → Whisper → sentence-boundary chunks (max 300 tokens,
  2-3 sentence overlap) → text-embedding-3-small → pgvector
- Subtitles: English captions → GPT-4o translation (glossary-anchored) →
  quality score (fluency + accuracy + term_preserve) → ≥0.85 auto-publish
- Concept graph: hand-curated nodes/edges via migration scripts;
  traversed via recursive CTE (get_concept_path RPC)

## BYOA
- All AI calls made client-side using browser localStorage key
- Platform fallback: Gemini Flash via /api/ai/fallback (50 calls/day/user, Redis counter)
- Keys never reach Fixeth servers

## Agent Contracts
[Input/output JSON for each agent — see metaprompt Section MCP AGENT CONTRACTS]

## External Dependencies
- YouTube Data API v3 — 10,000 units/day quota
- OpenAI Whisper — ~$0.006/min audio
- OpenAI text-embedding-3-small — $0.02/1M tokens
- Judge0 CE — 100 req/day free hosted tier
- Playwright — weekly cron on Railway
- Supabase pg_cron — job market scraper Monday 09:00
```

---

*Fixeth v3 build prompt — শিখুন। প্রমাণ করুন। গড়ুন।*
