# Fixeth — Complete Project Plan
**THE INFINITY AI BUILDFEST 2026 — EdTech Track**
*Merged from both team contributions. Where ideas conflicted, the stronger one was kept.*

---

## 1. Vision

A Bengali-first, career-track LMS combining adaptive learning paths, RAG-powered video intelligence, and graph-based concept reasoning — purpose-built for Bangladeshi learners, globally scalable.

**Core promise:** The world's best curated tech education, localized in Bengali, with AI that adapts to each learner, verifies their skills, and connects them to real jobs.

**Philosophy:**
- We curate, not create — the best content already exists on YouTube
- We adapt, not just deliver — the path is unique to each learner
- We verify, not just certificate — employers can trust our credentials
- We connect, not just educate — learning ends in placement, not completion

**Tracks at launch:** Data Science · Backend Development
**Expanded vision:** 23+ tracks across tech, agriculture, healthcare, and community roles

---

## 2. AI-Native Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTION LAYER                                      │
│  Next.js 14 · Bengali + English · Dark/Light · BYOA         │
│  8-screen workspace: Guided Video · Notebook · Quiz ·       │
│  Submissions · Dashboard · Code Space · Tools · AI Mentor   │
├─────────────────────────────────────────────────────────────┤
│  APPLICATION LOGIC LAYER                                     │
│  Next.js API Routes · Supabase Edge Functions               │
│  Enrollment · Progress · Assessment · Billing               │
├─────────────────────────────────────────────────────────────┤
│  AI INTELLIGENCE LAYER                                       │
│  BYOA: OpenAI · Anthropic · Gemini · Groq · Ollama (local)  │
│  Platform fallback: Gemini Flash (50 calls/day, free tier)  │
│  Reasoning · Generation · Translation · Grading             │
├─────────────────────────────────────────────────────────────┤
│  KNOWLEDGE RETRIEVAL LAYER                                   │
│  pgvector (Supabase) — RAG over video transcripts           │
│  PostgreSQL graph tables — concept dependency graph         │
│  text-embedding-3-small — 1536-dim vector embeddings        │
├─────────────────────────────────────────────────────────────┤
│  AGENT ORCHESTRATION LAYER (MCP)                            │
│  Curriculum Agent · Tutor Agent · Assessment Agent          │
│  + Job Market Agent · Subtitle Quality Agent                │
├─────────────────────────────────────────────────────────────┤
│  AUTOMATION & INTEGRATION LAYER                             │
│  YouTube Data API · OpenAI Whisper · Judge0 CE              │
│  Playwright scraper (Bdjobs, Chakri, Indeed, LinkedIn)      │
│  GitHub API · Stripe · SSLCommerz · Resend                  │
└─────────────────────────────────────────────────────────────┘
```

**AI methods used:** LLM · RAG (pgvector) · Graph-based reasoning (PostgreSQL CTE) · ML clustering (micro-lessons) · Adaptive routing

---

## 3. User Roles

| Role | Access |
|------|--------|
| Learner (Free) | Foundation tracks + first module of any paid track |
| Learner (Pro) | Full enrolled track, all assessments, certificate, public portfolio |
| Institutional Learner | Learner under institution seat licence |
| Institutional Admin | Cohort dashboard, CSV exports, deadline management |
| Platform Admin | Curriculum management, subtitle review queue, job market signals |

---

## 4. Core Features

### 4.1 — Adaptive Learning Path *(#1 priority)*

**What it does:**
- Learner takes a diagnostic test before starting any track (skippable — but recommended with incentive copy)
- Results mapped against a **concept dependency graph** in PostgreSQL
- Recursive CTE graph traversal builds a custom lesson sequence per learner
- Quiz score < 60% → remedial micro-lesson injected before the next concept node
- Score ≥ 80% → concept marked mastered, lesson skipped
- **Cross-track memory:** completing Data Science marks all Python nodes mastered; Backend Development automatically skips those modules on enrolment

**Graph structure:**
```sql
concepts      (id, label, track_id, difficulty 1–5)
concept_edges (from_concept, to_concept, type: 'requires' | 'reinforces')
learner_mastery (user_id, concept_id, score, mastered bool, mastered_at)
```

**Pacing sub-function:** detects rushing (fast completion + low score) or stalling (session gap > 3 days) → triggers nudge.
**Difficulty calibration sub-function:** after 3 consecutive high scores, bumps exercise difficulty tier up.

**Agent:** Curriculum Agent (MCP)

---

### 4.2 — Video Timestamp Intelligence *(hero demo feature)*

**What it does:**
- Every video pre-processed: transcript → sentence-boundary chunked → concept-tagged → stored in pgvector with timestamps
- Learner types a question mid-video
- System performs vector similarity search over transcript chunks (cosine, top-5, threshold 0.75)
- Returns exact timestamp range answering the question
- Split UI: text explanation (left/chat) + video player seeks to that timestamp (right)
- Amber badge appears: "⏱ Jumped to 14:32"

**Pipeline:**
```
YouTube ID → Whisper transcript → sentence-boundary chunks →
concept extraction (LLM) → timestamp tagging →
text-embedding-3-small → pgvector storage
```

**Shares transcript pipeline with 4.3** — built once, consumed by both features.

**Agent:** Tutor Agent (MCP)

**Demo script:** Ask "What does return do?" → chat answers → video seeks to 14:32 → amber highlight. Ten seconds. Judges understand it immediately.

---

### 4.3 — RAG "Chat with the Video" *(grounded AI — no hallucination)*

**What it does:**
- Chat panel alongside every video
- Question → pgvector cosine similarity search over video's own transcript embeddings
- Answer grounded in video content only — if no chunk scores ≥ 0.75, system says "I couldn't find this in the video" rather than fabricating
- Response includes clickable timestamp citation ("~14:30 in this video")
- Available in English and Bengali
- "Generate practice questions from this video" → questions populate the Practice tab

**Chunk strategy:** Sentence-boundary chunks, 2–3 sentence overlap, max 300 tokens per chunk.

**Agent:** Tutor Agent (same MCP agent as 4.2)

---

### 4.4 — Bengali-First Localisation *(platform-defining moat)*

**UI layer:** Full platform in English and Bengali. i18n JSON files. Toggle in navbar + settings. Persisted per user.

**Subtitle pipeline:**
```
1. Fetch English captions — YouTube Data API v3
2. If none → transcribe — OpenAI Whisper (word-level timestamps)
3. Translate to Bengali — GPT-4o with approved glossary (50–100 terms)
   Preserve in English: "useState", "DataFrame", "API", "Git", "return", etc.
