# Build Provenance

## Transparency and Auditability

### Data Sources

#### Primary Database

Supabase PostgreSQL is the single source of truth for all application data: users, tracks, modules, lessons, lesson topics, transcript chunks, embeddings, learner progress, quiz results, assessments, job market signals, admin config, and the audit log.

pgvector (Supabase extension) handles vector storage for semantic retrieval. The `transcript_chunks` table stores 768-dimensional embeddings indexed with ivfflat (cosine ops, `lists = 100`).

#### Educational Content Sources

* YouTube videos ingested via yt-dlp (audio extraction for transcription)
* Video captions from the YouTube Data API v3 (when available)
* Whisper-generated transcriptions with segment-level timestamps (run locally via `scripts/process_video_free.py` or the OpenAI Whisper API)
* Manually curated topic boundaries per lesson, stored in the `lesson_topics` table with start/end timestamps and optional concept mappings

#### Job Market Intelligence

* Playwright scraper targeting Bdjobs.com and Chakri.com, scheduled weekly via pg_cron (Mondays 09:00 BST)
* Collects job titles, skill mentions, salary ranges (when listed), and posting dates — no applicant PII
* Results stored in `job_market_signals` with week-on-week change tracking
* Rising skills (>15% WoW) and declining skills (<-15% WoW) are flagged for admin review before any curriculum change

#### User-Generated Data

* Course submissions, notebooks, and uploaded assignments stored in Supabase Storage under `submissions/` and `notebooks/`
* Learning activity, quiz results, and mastery scores stored in PostgreSQL with Row-Level Security
* User avatars in the `avatars/` bucket

#### Admin-Managed Configuration

* AI fallback keys stored in the `admin_config` table (server-side only, never exposed to the client)
* Docs content (markdown pages) stored in the `docs_content` table, editable from `/admin` without redeployment
* Every admin action appended to `admin_audit` with timestamp, actor email, action, and details

---

### AI Models Used

#### Gemini 2.0 Flash (Platform Default)

The primary AI model for all platform features. Managed as a rotating key in the `admin_config` table — admins can add up to 4 key slots and rotate them from the `/admin` page without touching environment variables or redeploying.

Used for: Tutor Agent responses, Bengali subtitle translation, Assessment Agent grading, Curriculum Agent path generation.

On rate-limit error: retry once with the next available key slot. On full exhaustion: soft-fail with a message prompting the user to add their own key.

#### BYOA Providers (User-Supplied Keys)

OpenAI, Anthropic Claude, Gemini, Groq, and Ollama (local). Users paste their key in profile settings. It is stored in browser `localStorage` only and never transmitted to Fixeth servers. When present, the client calls the LLM provider directly, removing all AI cost from the platform.

#### OpenAI Whisper (Local Transcription)

Run once per video during ingestion. Produces segment-level timestamps used to align transcript chunks with `lesson_topics` boundaries. The `base` model is the default; the OpenAI Whisper API is an alternative for faster processing at ~$0.006/minute.

#### Ollama — nomic-embed-text (Production Embeddings)

768-dimensional embeddings for all transcript chunks, generated once during ingestion and stored in pgvector. Used at query time to embed user questions for cosine similarity search. Runs locally, no per-call API cost.

#### sentence-transformers — all-MiniLM-L6-v2 (Free Fallback)

384-dimensional embeddings. Available as a zero-cost local alternative during development. Requires the `transcript_chunks.embedding` column to be set to `VECTOR(384)`.

---

### Responsible AI, Provenance and Safety

#### Hallucination Prevention

RAG grounding is the core safeguard. The Tutor Agent's system prompt explicitly says: "Use ONLY the provided topic sections to answer the question. Do not use outside knowledge." The retrieval threshold is 0.7 cosine similarity — below it, the system says "I couldn't find this in the video" rather than guessing.

Every AI response cites the exact `[ts:MM:SS]` marker from the source chunk. Users can click the timestamp to verify the answer against the original video.

#### Input Validation

* Zod schemas on all Next.js API routes (`/api/chat`, `/api/admin/*`, `/api/profile/*`)
* Pydantic validation in Python ingestion scripts

#### Access Control

* Row-Level Security on all user-scoped tables (`users`, `enrollments`, `learner_mastery`, `progress`, `quiz_results`, `submissions`, `notebooks`, `adaptive_paths`)
* `users.role = 'platform_admin'` check in `app/admin/layout.tsx` for all admin routes
* Supabase service role key used only server-side
* `FIXETH_ADMIN_EMAILS` env var seeds the initial admin list

