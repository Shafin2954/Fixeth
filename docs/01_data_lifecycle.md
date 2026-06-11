# Project Information

### Project Name

**Fixeth – LMS**

### Elevator Pitch

Fixeth knows what you already know, teaches what you don't, and proves it to employers — in Bengali. Tech, agriculture, healthcare — every course built to move Bangladesh forward.

### Public Summary

Fixeth is a Bengali-first adaptive learning platform built for Bangladesh. From tech careers like data science and backend development, to precision agriculture, hydroponics, and community healthcare, Fixeth covers the skills that matter for Bangladesh's future.

The platform adapts to each learner. It tests what you know, skips what you've already mastered, and builds a personalized path from there. Lessons are built around curated YouTube content, delivered in Bengali, with an AI mentor available throughout.

When you finish, you get a verified profile with scores, projects, and certificates that employers and institutions can check directly.

Fixeth is free for foundational skills. Career tracks are priced for Bangladesh. No expensive subscriptions. No language barriers.

**Learn what matters. Prove what you know. Build Bangladesh.**

### Domain

**Education (EdTech)**

### Challenge

**Adaptive AI Tutor**

---

# Problem Statement

Bangladesh has a learning crisis that isn't caused by a lack of motivated learners. It's caused by a lack of effective learning pathways.

Most learners who want to build useful skills hit the same wall: the best educational content is in English. Understanding complex technical topics in a second language slows progress significantly. Bengali resources exist but tend to be outdated, poorly structured, and disconnected from what the job market actually wants.

This hits hardest for National University students, polytechnic graduates, unemployed graduates, career changers, school dropouts, and learners in rural and underprivileged communities. They are motivated. They just lack access to high-quality, relevant content in a language they can learn in.

Technical education adds another layer of friction. Setting up development environments, installing dependencies, and troubleshooting configuration issues can consume hours before any actual learning happens.

---

# Solution Description

Fixeth removes three barriers at once: language, setup friction, and content quality.

### Bengali-First Learning

Every lesson, explanation, and AI interaction is designed in Bengali from the start. It's not a translation layer on top of English content — Bengali is the primary medium.

### Industry-Relevant Curriculum

Fixeth tracks job market demand through weekly scraping of Bdjobs and Chakri, and updates learning paths accordingly. Courses focus on skills employers are actually hiring for.

### Browser-Based Environment

Jupyter notebooks, code editors, cloud environments, and interactive exercises all run in the browser. No installations, no configuration, no dependency management.

### Built for Underserved Learners

National University students, polytechnic graduates, career changers, dropouts, and unemployed youth are the primary audience, not afterthoughts.

### Project-Based Outcomes

Learners finish with real projects, verified portfolios, and demonstrable skills. The goal is industry readiness, not course completion.

### Beyond Tech

Fixeth also covers precision agriculture, hydroponics, community healthcare, videography, content creation, and other sectors relevant to Bangladesh's economy.

---

# Data Lifecycle & Engineering

## 1. Data Sources

### Selected Sources

* Internal application data
* External APIs
* Public web scraping
* Open datasets
* User uploads
* AI-generated metadata (summaries, topic labels)

### Specific Sources

* Platform user activity and learning analytics stored in Supabase PostgreSQL
* Job market signals scraped weekly from Bdjobs.com and Chakri.com via Playwright
* YouTube educational videos ingested via yt-dlp
* Whisper-generated transcripts with sentence-level timestamps
* User-uploaded documents, notebooks, and submissions stored in Supabase Storage
* Manually curated topic boundaries per lesson, stored in the `lesson_topics` table

---

## 2. Data Acquisition Methods

### Methods Used

* Web scraping (Playwright, handles JavaScript-heavy job boards)
* Speech-to-text processing (OpenAI Whisper, run locally via scripts)
* Bulk file uploads (user submissions, admin content)
* Automated workflows (pg_cron for job scraping, n8n for transcript pipelines)
* API integrations (YouTube Data API v3 for video metadata and captions)