4. Auto-score: fluency (0.4) + accuracy (0.4) + term preservation (0.2)
5. Score ≥ 0.85 → auto-publish (Subtitle Quality Agent)
   Score < 0.85 → human review queue (admin panel)
6. Generate WebVTT → Supabase Storage → serve via custom overlay (250ms polling)
```

**Player controls:** EN | বাংলা | Off toggle on every video.
**Learner flag:** "Incorrect translation" button on each subtitle segment → feeds review queue with real error data.
**Low-bandwidth fallback:** 2G detection → text-only lesson mode auto-activates, video embed hidden.

**Agent:** Subtitle Quality Agent (MCP sub-function)

---

### 4.5 — Job Market-Driven Curriculum *(real-world data processing)*

**What it does:**
- Weekly automated scrape: Bdjobs, Chakri.com, Indeed, LinkedIn
- Playwright handles JS-heavy local job boards (Bdjobs, Chakri) that basic HTTP scrapers miss
- Extracts: trending skills, tools, frameworks, salary ranges — no PII collected
- Rising skills (>15% week-on-week) flagged for curriculum addition
- Declining skills flagged for de-emphasis or removal
- Salary benchmarks displayed on each track's landing page as social proof
- **All signals route to admin dashboard — human review before any curriculum change**
- Indeed MCP already connected for live demonstration

**Job Market Agent** runs weekly via Supabase pg_cron. Output is advisory only — never auto-modifies curriculum.

---

### 4.6 — Multi-Level AI Explanations

Any concept explained at 4 levels on demand:
- **ELI5** — accessible to a 15-year-old, everyday analogies
- **Student** — standard undergraduate level
- **Practitioner** — assumes professional experience, includes edge cases
- **Researcher** — references technical literature and implementation depth

Bengali at each level. ELI5 + Student pre-generated and cached for top 200 concepts. Practitioner + Researcher live via BYOA.

---

### 4.7 — Community Auto-Generated Micro-Lessons

- ML clustering groups semantically similar questions asked within a cohort
- When cluster threshold reached (≥ 30 learners asking the same concept) → AI drafts micro-lesson: explanation + code example + 3-question quiz
- Goes to instructor review queue — never auto-published
- Confusion rate (quiz scores) tracked before/after insertion to measure effectiveness

---

### 4.8 — BYOA (Bring Your Own API)

AI keys stored in browser `localStorage` only — never transmitted to Fixeth servers.

Supported providers (all use OpenAI-compatible endpoint format):
| Provider | Type | Cost |
|----------|------|------|
| Groq | Cloud | Free tier |
| Gemini | Cloud | Free tier |
| OpenAI | Cloud | Paid |
| Anthropic Claude | Cloud | Paid |
| OpenRouter | Aggregator | Pay-per-use |
| Ollama (local) | Local | Free |
| LM Studio | Local | Free |

Platform fallback: Gemini Flash key server-side, rate-limited to 50 AI feature calls/day/user — ensures AI features work on signup before BYOA is configured.

BYOA teaches learners real API management — framed as a professional skill, not a workaround.

---

### 4.9 — Verifiable Public Portfolio & Certificates

- Hash-verified certificate: unique SHA-256 hash + QR code
- Employer verification at `/verify/[hash]` — no platform contact needed, instant
- LinkedIn "Add to Profile" deep-link (standardised credential URL format)
- Public profile: track scores, grade tier, project links, badges, cohort percentile
- PDF download via `@react-pdf/renderer`
- Tamper-evident: hash stored in `certificates` table, verified server-side on `/verify`

---

### 4.10 — Placement Pipeline *(post-MVP, but pitch-critical)*

**Tech tracks:** Match graduates to remote freelance + full-time roles via Indeed MCP + employer roster.
- Placement Agent scores job listings against graduate profile (skill overlap, salary fit, work type)
- Generates personalised cover letter context for top-3 matches
- Employer pays referral fee: $200–500 per successful placement

**Non-tech tracks (agriculture, health):**
- Partnership pipeline with BRAC, DAE (Bangladesh), WFP, IFAD
- Certificate recognition MOU with government bodies
- Grant funding pathway (IFAD, UNDP digital skills programmes)

---

### 4.11 — Learn From Any GitHub Repo *(Pro only, Phase 3)*

- Paste repo URL → analyse structure, patterns, dependencies
- Generates custom learning path: structure → core functions → key patterns → build-your-clone → first PR guide
- Scoped to repos < 50k lines, < 100 files for reliable quality
- "Generated on [date]" label + one-click refresh

---

### 4.12 — Offline-First PWA *(Phase 3)*

- Text lessons + quizzes cached locally (up to 87 lessons, 12 quizzes)
- Progress queues offline, syncs on reconnect
- 2G detection → auto offline mode
- V1: text + quiz only. No video caching. No local LLM in V1.

---

## 5. UI Architecture

**Layout: 8-screen bottom navigation (DaVinci Resolve style)**

```
[🎬 Guided Video] [📓 Notebook] [📝 Quiz & Assignment] [📤 Submissions]
[🏠 Dashboard]    [⚡ Code Space] [🔧 Tools & Resources] [✦ AI Mentor]
```

**Guided Video workspace (3 columns):**
```
LEFT (240px)          MIDDLE (flex)                RIGHT (290px)
─────────────         ──────────────────────────   ──────────────
Course Explorer       Video Player                  AI Mentor Chat
- Module accordion    + Bengali subtitle overlay    - Context pills
- Lesson list         + EN/বাংলা/Off toggle        - Quick prompts
- Progress ring       + Timestamp markers           - BYOA indicator
- Prev/Next           ──────────────────────────   - Level selector
                      Bottom tabs (4):               (ELI5/Student/
                      Notes | Transcript |            Pro/Research)
                      Chat with Video |             - Voice toggle
                      Practice                     - Session history
