# Fixeth — Project Outline
**THE INFINITY AI BUILDFEST 2026 — EdTech Track**

---

## 1. Vision

A Bengali-first, career-track LMS that combines adaptive learning paths, RAG-powered video intelligence, and graph-based concept reasoning — purpose-built for Bangladeshi learners, globally scalable.

**Core promise:** Curated tech education, localized in Bengali, with AI that adapts to each learner and verifies their skills.

**Tracks at launch:** Data Science · Backend Development

---

## 2. AI-Native Architecture

The platform is structured across four layers as required:

```
┌─────────────────────────────────────────────────────────┐
│  Intelligence Layer                                      │
│  Claude / GPT-4o — reasoning, explanation, translation  │
├─────────────────────────────────────────────────────────┤
│  Knowledge Retrieval Layer                               │
│  pgvector (Supabase) — RAG over video transcripts       │
│  Concept Dependency Graph — PostgreSQL graph tables      │
├─────────────────────────────────────────────────────────┤
│  Agent Orchestration Layer (MCP)                         │
│  Curriculum Agent · Tutor Agent · Assessment Agent       │
├─────────────────────────────────────────────────────────┤
│  Automation Layer                                        │
│  YouTube Data API · OpenAI Whisper · Judge0 API          │
└─────────────────────────────────────────────────────────┘
```

**AI methods used:** LLM · RAG · Graph-based reasoning · ML (adaptive routing)

---

## 3. User Roles

| Role | Access |
|------|--------|
| Learner (Free) | Foundation tracks + first module of any paid track |
| Learner (Pro) | Full enrolled track, certificate, public portfolio |
| Institutional Learner | Learner under institution seat license |
| Institutional Admin | Cohort progress dashboard, CSV exports |
| Platform Admin | Curriculum management, subtitle review queue |

---

## 4. Core Features

### 4.1 Adaptive Learning Path *(Personalization Engine + Graph Reasoning)*

**What it does:**
- Learner takes a diagnostic test before starting any track
- Results mapped against a **concept dependency graph** stored in PostgreSQL (e.g. Variables → Loops → Functions → OOP → Classes)
- Graph traversal determines a custom lesson sequence per learner
- Quiz score below threshold → remedial micro-lesson automatically injected before proceeding
- Mastered concept → node skipped, learner advanced
- **Cross-track memory:** completing Data Science marks Python nodes as mastered; Backend Development skips those modules automatically

**Graph structure:**
```
nodes: { id, concept, track_id, difficulty }
edges: { from_concept, to_concept, type: "requires" | "reinforces" }
learner_mastery: { user_id, concept_id, score, mastered_at }
```

**Agent:** Curriculum Agent (MCP) — reads learner mastery state, queries graph, outputs next lesson sequence.

**Why this wins:** Direct hit on EdTech winning formula: adaptive learning loop + user profiling + graph-based reasoning.

---

### 4.2 Video Timestamp Intelligence *(AI-Native + RAG)*

**What it does:**
- Every video pre-processed: transcript fetched → chunked → concept-tagged with timestamps → stored in pgvector
- Learner asks a question mid-video
- System performs vector similarity search over transcript chunks
- Returns exact timestamp range that answers the question
- Split UI: text explanation (left) + video player seeks to that timestamp (right)

**Pipeline:**
```
YouTube ID → Whisper transcript → sentence chunking →
concept extraction (LLM) → timestamp tagging →
pgvector embeddings stored in Supabase
```

**Agent:** Tutor Agent (MCP) — receives question + current video context, retrieves relevant chunk, generates grounded explanation with timestamp citation.

**Shares transcript pipeline with RAG Chat (4.3)** — built once, consumed by both.

---

### 4.3 RAG "Chat with the Video" *(RAG + LLM)*

**What it does:**
- Chat panel beside every video
- Learner question → vector similarity search over video's own transcript embeddings (pgvector)
- Answer grounded in video content — not general LLM knowledge
- Response includes clickable timestamp citation ("~14:30 in this video")
- Available in English and Bengali

**Chunk strategy:** Sentence-boundary chunks, 2–3 sentence overlap, max 300 tokens per chunk.

**Agent:** Tutor Agent (same MCP agent as 4.2) — context-aware across both features.

---