### Scrapers and Crawlers

* Playwright scraper, scheduled via pg_cron every Monday at 09:00 BST, targeting Bdjobs.com and Chakri.com
* yt-dlp for audio extraction from YouTube videos
* Whisper (local, `scripts/process_video_free.py` and `process_video_openai.py`) for transcription

### Upload Pipeline

* User uploads (notebooks, submissions, avatars) stored in Supabase Storage under `notebooks/`, `submissions/`, and `avatars/` buckets
* Admin config and fallback markdown stored in the `admin_config` and `docs_content` tables in PostgreSQL

---

## 3. Parsing, Formats and Cleaning

### Supported Formats

* JSON, CSV, XLSX, PDF, Markdown, HTML
* Audio (MP3 for Whisper transcription)
* Video (via yt-dlp extraction)
* WebVTT (subtitle files, stored in the `vtt/` Supabase Storage bucket)

### Parsing Tools

* Whisper for speech-to-text with segment-level timestamps
* spaCy (`en_core_web_sm`) for sentence boundary detection during transcript chunking
* sentence-transformers (`all-MiniLM-L6-v2`, 384-dim) as a free local option; Ollama `nomic-embed-text` (768-dim) for production embeddings
* Zod for API request validation; Pydantic for Python script validation

### Data Processing

* Transcript chunking: 2-3 sentences per chunk with 2-sentence overlap for context continuity
* Topic-anchored grouping: chunks are assigned to `lesson_topics` rows by matching `start_time` within topic boundaries
* Deduplication: existing chunks for a lesson are deleted before re-ingestion (idempotent pipeline)
* Job signal aggregation: weekly mention counts compared to the prior week for trend detection

### Validation

* Zod (Next.js API routes)
* Pydantic (Python ingestion scripts)

---

## 4. Storage Architecture

### Relational Database

* Supabase PostgreSQL — all application data, user records, track and lesson metadata, job market signals, admin config, audit log

### Vector Database

* pgvector (Supabase extension) — 768-dimensional embeddings from Ollama `nomic-embed-text`, indexed with ivfflat using cosine ops (`lists = 100`)

### Object Storage

* Supabase Storage — audio files, subtitle VTT files, user submissions, avatars, certificates (post-launch)

### Cache Layer

* Upstash Redis — 5-minute in-memory cache for repeated `/api/chat` questions; rate limiting (30 requests/minute per IP)

### Table Summary

Key tables: `users`, `tracks`, `modules`, `lessons`, `lesson_topics`, `transcript_chunks`, `concepts`, `concept_edges`, `learner_mastery`, `adaptive_paths`, `enrollments`, `progress`, `quiz_items`, `quiz_results`, `submissions`, `job_market_signals`, `admin_config`, `admin_audit`, `docs_content`

---

## 5. Visualization and Analytics

### Tools Used

* React-based dashboards (Trending Skills card, adaptive path display)
* Tailwind CSS and shadcn/ui for data display components
* Custom progress tracking views (streak, lesson completion %, mastery scores)

### Frontend Stack

* Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui

### Analytics Capabilities

* Learner progress tracking (lesson completion %, quiz scores, streaks)
* Job market signal dashboard (top skills by mention count, week-on-week change)
* Admin audit log (last 100 actions, read-only)
* Adaptive path visualization (which concepts were skipped and why)

---

## 6. Insights, AI and Machine Learning

### AI Components

* Retrieval-Augmented Generation (RAG) over topic-segmented transcripts using pgvector cosine search
* Ollama `nomic-embed-text` (768-dim) for production embeddings; `all-MiniLM-L6-v2` (384-dim) as a free local alternative
* OpenAI Whisper (local) for one-time video transcription
* Topic-anchored retrieval: chunks grouped by `lesson_topics` boundaries, cosine threshold of 0.7