```

**Persistent UI controls (top bar):**
- EN | বাংলা language toggle (saved to `users` table)
- 🌙 Dark / ☀️ Light mode toggle (saved to `users` table)
- BYOA provider indicator badge
- User avatar

---

## 6. Assessment System

```
Track Score = Quiz Average (20%) + Coding Challenges (25%) + Module Projects (30%) + Capstone (25%)
```

| Score | Grade |
|-------|-------|
| 90–100 | Distinction |
| 75–89 | Merit |
| 60–74 | Pass |
| < 60 | Retake |

**Assessment types:** MCQ (auto-graded) · Coding Challenge (Judge0 CE) · Project Submission · Peer Review · Capstone · Final Exam

**Retake policy:**
- Quizzes: unlimited, best score counts
- Module projects: up to 3 resubmissions
- Capstone: 2 attempts
- Final exam: 2 attempts, 7-day cooldown

**Integrity:**
- Plagiarism: cosine similarity against all same-lesson submissions (flag if > 0.85)
- Cheating detection: anomalous speed/accuracy patterns flagged — never auto-penalised, routed to admin
- AI misuse: open-ended submissions require reflection log

**Submissions screen (edX-style):**
- My Submissions list (status badges + score bars)
- New Submission (drag-and-drop upload: .ipynb · .py · .pdf · .zip, max 50MB)
- Detail view: Grading Rubric tab | AI Feedback tab | Peer Review tab

---

## 7. Curriculum Structure

### Free Tracks (Foundation — always free)
Digital Literacy · Basic Computer Skills · Git & Version Control · AI & Prompting Basics · File Management · Internet Safety

*Free rationale: These don't directly generate income. They are acquisition channels into the paid funnel.*

### Paid Tracks — Tech
Data Science · Backend Development · Frontend/MERN · DevOps & Cloud · Cybersecurity · Mobile (React Native) · AI/ML Engineering · Data Engineering · Software Engineering · SQL & Analytics

### Paid Tracks — Agricultural (income-generating)
Precision Agriculture · Hydroponics · Aeroponics

### Paid Tracks — Professional
Digital Marketing · Product Management · Data Analytics for Managers · HR Analytics · Supply Chain Analytics · CEO/Founder Track

### Free Tracks — Civic & Community
Rooftop Gardening · Community Health Worker · Financial Literacy

**Pricing logic: if completing this track leads directly to employment or business income → paid. Otherwise → free.**

### Track 1 — Data Science (120 hrs)
| Module | Topic | Hours |
|--------|-------|-------|
| 1 | Python for Data Science | 15 |
| 2 | Data Manipulation — NumPy, Pandas | 20 |
| 3 | Data Visualization — Matplotlib, Seaborn, Plotly | 15 |
| 4 | Statistics & Probability | 15 |
| 5 | Machine Learning Fundamentals | 25 |
| 6 | ML in Practice | 15 |
| Capstone | Full pipeline → deployed to HuggingFace Spaces | 15 |

### Track 2 — Backend Development (100 hrs)
| Module | Topic | Hours |
|--------|-------|-------|
| 1 | JavaScript Deep Dive — ES6+, async/await | 15 |
| 2 | Node.js Fundamentals | 15 |
| 3 | Express.js & REST APIs | 20 |
| 4 | Databases — MongoDB & Mongoose | 15 |
| 5 | Authentication & Security — JWT, bcrypt, RBAC | 15 |
| 6 | Testing & Deployment — Jest, GitHub Actions | 10 |
| Capstone | Full API: auth + CRUD + file upload + tests + live deploy | 10 |

---

## 8. Pricing

| Tier | Price | Includes |
|------|-------|----------|
| Free | ৳0 | Foundation tracks + first module of any paid track |
| Per Track | ৳2,999 lifetime | Full track + assessments + certificate + portfolio |
| Bundle (3 tracks) | ৳6,750 (25% off) | 3 tracks + priority subtitle access |
| Institutional | ৳1,200/seat/month | Admin dashboard + cohort management + CSV exports |
| Financial Aid | 100% or 50% | Application-based, ~15% of seats, no-shame process |

*Payment processing implemented in Phase 2. Pricing page is static at launch.*

---

## 9. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | SSR for public profiles/certificates; App Router for nested layouts |
| UI Prototyping | Lovable | Required by competition; rapid iteration |
| Development | Cursor + Claude Code | Required by competition; markdown-driven architecture |
| Auth | Supabase Auth — Google, GitHub, LinkedIn, Email | LinkedIn relevant for portfolio integration |
| Database | Supabase PostgreSQL | Single DB for relational + graph tables + pgvector |
| Vector Store | pgvector (Supabase extension) | Collocated with relational data; competition-recommended stack |
| Concept Graph | PostgreSQL graph tables + recursive CTE | No separate graph DB; sufficient for DAG at this scale |
| Storage | Supabase Storage | Certificates, VTT files, submission uploads, avatars |
| Agent Orchestration | MCP (Model Context Protocol) | Competition requirement; clean agent contracts |
| Primary LLM | Claude (reasoning, grounded answers) | Superior instruction-following; lower hallucination on grounded context |
| Translation LLM | GPT-4o | Stronger multilingual performance on Bengali |
| Transcription | OpenAI Whisper | Best-in-class WER on Bengali-accented English; one-time cost per video |
| Embeddings | text-embedding-3-small (OpenAI) | 1536 dimensions; cost-effective; strong semantic retrieval |
| BYOA | Client-side localStorage | Zero server AI cost; teaches learners real API management |
| Code Execution | Judge0 CE hosted API | Sandboxed, multi-language, no infra management |
| Email | Resend | Transactional email |
| Job Scraping | Playwright | Handles JS-heavy job boards (Bdjobs, Chakri) |
| Background Jobs | Supabase pg_cron | Weekly job market scraper |
| Payments | Stripe + SSLCommerz (bKash/Nagad) | International + Bangladesh local |
| Hosting | Vercel | Frontend + API routes |
| Cache | Upstash Redis | Rate limiting + subtitle cache |

---

## 10. Agent Architecture (MCP)

### Curriculum Agent
```
Input:  { user_id, track_id, mastery_state: {concept_id: score}[], trigger }
        trigger: "enrollment" | "quiz_result" | "module_complete" | "cross_track"