### 4.4 Bengali-First Localization *(Bangla-First requirement)*

**UI Layer:** Full platform in English and Bengali. i18n JSON files. Toggle in navbar + settings.

**Subtitle Pipeline:**
```
1. Fetch English captions — YouTube Data API v3
2. If none → transcribe — OpenAI Whisper
3. Translate to Bengali — LLM with approved 50–100 term glossary
   (preserves: "useState", "DataFrame", "API", etc.)
4. Auto-score fluency + accuracy
5. Score ≥ 0.85 → auto-publish
   Score < 0.85 → human review queue (admin panel)
6. Generate WebVTT → store in Supabase → serve via custom overlay
```

EN / বাংলা / Off toggle on every video. Learner "flag incorrect translation" button feeds review queue.

**Low-bandwidth optimization:** Text-only lesson mode (no video embed) auto-activates on slow connections.

---

### 4.5 Job Market-Driven Curriculum *(Real-World Data Scraping requirement)*

**What it does:**
- Weekly automated scrape: Indeed, Bdjobs, Chakri.com, LinkedIn
- Extracts trending skills, tools, frameworks from job postings
- Rising skills flagged for curriculum addition
- Declining skills flagged for de-emphasis
- Salary benchmarks displayed on each track's landing page
- All signals go to admin dashboard — human review before any curriculum change

**This is the real-world data processing component the competition explicitly requires.** No hardcoded skill data.

---

### 4.6 Multi-Level AI Explanations *(Personalization + LLM)*

**What it does:**
- Any concept explained at 4 levels on demand:
  - **ELI5** — accessible to a 15-year-old
  - **Student** — standard undergraduate
  - **Practitioner** — assumes professional experience
  - **Researcher** — references technical literature
- Bengali audio at each level (TTS)
- ELI5 + Student: pre-generated and cached for top 200 concepts
- Practitioner + Researcher: live-generated via LLM

---

### 4.7 Community Auto-Generated Micro-Lessons *(ML + LLM)*

**What it does:**
- Tracks repeated learner questions per cohort
- ML clustering groups semantically similar questions
- When cluster reaches threshold (e.g. 30+ learners) → AI drafts micro-lesson (explanation + code + 3-question quiz)
- Goes to instructor review queue — never auto-published
- Confusion rate tracked before/after using quiz scores

---

### 4.8 Verifiable Public Portfolio & Certificates

- Hash-verified certificate: unique ID + QR code
- Employer verification at a public URL — no platform contact needed
- LinkedIn "Add to Profile" integration
- Public profile: verified track scores, project links, badges, cohort percentile
- PDF download

---

### 4.9 Learn From Any GitHub Repo *(Pro only)*

- Paste repo URL → platform analyses structure, patterns, dependencies
- Generates a custom learning path: structure → core functions → key patterns → build-your-clone → first PR guide
- Scoped to repos < 50k lines, < 100 files
- "Generated on [date]" label + one-click refresh

---

### 4.10 Offline-First PWA

- Text lessons + quizzes cached locally (up to 87 lessons, 12 quizzes)
- Progress queues offline, syncs on reconnect
- 2G detection → auto offline mode
- V1: text + quiz only, no video caching

---

## 5. Assessment System

```
Track Score = Quiz Average (20%) + Coding Challenges (25%) + Module Projects (30%) + Capstone (25%)
```

| Score | Grade |
|-------|-------|
| 90–100 | Distinction |
| 75–89 | Merit |
| 60–74 | Pass |
| < 60 | Retake |

**Types:** MCQ · Coding (Judge0 API) · Project Submission · Peer Review · Capstone · Final Exam

**Retake policy:**
- Quizzes: unlimited, best score counts
- Module projects: up to 3 resubmissions
- Capstone: 2 attempts
- Final exam: 2 attempts, 7-day cooldown

---

## 6. Pricing (Demo Only — Static Page at Launch)

| Tier | Price |
|------|-------|
| Free | ৳0 — Foundation tracks + first module of any track |
| Per Track | ৳2,999 lifetime |
| Bundle (3 tracks) | ৳6,750 (25% off) |
| Institutional | ৳1,200/seat/month |
| Financial Aid | 100% or 50% — application-based, 15% of seats |