### Key AI Features

* Tutor Agent: grounded Q&A with clickable `[ts:MM:SS]` citations, no hallucination outside retrieved chunks
* Curriculum Agent: concept graph traversal (recursive CTE) to build adaptive paths with skip and remedial injection
* Assessment Agent: rubric-based grading with Bengali feedback output
* Platform-shared AI key: rotating Gemini 2.0 Flash key managed from `/admin`, retry-once on rate limit, soft-fail on exhaustion
* BYOA: user-pasted keys stored in `localStorage` only, never transmitted to the server

### Non-AI Analytics

* SQL aggregations for job signal trend detection
* Mastery score thresholds (skip at ≥80, remedial at <60) via deterministic rules
* KPI reporting from `progress`, `quiz_results`, and `enrollments` tables

---

## 7. Pipelines and Orchestration

### Orchestration Tools

* pg_cron — weekly job scraper (Mondays 09:00 BST), Supabase-native scheduling
* n8n — video ingestion, transcription, and embedding batch workflows (alternative to Python scripts)
* Supabase Triggers — event-driven enrollment and progress updates

### Scheduling

* Cron-based (pg_cron for DB-side jobs)
* Event-driven (Supabase triggers on lesson completion, quiz results)

### Real-Time Features

* Supabase Realtime for progress updates

---

## 8. Outbound APIs and Distribution

### API Layer

* Next.js API Routes (`app/api/*`) — all platform endpoints follow `{ data, error }` shape, Zod-validated

### Key Endpoints

* `POST /api/chat` — AI tutor with topic-anchored RAG
* `GET /api/adaptive-path` — concept graph traversal
* `PATCH /api/admin/keys` — AI key rotation
* `PUT /api/admin/docs/[slug]` — docs content update
* `GET /api/jobs` — top job market signals

### Deployment

* Vercel (frontend + API routes, auto-deployed on `git push` to `main`)

### Export Formats

* JSON (user data export, adaptive path, job signals)
* WebVTT (subtitles)

---

## 9. Open-Source Technology Stack

| Category | Tools |
| --- | --- |
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| Database | Supabase PostgreSQL, pgvector |
| Object Storage | Supabase Storage |
| Cache / Rate Limiting | Upstash Redis |
| Automation | n8n, pg_cron |
| Scraping | Playwright |
| Video Processing | yt-dlp |
| Speech-to-Text | OpenAI Whisper (local) |
| NLP / Chunking | spaCy |
| Embeddings | Ollama nomic-embed-text (768-dim), sentence-transformers (384-dim fallback) |
| Hosting | Vercel |

---

## 10. Quality, Governance and Observability

### Data Quality

* Row-Level Security (RLS) on all user-scoped tables (`users`, `enrollments`, `learner_mastery`, `progress`, `quiz_results`, `submissions`, `notebooks`, `adaptive_paths`)
* Idempotent ingestion: existing chunks deleted before re-insert
* Cosine similarity threshold (0.7) prevents weak matches from reaching the LLM
* Subtitle Quality Agent (post-launch): auto-publish at ≥0.85 composite score, human review queue below that

### Monitoring

* Vercel Analytics and Logs
* Supabase Monitoring dashboard
* `admin_audit` table (every admin action logged with timestamp, actor, details)

### Security

* RLS on all user-scoped tables
* Service role key used only server-side, never exposed to the client
* BYOA keys stored in `localStorage` only — never transmitted to Fixeth servers
* Admin API key stored in `admin_config` table, never returned to the client in any response
* `FIXETH_ADMIN_EMAILS` env var seeds initial admin list

### Cost Optimization

* Gemini 2.0 Flash (free tier) as platform default
* Ollama local embeddings (one-time per video, no recurring cost)
* 5-minute in-memory cache on `/api/chat` reduces repeat-question LLM calls by ~40%
* BYOA shifts AI cost to the user entirely when a personal key is provided