Process:
  1. Recursive CTE traversal of concept_edges (topological sort, DAG)
  2. For each concept node:
     - score >= 80 → skip: true, reason: "Already mastered"
     - score < 60 && attempts > 0 → inject remedial micro-lesson before
     - no data or score 60–79 → include normally
  3. Cross-track: diff new track's nodes against learner_mastery
  4. Store ordered path in adaptive_paths table
  5. Sub-functions: pacing agent (session gaps), difficulty calibrator (streak detection)

Output: {
  path: [{lesson_id, skip: bool, reason?, injected_remedial?}],
  skipped_count: int,
  message: string  // shown to learner, Bengali if preferred
}
```

### Tutor Agent
```
Input:  { question, lesson_id, video_id, current_timestamp_sec, language }

Process:
  1. Embed question → pgvector cosine similarity search over transcript_chunks
     WHERE lesson_id = ? AND similarity >= 0.75
     ORDER BY similarity DESC LIMIT 5
  2. If chunks found → ground LLM response in retrieved context only
  3. Map best chunk to concept_timestamp_index → return seek_to_seconds
  4. If no chunk >= 0.75 → respond: "I couldn't find this in the video"
  5. If question asks for practice → generate quiz items → return action: "show_in_practice_tab"

Output: {
  answer: string,
  language: "en" | "bn",
  timestamp: {seek_to_seconds: float, label: string} | null,
  action: null | "show_in_practice_tab" | "seek_video",
  source_chunks: [{chunk_id, similarity}]
}
```

### Assessment Agent
```
Input:  { submission_content, rubric: [{criterion, weight, description}], concept_ids[] }

Process:
  1. LLM evaluation: submission vs each rubric criterion
  2. Structured score per criterion (0–criterion.weight)
  3. Overall feedback paragraph (constructive, actionable)
  4. Bengali feedback if user.language === 'bn'
  5. Plagiarism pre-check: cosine similarity against submission_embeddings

Output: {
  scores: {criterion_id: score},
  total: float,
  max: float,
  feedback: string,
  feedback_bn: string | null,
  pass: bool,
  plagiarism_flag: bool,
  per_criterion_notes: [{criterion, score, note}]
}
```

### Job Market Agent
```
Runs: weekly via Supabase pg_cron (Monday 09:00 BST)