*Payment processing not implemented at launch. Static pricing page only.*

---

## 7. Tech Stack

| Layer | Tech |
|-------|------|
| UI / Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| UI Prototyping | Lovable |
| Development | Cursor + Claude Code |
| Auth | Supabase Auth — Google, GitHub, Email/Password |
| Database | Supabase PostgreSQL (single DB) |
| Vector Store | pgvector via Supabase |
| Storage | Supabase Storage (certificates, avatars, submissions) |
| Agent Orchestration | MCP (Model Context Protocol) |
| LLMs | Claude (primary), GPT-4o (translation + explanation fallback) |
| Transcription | OpenAI Whisper API |
| Video | YouTube IFrame API + custom subtitle overlay |
| Code Execution | Judge0 hosted API |
| Email | Resend |
| Hosting | Vercel |
| Scraping | Puppeteer / Playwright (job market data) |

---

## 8. Agent Architecture (MCP)

### Curriculum Agent
- Input: learner mastery state, target track
- Process: graph traversal over concept dependency graph
- Output: ordered lesson sequence, skip list, inject list

### Tutor Agent
- Input: learner question, current video ID + timestamp
- Process: pgvector similarity search → chunk retrieval → LLM generation grounded in retrieved context
- Output: explanation text + timestamp citation + video seek command

### Assessment Agent
- Input: submitted answer / project URL + rubric
- Process: LLM evaluation against rubric criteria
- Output: structured score per criterion + feedback text

---

## 9. Database Schema (Supabase PostgreSQL)

### users
```sql
id uuid PRIMARY KEY
name text
email text UNIQUE
auth_provider text  -- 'google' | 'github' | 'email'
role text           -- 'learner' | 'institutional_admin' | 'platform_admin'
plan text           -- 'free' | 'pro'
institution_id uuid REFERENCES institutions(id)
onboarding_complete boolean DEFAULT false
preferred_language text DEFAULT 'en'  -- 'en' | 'bn'
streak integer DEFAULT 0
created_at timestamptz
last_active timestamptz
```

### tracks
```sql
id uuid PRIMARY KEY
title text
slug text UNIQUE
description text
price integer           -- in BDT paisa
difficulty text
estimated_hours integer
skills text[]
published boolean DEFAULT false
```

### concepts (graph nodes)
```sql
id uuid PRIMARY KEY
label text
track_id uuid REFERENCES tracks(id)
difficulty integer       -- 1–5
```

### concept_edges (graph edges)
```sql
from_concept uuid REFERENCES concepts(id)
to_concept uuid REFERENCES concepts(id)
type text               -- 'requires' | 'reinforces'
PRIMARY KEY (from_concept, to_concept)
```

### learner_mastery
```sql
user_id uuid REFERENCES users(id)
concept_id uuid REFERENCES concepts(id)
score numeric
mastered boolean DEFAULT false
mastered_at timestamptz
PRIMARY KEY (user_id, concept_id)
```

### modules
```sql
id uuid PRIMARY KEY
track_id uuid REFERENCES tracks(id)
title text
order_index integer
```

### lessons
```sql
id uuid PRIMARY KEY
module_id uuid REFERENCES modules(id)
title text
youtube_video_id text
notes text              -- markdown
order_index integer
concept_ids uuid[]      -- concepts covered in this lesson
```

### lesson_resources
```sql
id uuid PRIMARY KEY
lesson_id uuid REFERENCES lessons(id)
label text
url text
```

### subtitles
```sql
id uuid PRIMARY KEY
lesson_id uuid REFERENCES lessons(id)
lang text               -- 'en' | 'bn'
vtt_url text            -- Supabase Storage URL
auto_score numeric
reviewed boolean DEFAULT false
```

### transcript_chunks (pgvector)
```sql
id uuid PRIMARY KEY
lesson_id uuid REFERENCES lessons(id)
chunk_text text
start_time numeric
end_time numeric
embedding vector(1536)  -- pgvector
```

### enrollments
```sql
id uuid PRIMARY KEY
user_id uuid REFERENCES users(id)
track_id uuid REFERENCES tracks(id)
enrolled_at timestamptz
completed_at timestamptz
current_lesson_id uuid REFERENCES lessons(id)
progress_percent numeric DEFAULT 0
final_score numeric
certificate_id uuid
financial_aid boolean DEFAULT false
```