#### Abuse Prevention

* Upstash Redis rate limiting: 30 `/api/chat` requests per minute per IP
* 5-minute in-memory cache on `/api/chat` for repeated questions

#### Privacy

* Minimal PII collection: email, name (from OAuth), language preference, theme, goal, experience level
* No phone numbers, no government ID, no financial data, no device fingerprinting
* BYOA keys in `localStorage` only — never on the server
* Platform AI keys in `admin_config` — never returned to the client
* Chat history is transient (not persisted beyond 24 hours)
* Account deletion cascades to all user-scoped tables; Supabase backup retention is the only remaining window (up to 30 days)

#### Auditability

* All production prompts documented in `docs/PROMPTS.md` with version history (10 prompts as of v2.0)
* Every admin action logged in `admin_audit` (read-only for non-admins, 1-year retention)
* Agent input/output contracts documented in `docs/ARCHITECTURE.md` §5
* Model choices documented in `docs/ARCHITECTURE.md` §7

---

# Tooling and IDE

### Development Environment

* **IDE:** Cursor with Claude Code integration
* **Deployment:** Vercel (auto-deploy on push to `main`; preview URLs for feature branches)

### Frameworks and Libraries

#### Frontend

* Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui

#### Backend and Data

* Supabase (PostgreSQL + pgvector + Storage + Auth + Realtime)
* Upstash Redis (caching, rate limiting)

#### Automation and Processing

* n8n (video ingestion and embedding batch workflows)
* Playwright (job market scraping)
* pg_cron (Supabase-native scheduling for weekly scraper)

#### AI and NLP

* OpenAI Whisper (local transcription)
* spaCy `en_core_web_sm` (sentence boundary detection)
* Ollama nomic-embed-text (production embeddings)
* sentence-transformers (free fallback embeddings)

---

### Context and Specification Files

* `docs/PROMPTS.md` — Central prompt registry with version history (10 prompts as of v2.0)
* `docs/ARCHITECTURE.md` — System architecture, agent contracts, API shapes, failure modes
* `docs/PRD.md` — Product requirements, feature scope, rubric coverage map
* `docs/DATA_STRATEGY.md` — Data sources, PII policy, retention rules, compliance
* `docs/ETHICS.md` — Hallucination safeguards, bias mitigations, transparency mechanisms
* `docs/SCALABILITY_ROADMAP.md` — 12-month growth plan, technical scaling thresholds, unit economics
* `AGENTS.md` — Agent contract standards
* `metaprompt.md` — Master build prompt

---

# Prompt Library

### Documented Prompts (v2.0)

Ten production prompts are documented and version-controlled in `docs/PROMPTS.md`:

| ID | Name | Used By |
| --- | --- | --- |
| `tutor_system_v2` | Tutor Agent System Prompt | `/api/chat`, GuidedVideo chat tab |
| `tutor_system_v1.1` | Tutor Agent v1.1 (archived) | Retained for audit |
| `assessment_system_v2` | Assessment Agent System Prompt | `/api/assessment`, Submissions screen |
| `subtitle_quality_v2` | Subtitle Quality Agent Prompt | Subtitle translation pipeline |
| `curriculum_agent_v2` | Curriculum Agent Prompt | `/api/adaptive-path` |
| `translation_v2` | Bengali Translation Prompt | Subtitle pipeline, `scripts/subtitle_translate.py` |
| `multilevel_explanation_v2` | Multi-Level Explanation Prompt | AI Mentor level selector (ELI5 to Researcher) |
| `rag_grounding_v2` | RAG Context Format Template | All RAG-grounded calls |
| `admin_key_resolution_v2` | Admin AI Key Resolution Algorithm | `lib/ai/server-fallback.ts` |
| — | Prompt governance notes | Applies platform-wide |

### Prompt Governance

All production prompts are documented before deployment. Changes require a version bump in `docs/PROMPTS.md`. Old versions are retained in the same file. The `docs_content` table stores the live version, editable from `/admin`. No prompt is deployed without a corresponding entry in the registry.

The prompts are written to exclude demographic inputs. The AI tutor is never told a learner's gender, religion, ethnicity, or location — only the question, the lesson, and the language.