Input:  Job postings from Playwright scraper (Bdjobs, Chakri, Indeed, LinkedIn)
Process:
  1. Extract skill/tool mentions via keyword matching + LLM extraction
  2. Count frequency; compare to previous week
  3. Flag rising (>15% WoW) and declining (<-15% WoW)
  4. Cross-reference against current curriculum
  5. Generate admin report — never auto-modify curriculum

Output: { rising_skills[], declining_skills[], salary_benchmarks{}, admin_summary }
```

### Subtitle Quality Agent
```
Input:  { source_text, translated_text, content_type }
Process:
  1. Score fluency (0.4 weight) — natural Bengali
  2. Score accuracy (0.4 weight) — meaning preserved
  3. Score term preservation (0.2 weight) — technical terms intact
  4. Composite score
Output:
  score >= 0.85 → auto_publish: true
  score < 0.85  → auto_publish: false, route to review queue
```

---

## 11. Database Schema (Supabase PostgreSQL)

```sql
-- Core auth / profile
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT UNIQUE NOT NULL,
  name                TEXT,
  username            TEXT UNIQUE,
  avatar_url          TEXT,
  role                TEXT DEFAULT 'learner',    -- learner | institutional_admin | platform_admin
  plan                TEXT DEFAULT 'free',        -- free | pro
  institution_id      UUID,
  preferred_language  TEXT DEFAULT 'en',          -- en | bn
  preferred_theme     TEXT DEFAULT 'dark',
  goal                TEXT,                        -- job | upskill | switch | explore
  experience_level    TEXT,                        -- beginner | some | pro
  byoa_provider       TEXT,                        -- label only, key is client-side
  streak              INT DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  last_active         TIMESTAMPTZ
);

-- Curriculum structure
CREATE TABLE tracks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  title_en         TEXT NOT NULL,
  title_bn         TEXT,
  description_en   TEXT,
  description_bn   TEXT,
  price_bdt        INT DEFAULT 0,
  is_free          BOOLEAN DEFAULT FALSE,
  difficulty       TEXT,
  estimated_hours  INT,
  skills           TEXT[],
  tools            TEXT[],
  published        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
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

-- Concept graph (PostgreSQL, no separate graph DB)
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

-- Learner state
CREATE TABLE learner_mastery (
  user_id     UUID REFERENCES users(id),
  concept_id  UUID REFERENCES concepts(id),
  score       NUMERIC,
  mastered    BOOLEAN DEFAULT FALSE,
  attempts    INT DEFAULT 0,
  mastered_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, concept_id)
);

CREATE TABLE adaptive_paths (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  track_id    UUID REFERENCES tracks(id),
  path_json   JSONB NOT NULL,  -- ordered [{lesson_id, skip, reason}]
  built_at    TIMESTAMPTZ DEFAULT NOW()
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

-- Knowledge retrieval
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE transcript_chunks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_text  TEXT NOT NULL,
  start_time  NUMERIC,
  end_time    NUMERIC,
  embedding   VECTOR(1536)
);

CREATE INDEX ON transcript_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Subtitles
CREATE TABLE subtitles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID REFERENCES lessons(id),
  lang         TEXT NOT NULL,           -- en | bn
  vtt_url      TEXT,                    -- Supabase Storage URL
  cues_json    JSONB,                   -- [{start, end, text}] for overlay
  quality_score NUMERIC,
  auto_published BOOLEAN DEFAULT FALSE,
  reviewed     BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (lesson_id, lang)
);

-- Assessment
CREATE TABLE quiz_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      UUID REFERENCES lessons(id),
  concept_id     UUID REFERENCES concepts(id),
  question_en    TEXT NOT NULL,
  question_bn    TEXT,
  options        JSONB NOT NULL,   -- [{text_en, text_bn, is_correct, explanation}]
  difficulty     INT DEFAULT 2,
  created_at     TIMESTAMPTZ DEFAULT NOW()
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
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id),
  lesson_id        UUID REFERENCES lessons(id),
  type             TEXT,              -- quiz | project | capstone
  file_urls        TEXT[],
  notes            TEXT,
  score            NUMERIC,
  max_score        NUMERIC DEFAULT 100,
  grade_breakdown  JSONB,             -- [{criterion, weight, score, feedback}]
  ai_feedback      TEXT,
  ai_feedback_bn   TEXT,
  peer_reviews     JSONB,
  status           TEXT DEFAULT 'submitted',
  plagiarism_score NUMERIC,
  integrity_flagged BOOLEAN DEFAULT FALSE,
  graded_by        TEXT DEFAULT 'pending',
  submitted_at     TIMESTAMPTZ DEFAULT NOW(),
  graded_at        TIMESTAMPTZ
);

-- Certificates
CREATE TABLE certificates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  track_id      UUID REFERENCES tracks(id),
  enrollment_id UUID REFERENCES enrollments(id),
  cert_hash     TEXT UNIQUE NOT NULL,  -- SHA-256
  score         NUMERIC,
  grade         TEXT,
  pdf_url       TEXT,
  issued_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Job market