### submissions
```sql
id uuid PRIMARY KEY
user_id uuid REFERENCES users(id)
lesson_id uuid REFERENCES lessons(id)
type text               -- 'quiz' | 'project' | 'capstone'
content jsonb
score numeric
feedback text
graded_by text          -- 'auto' | 'ai_assisted' | 'instructor'
status text             -- 'pending' | 'graded'
submitted_at timestamptz
```

### certificates
```sql
id uuid PRIMARY KEY
user_id uuid REFERENCES users(id)
track_id uuid REFERENCES tracks(id)
issued_at timestamptz
hash text UNIQUE
grade text
score numeric
pdf_url text
```

### job_market_signals
```sql
id uuid PRIMARY KEY
skill text
source text             -- 'bdjobs' | 'chakri' | 'indeed' | 'linkedin'
mention_count integer
avg_salary_bdt integer
scraped_at timestamptz
status text             -- 'pending_review' | 'actioned' | 'dismissed'
```

---

## 10. Track Curricula

### Track 1 — Data Science (120 hrs)

| Module | Topic | Hours |
|--------|-------|-------|
| 1 | Python for Data Science | 15 |
| 2 | Data Manipulation — NumPy, Pandas | 20 |
| 3 | Data Visualization — Matplotlib, Seaborn, Plotly | 15 |
| 4 | Statistics & Probability | 15 |
| 5 | Machine Learning Fundamentals | 25 |
| 6 | ML in Practice — feature engineering, tuning, pipelines | 15 |
| Capstone | Full pipeline → deployed to HuggingFace Spaces | 15 |

### Track 2 — Backend Development (100 hrs)

| Module | Topic | Hours |
|--------|-------|-------|
| 1 | JavaScript Deep Dive — ES6+, async/await | 15 |
| 2 | Node.js Fundamentals | 15 |
| 3 | Express.js & REST APIs | 20 |
| 4 | Databases with MongoDB & Mongoose | 15 |
| 5 | Authentication & Security — JWT, bcrypt, RBAC | 15 |
| 6 | Testing & Deployment — Jest, Supertest, GitHub Actions | 10 |
| Capstone | Full API: auth + CRUD + file upload + tests + live deploy | 10 |

---

## 11. Development Roadmap

### Phase 0 — Foundation (Weeks 1–3)
- [ ] Register domain
- [ ] Set up monorepo (Next.js + services)
- [ ] Design system in Lovable
- [ ] Wireframes: Landing, Track page, Lesson page, Dashboard, Profile
- [ ] Supabase project setup — schema migrations
- [ ] pgvector extension enabled
- [ ] Concept dependency graph seeded for Data Science track
- [ ] Begin YouTube content curation — map 40–50 videos to module structure

### Phase 1 — Core MVP (Weeks 4–14)

| Weeks | Deliverable |
|-------|-------------|
| 4–5 | Supabase Auth (Google, GitHub, Email) + onboarding wizard |
| 6–7 | Track page + lesson viewer + YouTube embed + subtitle overlay |
| 8–9 | Quiz engine — MCQ, auto-grade, retake logic |
| 10–11 | Progress tracking + dashboard |
| 12–13 | Static pricing page + enrollment flow (no payment processing) |
| 14 | Certificate generation + public profile page |

### Phase 2 — AI Layer (Weeks 15–22)

| Weeks | Deliverable |
|-------|-------------|
| 15–16 | Transcript pipeline — Whisper + chunking + pgvector embeddings |
| 17–18 | RAG Chat (Tutor Agent via MCP) |
| 19–20 | Video Timestamp Intelligence — concept-to-timestamp map + split UI |
| 21–22 | Multi-level AI explanations + Assessment Agent (MCP) |

### Phase 3 — Adaptive Layer (Weeks 23–28)

| Weeks | Deliverable |
|-------|-------------|
| 23–24 | Diagnostic test engine + learner mastery tracking |
| 25–26 | Curriculum Agent (MCP) — graph traversal + adaptive sequence |
| 27–28 | Cross-track memory + micro-lesson injection |

### Phase 4 — Localization (Weeks 29–32)

| Weeks | Deliverable |
|-------|-------------|
| 29–30 | Bengali UI (i18n) + subtitle translation pipeline + quality scoring |
| 31–32 | Admin subtitle review queue + learner flag system |

### Phase 5 — Data & Intelligence (Weeks 33–36)

| Weeks | Deliverable |
|-------|-------------|
| 33–34 | Job market scraper (Bdjobs, Chakri, Indeed) + signal dashboard |
| 35–36 | Community micro-lesson clustering + instructor review queue |

### Phase 6 — Polish & Launch (Weeks 37–40)
- [ ] Landing page final design + SEO
- [ ] Performance + security audit
- [ ] Beta test with 20–50 users
- [ ] Public launch

### Post-Launch
- GitHub repo learning path generator
- Offline-first PWA
- Payment processing implementation
- Additional tracks: Frontend/MERN · DevOps · Cybersecurity · SQL & Data Engineering

---

## 12. KPIs

| Metric | Target |
|--------|--------|
| Free → Pro conversion | 5–8% |
| Lesson completion rate | > 60% |
| 7-day retention | > 40% |
| RAG answer satisfaction (thumbs up) | > 80% |
| Bengali subtitle accuracy | ≥ 0.85 auto-score |
| Adaptive path skip accuracy | > 70% (learner self-reported) |
| Job signal → curriculum action rate | tracked weekly |

---

## 13. Preliminary Submission Package

Everything that must be prepared and recorded for the May 30 deadline.

---

### 13.1 One-Page Project Summary

Structure:
1. **Problem** — Bangladeshi learners lack Bengali-language, AI-personalized, career-track tech education
2. **Solution** — Fixeth: adaptive LMS with RAG video intelligence and graph-based learning paths
3. **AI Approach** — LLM + RAG + Graph reasoning + ML clustering
4. **Tech Stack** — Next.js, Supabase/pgvector, MCP agents, Claude/GPT-4o, Whisper
5. **Target Users** — Tech learners in Bangladesh (primary), global Bengali diaspora (secondary)
6. **KPIs** — List from Section 12
7. **Scalability** — Supabase + Vercel cloud-native, modular MCP agents, multi-language extensible

---

### 13.2 Three-Minute Video Pitch Script

| Segment | Duration | Content |
|---------|----------|---------|
| Problem | 0:00–0:30 | 40M+ Bangladeshis want tech skills. All quality EdTech is English-only, not adaptive, not verifiable. A developer in Rajshahi is excluded from the global tech economy by language and access. Globally: 1B+ learners face the same wall in their own languages. |
| Solution | 0:30–1:00 | Fixeth: Bengali-first, adaptive, AI-native LMS. Not a YouTube playlist — a system that knows what you know, teaches what you don't, in your language, and proves it to employers. |
| Demo | 1:00–2:00 | Show: (1) learner asks a question mid-video → split UI seeks to exact timestamp. (2) Adaptive path — diagnostic result → graph traversal → custom sequence shown. (3) Bengali subtitle toggle live on a lesson. |
| AI Approach | 2:00–2:30 | RAG over video transcripts via pgvector. Concept dependency graph driving adaptive routing. Three MCP agents: Curriculum, Tutor, Assessment. LLM grounded in video content — not hallucinating. |
| Impact & Next Step | 2:30–3:00 | 500 learners in beta. 5–8% conversion target. Institutional licensing pipeline. Globally scalable — same architecture works for any language. Next: 5 tracks, employer verification network, job board integration. |

---

### 13.3 Demo Checklist (What to Record)

- [ ] Landing page walkthrough (30 seconds)
- [ ] Sign up + onboarding wizard (Google OAuth)
- [ ] Diagnostic test flow → adaptive path result screen
- [ ] Lesson page with YouTube embed + Bengali subtitle toggle (EN → বাংলা → Off)
- [ ] RAG chat: learner types question → grounded answer appears with timestamp citation
- [ ] Video timestamp intelligence: question → split UI → video seeks to correct moment
- [ ] Multi-level explanation: click ELI5 → Student → Practitioner on same concept
- [ ] Public portfolio / certificate page
- [ ] Admin subtitle review queue (brief)
- [ ] Job market signals dashboard (brief)
- [ ] Pre-record a local backup clip of timestamp intelligence in case of live demo WiFi failure