CREATE TABLE job_market_signals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill          TEXT NOT NULL,
  source         TEXT,                -- bdjobs | chakri | indeed | linkedin
  mention_count  INT,
  week_change_pct NUMERIC,
  avg_salary_bdt INT,
  in_curriculum  BOOLEAN DEFAULT FALSE,
  status         TEXT DEFAULT 'pending_review',  -- pending_review | actioned | dismissed
  scraped_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Financial aid
CREATE TABLE financial_aid (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  track_id     UUID REFERENCES tracks(id),
  reason       TEXT,
  income_range TEXT,
  status       TEXT DEFAULT 'pending',  -- pending | approved_full | approved_half | rejected
  applied_at   TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ
);

-- RLS: enable on all user-scoped tables
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
-- Policy: users can only read/write their own rows
```

---

## 12. Model Selection Rationale

| Component | Model / Tool | Reason |
|-----------|-------------|--------|
| RAG grounding + agent reasoning | Claude (primary) | Superior instruction-following for structured JSON; lower hallucination on grounded context tasks |
| Bengali translation | GPT-4o | Stronger multilingual performance on Indic languages; better glossary adherence |
| Transcription | OpenAI Whisper | Open-weight; best-in-class WER on Bengali-accented English; one-time per video |
| Vector embeddings | text-embedding-3-small | 1536-dim; cost-effective; strong semantic retrieval |
| Vector store | pgvector (Supabase) | Eliminates separate vector DB; collocated with relational data; competition stack |
| Concept graph | PostgreSQL (recursive CTE) | Sufficient for directed acyclic graph at this scale; no graph DB overhead |
| Code execution | Judge0 CE API | Sandboxed; multi-language; hosted — zero infra management at MVP |
| Job scraping | Playwright | Handles JS-heavy job boards (Bdjobs, Chakri) that lightweight scrapers miss |
| BYOA | OpenAI-compatible standard | One interface for all providers including local Ollama; learner owns the key |

---

## 13. KPIs

| Metric | Year 1 Target |
|--------|--------------|
| Free → Pro conversion | 5–8% |
| Lesson completion rate | > 60% |
| 7-day retention | > 40% |
| RAG answer satisfaction (thumbs up) | > 80% |
| Bengali subtitle quality (auto-score) | ≥ 0.85 |
| Adaptive path skip accuracy (learner self-reported) | > 70% |
| Job signal → curriculum action rate | tracked weekly |
| Pro learners | 1,000+ |
| Placements (tech, remote) | 50+ |

---

## 14. Development Roadmap

### Phase 0 — Foundation (Weeks 1–3)
- [ ] Register fixeth.com or fixeth.ai domain
- [ ] Set up monorepo — Next.js frontend (submodule) + backend services
- [ ] Design system in Lovable + Tailwind tokens
- [ ] Supabase project: schema migrations, pgvector extension, RLS policies
- [ ] Concept dependency graph seeded for Data Science track (migration scripts)
- [ ] Begin YouTube content curation — map 40–50 videos to module structure

### Phase 1 — Core MVP (Weeks 4–14)
| Weeks | Deliverable |
|-------|-------------|
| 4–5 | Auth (Google, GitHub, LinkedIn, Email) + 5-step onboarding wizard |
| 6–7 | Track page + lesson viewer + YouTube embed + Bengali subtitle overlay |
| 8–9 | Quiz engine — MCQ, auto-grade, retake logic |
| 10–11 | Progress tracking + dashboard (all sections) |
| 12–13 | Static pricing page + enrollment flow |
| 14 | Certificate generation + public profile + `/verify/[hash]` |

### Phase 2 — AI Layer (Weeks 15–22)
| Weeks | Deliverable |
|-------|-------------|
| 15–16 | Transcript pipeline — Whisper + chunking + pgvector embeddings |
| 17–18 | Tutor Agent (MCP) — RAG chat grounded in video transcript |
| 19–20 | Video Timestamp Intelligence — concept-timestamp map + split UI + seekTo |
| 21–22 | Multi-level explanations + Assessment Agent (MCP) + submission AI feedback |

### Phase 3 — Adaptive Layer (Weeks 23–28)
| Weeks | Deliverable |
|-------|-------------|
| 23–24 | Diagnostic test engine + learner mastery tracking |
| 25–26 | Curriculum Agent (MCP) — graph traversal + adaptive path |
| 27–28 | Cross-track memory + micro-lesson injection + pacing sub-agent |

### Phase 4 — Localization (Weeks 29–32)
| Weeks | Deliverable |
|-------|-------------|
| 29–30 | Bengali subtitle translation pipeline + quality scoring |
| 31–32 | Admin subtitle review queue + learner flag system |

### Phase 5 — Data & Intelligence (Weeks 33–36)
| Weeks | Deliverable |
|-------|-------------|
| 33–34 | Job market scraper (Playwright) + Supabase pg_cron + signal dashboard |
| 35–36 | Community micro-lesson clustering + instructor review queue |

### Phase 6 — Launch (Weeks 37–40)
- [ ] Stripe + SSLCommerz payment integration
- [ ] Landing page final + SEO
- [ ] Performance + security audit
- [ ] 20–50 learner beta test
- [ ] Public launch

### Post-Launch (Year 1)
- Offline-first PWA (text + quiz, no video)
- GitHub repo learning path generator (Pro)
- National Struggle Map (regional analytics dashboard)
- Job placement network (employer roster + Placement Agent)
- 5 additional tech tracks

---

## 15. Preliminary Submission Package (May 30 Deadline)

### 15.1 One-Page Summary Structure
1. **Problem** — Bangladeshi learners lack Bengali-language, AI-personalised, career-track tech education
2. **Solution** — Fixeth: adaptive LMS with RAG video intelligence, graph-based learning paths, BYOA
3. **AI Approach** — LLM + RAG (pgvector) + Graph reasoning (PostgreSQL CTE) + ML clustering
4. **Tech Stack** — Next.js, Supabase/pgvector, MCP agents, Claude/GPT-4o, Whisper, Playwright
5. **Target Users** — Tech learners in Bangladesh (primary); global Bengali diaspora (secondary)
6. **KPIs** — See Section 13
7. **Scalability** — Supabase + Vercel cloud-native, modular MCP agents, language-extensible

---

### 15.2 Three-Minute Pitch Script

| Segment | Duration | Script |
|---------|----------|--------|
| Problem | 0:00–0:30 | "170 million Bangladeshis. Half under 30. Every quality tech education platform is English-only, unadaptive, and unverifiable. A developer in Rajshahi is excluded from the global tech economy by language and access. This isn't a Bangladesh problem — a billion learners worldwide face the same wall." |
| Solution | 0:30–1:00 | "Fixeth. Bengali-first, adaptive, AI-native. Not a YouTube playlist. A system that knows what you already know, teaches what you don't, in your language, and proves it to employers — with a certificate they can actually verify." |
| Demo | 1:00–2:00 | Show: (1) Learner asks question mid-video → split UI → video seeks to 14:32 exactly. (2) Diagnostic result → graph traversal → "Skipping 4 concepts you already know." (3) Bengali subtitle toggle — EN → বাংলা → Off live on screen. |
| AI Architecture | 2:00–2:30 | "RAG over video transcripts via pgvector. Concept dependency graph in PostgreSQL driving adaptive routing. Three MCP agents: Curriculum, Tutor, Assessment. LLM grounded in video content — it cannot hallucinate outside the course material." |
| Impact & Scale | 2:30–3:00 | "25% free tier for civic good — digital literacy, health workers, community skills. Tech tracks generate income so learners pay. Globally: same architecture deploys to any language, any market. Bangladesh first. World next." |

---

### 15.3 Demo Recording Checklist

- [ ] Landing page walkthrough (30 sec)
- [ ] Sign up + onboarding wizard: language → goal → level → track → diagnostic (show skippable)
- [ ] Diagnostic result screen — adaptive path with "4 concepts skipped"
- [ ] Lesson workspace: 3-column layout, course explorer, video player
- [ ] Bengali subtitle toggle: EN → বাংলা → Off (live on screen)
- [ ] RAG chat: type question → grounded answer + timestamp citation appears
- [ ] **Video Timestamp Intelligence: question → split UI → video seeks to exact moment** ← HOLD 5+ SECONDS
- [ ] Practice tab: AI-generated questions appear after chat request
- [ ] Multi-level explanation: ELI5 → Student → Practitioner on same concept
- [ ] Submission: drag-and-drop file upload → AI feedback tab
- [ ] Public portfolio / certificate + `/verify/[hash]` employer verification
- [ ] Job market signals dashboard (brief)
- [ ] Admin subtitle review queue (brief)
- [ ] **Pre-record local backup of timestamp intelligence** ← critical insurance

---

### 15.4 Documented Prompts (Explainability Requirement)

**Bengali Translation Prompt**
```
You are a technical translator. Translate the following English educational text to Bengali.
Rules:
- Preserve ALL technical terms in English: [GLOSSARY]
- Translate only explanatory prose, not code, commands, or library names
- Keep sentence structure natural in Bengali
- Do not add or remove information
- Max 12 words per subtitle segment for readability