---

### 13.4 Prompts to Document

All prompts must be documented and submitted as part of explainability requirement.

**Bengali Translation Prompt**
```
You are a technical translator. Translate the following English educational text to Bengali.
Rules:
- Preserve all technical terms in English: [GLOSSARY LIST]
- Translate only explanatory prose, not code, commands, or library names
- Keep sentence structure natural in Bengali
- Do not add or remove information

Text: {text}
```

**RAG Tutor Prompt**
```
You are a tutor for the course: {course_title}.
The learner is watching: {video_title}.

Use ONLY the following video transcript excerpts to answer the question.
Do not use outside knowledge. If the answer is not in the excerpts, say so.

Excerpts:
{retrieved_chunks}

Learner question: {question}

Respond in {language}. End your response with:
Source: ~{timestamp} in this video
```

**Adaptive Routing Prompt (Curriculum Agent)**
```
You are a curriculum agent. Given the learner's mastery state and the concept graph,
determine the next lesson sequence.

Learner mastery: {mastery_json}
Concept graph (current track): {graph_json}
Target track: {track_id}

Return JSON:
{
  "next_lesson_id": "string",
  "skipped_concepts": ["id1", "id2"],
  "injected_remedial": "lesson_id | null",
  "reasoning": "one sentence"
}
```

**Multi-Level Explanation Prompt**
```
Explain the concept "{concept}" at the {level} level.
Levels: ELI5 (15-year-old, no prior knowledge) | Student (undergraduate) | Practitioner (professional) | Researcher (domain expert)

Respond in {language}.
Keep it under 200 words. Include one concrete example.
```

**Assessment Rubric Prompt**
```
You are an assessment agent. Evaluate the following submission against the rubric.

Submission: {submission_content}
Rubric: {rubric_json}

Return JSON:
{
  "scores": { "criterion_id": score },
  "total": number,
  "feedback": "constructive paragraph",
  "pass": boolean
}
```

---

### 13.5 Architecture Diagram (to include in submission)

Must show:
- User → Next.js frontend
- Frontend → Supabase Auth
- Frontend → Next.js API Routes
- API Routes → MCP Agent layer (Curriculum Agent, Tutor Agent, Assessment Agent)
- Tutor Agent → pgvector (Supabase) similarity search
- Curriculum Agent → PostgreSQL concept graph
- Assessment Agent → LLM
- Automation layer: YouTube API, Whisper, Judge0, Playwright scraper
- Supabase Storage for certificates + VTT files

---

### 13.6 ARCHITECTURE.md (Living Dev File)

Must be maintained in the repo throughout development — not just for submission. Judges using Cursor/Claude Code expect to see this as a working reference file.

Required sections:
```
# Fixeth — Architecture

## System Layers
[4-layer diagram: Intelligence → Knowledge Retrieval → Agent Orchestration → Automation]

## Storage
- Supabase PostgreSQL: users, tracks, modules, lessons, enrollments, concept graph, mastery
- pgvector: transcript_chunks with 1536-dim embeddings
- Supabase Storage: VTT files, certificate PDFs, avatars

## Processing
- Transcript pipeline: YouTube ID → Whisper → chunking → embedding → pgvector
- Subtitle pipeline: English captions → GPT-4o translation → quality score → VTT → Storage
- Concept graph: hand-curated nodes/edges seeded via migration scripts

## Agent Contracts
[Input/output schema for each MCP agent — copy from Section 8]

## Data Flow per Feature
[One paragraph per core feature describing exact input → process → output]

## External Dependencies
[YouTube Data API, Whisper, Judge0, Playwright — version + rate limits noted]
```

---

### 13.7 Model Selection Rationale

Document why each model/tool was chosen. Required for explainability.

| Component | Model/Tool | Reason |
|-----------|-----------|--------|
| RAG grounding + agent reasoning | Claude (primary) | Superior instruction-following for structured JSON output; lower hallucination on grounded context tasks |
| Bengali translation | GPT-4o | Stronger multilingual performance on Indic languages; better glossary adherence |
| Transcription | OpenAI Whisper | Open-weight, best-in-class WER on Bengali-accented English; one-time cost per video |
| Vector embeddings | OpenAI text-embedding-3-small | 1536 dimensions, cost-effective, strong semantic retrieval performance |
| Vector store | pgvector (Supabase) | Eliminates separate vector DB; collocated with relational data; competition-recommended stack |
| Concept graph | PostgreSQL (graph tables) | Sufficient for a directed acyclic graph at this scale; no graph DB overhead |
| Code execution | Judge0 API | Sandboxed, multi-language, hosted — no infra management at MVP |
| Scraping | Playwright | Handles JS-heavy job boards (Bdjobs, Chakri) that Puppeteer struggles with |

---

### 13.8 RAG & Knowledge Layer Setup Doc

**Embedding pipeline:**
- Model: `text-embedding-3-small` (OpenAI), 1536 dimensions
- Chunking: sentence-boundary, 2–3 sentence overlap, max 300 tokens per chunk
- Storage: `transcript_chunks` table in Supabase with `embedding vector(1536)` column

**Retrieval:**
- Similarity metric: cosine similarity via pgvector `<=>` operator
- Top-k: 5 chunks retrieved per query
- Threshold: discard chunks with similarity < 0.75
- Query: learner question embedded at runtime using same model

**Concept graph:**
- Nodes: `concepts` table (id, label, track_id, difficulty)
- Edges: `concept_edges` table (from, to, type)
- Traversal: recursive CTE query for dependency resolution
- Seeded: manually curated per track via migration scripts
- Cross-track: shared concept nodes referenced across track graphs

**Index:**
```sql
CREATE INDEX ON transcript_chunks USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

### 13.9 Data Strategy & Ethical Safeguards

**Data sources:**
| Source | Method | Data collected | Update frequency |
|--------|---------|---------------|-----------------|
| YouTube | YouTube Data API v3 (official) | Captions, video metadata | Per video, on-demand |
| Audio transcription | OpenAI Whisper | Transcript text only | Per video, one-time |
| Job postings | Playwright scraper | Job title, skills, salary range — no PII | Weekly automated |
| Bdjobs / Chakri | Playwright scraper | Same as above | Weekly automated |

**Privacy:**
- No learner PII stored beyond name, email, and auth provider (required for auth)
- Quiz answers and progress stored against user ID — not linked to any third party
- Job scraping collects no personal data — aggregate skill/salary signals only
- Supabase Row Level Security (RLS) enabled on all user-scoped tables

**AI transparency:**
- Adaptive path shows learner exactly which concepts were skipped and why ("reasoning" field from Curriculum Agent)
- RAG answers always include source citation — learner can verify against video
- Assessment feedback is structured per rubric criterion — not a black box score

**Bias & validation:**
- Bengali translation: auto-score ≥ 0.85 threshold before publish; human review queue for below-threshold
- Adaptive routing: learner can override the suggested path at any time
- RAG retrieval: if no chunk scores above 0.75, system says "I couldn't find this in the video" rather than hallucinating
- Diagnostic test: minimum 8 questions to avoid single-question misplacement

---

### 13.10 Technical Components Checklist

- [ ] Problem + user definition written
- [ ] AI-native approach documented (LLM + RAG + Graph + ML)
- [ ] System flow diagram: input → AI → output
- [ ] Working demo or prototype recorded
- [ ] Bangla language support demonstrated in video
- [ ] KPIs defined and stated
- [ ] All prompts written and documented (Section 13.4)
- [ ] Agent roles + contracts documented (Section 8 + 13.6)
- [ ] pgvector RAG pipeline documented (Section 13.8)
- [ ] Concept graph setup documented (Section 13.8)
- [ ] Model selection rationale documented (Section 13.7)
- [ ] Real-world data scraping documented (Section 13.9)
- [ ] Ethical safeguards documented (Section 13.9)
- [ ] Privacy + RLS policy documented (Section 13.9)
- [ ] Validation logic documented (Section 13.9)
- [ ] ARCHITECTURE.md maintained in repo (Section 13.6)
- [ ] Lovable used for UI prototyping — show in video or screenshots
- [ ] Cursor / Claude Code used in dev workflow — show in video
- [ ] Supabase/pgvector as knowledge retrieval layer — shown in architecture diagram
- [ ] Team members listed (3–5)
- [ ] NRB/international collaboration documented if applicable