Text: {text}
```

**RAG Tutor Prompt**
```
You are a tutor for the course: {course_title}.
The learner is watching: {video_title}.

Use ONLY the following video transcript excerpts to answer the question.
Do not use outside knowledge.
If the answer is not in the excerpts, say: "I couldn't find this in the video."

Excerpts:
{retrieved_chunks}

Learner question: {question}
Language: {language}

Respond in {language}. End your response with:
Source: ~{timestamp} in this video
```

**Curriculum Agent Prompt**
```
You are a curriculum agent. Given the learner's mastery state and concept graph,
determine the next lesson sequence.

Learner mastery: {mastery_json}
Concept graph (current track): {graph_json}
Target track: {track_id}

Return JSON only:
{
  "next_lesson_id": "uuid",
  "skipped_concepts": ["id1","id2"],
  "injected_remedial": "lesson_id | null",
  "reasoning": "one sentence shown to learner"
}
```

**Multi-Level Explanation Prompt**
```
Explain the concept "{concept}" at the {level} level.
Levels:
  ELI5 — accessible to a 15-year-old, no prior knowledge, use everyday analogies
  Student — undergraduate level, assumes basic programming familiarity
  Practitioner — professional, include edge cases and best practices
  Researcher — domain expert, reference technical literature

Language: {language}
Max 200 words. Include one concrete code example.
```

**Assessment Rubric Prompt**
```
You are an assessment agent. Evaluate the submission against the rubric.

Submission: {submission_content}
Rubric: {rubric_json}

Return JSON only:
{
  "scores": {"criterion_id": score},
  "total": number,
  "max": number,
  "feedback": "constructive paragraph (200 words max)",
  "pass": boolean,
  "per_criterion": [{"criterion", "score", "note"}]
}
```

---

### 15.5 Architecture Diagram (submission visual)

Must show clearly:
- User → Next.js frontend (Vercel)
- Frontend → Supabase Auth
- Frontend → Next.js API Routes
- API Routes → MCP Agent layer (Curriculum, Tutor, Assessment, Job Market)
- Tutor Agent → pgvector similarity search (Supabase)
- Curriculum Agent → concept graph (PostgreSQL CTE)
- Assessment Agent → LLM (BYOA or platform fallback)
- Automation layer: YouTube Data API, Whisper, Judge0, Playwright
- Supabase Storage: certificates, VTT files, submissions

---

### 15.6 ARCHITECTURE.md (living dev file — maintain throughout)

```markdown
# Fixeth — Architecture

## System Layers
[4-layer diagram as in Section 2]

## Storage
- Supabase PostgreSQL: users, tracks, modules, lessons, enrollments, concept graph, mastery, quiz, submissions, certificates, job signals
- pgvector: transcript_chunks with 1536-dim embeddings
- Supabase Storage: VTT files, certificate PDFs, submission uploads, avatars

## Processing
- Transcript pipeline: YouTube ID → Whisper → sentence chunking → embedding → pgvector
- Subtitle pipeline: English captions → GPT-4o translation → quality score → VTT → Storage
- Concept graph: hand-curated nodes/edges seeded via migration scripts; recursive CTE traversal

## Agent Contracts
[Input/output schema for each MCP agent — copy from Section 10]

## Data Flow per Feature
[One paragraph per core feature: exact input → process → output]

## BYOA
- Keys stored in browser localStorage only
- Platform fallback: Gemini Flash, server-side, rate-limited 50 calls/day/user
- All AI calls made client-side to provider endpoint

## External Dependencies
- YouTube Data API v3 — 10,000 units/day quota
- OpenAI Whisper — ~$0.006/minute of audio
- Judge0 CE — hosted, 100 req/day free tier
- Playwright scraper — weekly cron, Bdjobs/Chakri/Indeed/LinkedIn
```

---

### 15.7 Data Strategy & Ethical Safeguards

**Data sources:**
| Source | Method | Data collected | Update frequency |
|--------|---------|---------------|-----------------|
| YouTube | YouTube Data API v3 (official) | Captions, video metadata | Per video, on-demand |
| Audio | OpenAI Whisper | Transcript text only | Per video, one-time |
| Job postings | Playwright scraper | Title, skills, salary — no PII | Weekly automated |
| Bdjobs / Chakri | Playwright | Same as above | Weekly |

**Privacy:**
- No learner PII beyond name, email, auth provider
- BYOA keys never touch Fixeth servers
- Quiz answers + progress stored by user ID — not linked to third parties
- Job scraping collects zero personal data
- Supabase RLS on all user-scoped tables

**AI transparency:**
- Adaptive path shows learner exactly which concepts were skipped and why (reasoning field)
- RAG answers always include source citation — learner can verify against video
- Assessment feedback is structured per rubric criterion — not a black-box score
- Learner can override adaptive path at any time

**Bias & validation:**
- Subtitle quality: ≥ 0.85 threshold before auto-publish; human review below threshold
- RAG: if no chunk ≥ 0.75 similarity, system acknowledges it can't find the answer
- Diagnostic: minimum 8 questions to avoid single-question misplacement
- Plagiarism: flagged for human review, never auto-penalised

---

### 15.8 Technical Components Checklist

**Must-have for submission:**
- [ ] Problem + user definition written
- [ ] AI-native approach documented (LLM + RAG + Graph + ML)
- [ ] System architecture diagram: input → AI → output
- [ ] Working prototype or demo recorded
- [ ] Bangla support demonstrated in demo video
- [ ] KPIs defined and stated
- [ ] All prompts written and documented (Section 15.4)
- [ ] Agent roles + contracts documented (Section 10 + 15.6)
- [ ] pgvector RAG pipeline documented (Section 15.8 below)
- [ ] Concept graph setup documented
- [ ] Model selection rationale documented (Section 12)
- [ ] Real-world data scraping documented (Section 15.7)
- [ ] Ethical safeguards documented (Section 15.7)
- [ ] Privacy + RLS documented
- [ ] ARCHITECTURE.md in repo
- [ ] Lovable used for UI prototyping — shown in video/screenshots
- [ ] Cursor / Claude Code in workflow — shown in video
- [ ] Supabase/pgvector as knowledge retrieval layer — in architecture diagram
- [ ] NRB/international collaboration documented if applicable

---

*Fixeth — শিখুন। প্রমাণ করুন। বাংলাদেশ গড়ুন।*
*Learn. Prove. Build Bangladesh.*
