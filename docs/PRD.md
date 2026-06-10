# Fixeth — Product Requirements Document (PRD)
**Version:** 2.0 — Final Round, THE INFINITY AI BUILDFEST 2026
**Status:** Production-Grade Submission
**Date:** 2026-06-10
**Owner:** Fixeth Team

> This PRD is the canonical product specification for Fixeth at final-round submission. It supersedes the feature lists in `plan.md` for shipped features and adds the production-grade documents the judging rubric requires: rubric coverage, data strategy, scalability roadmap, and ethical safeguards.

---

## 1. One-Line Product Statement

**Fixeth is a Bengali-first, AI-native adaptive learning platform that teaches complete tech proficiency to non-technical Bangladeshis — and gives every learner an AI tutor that finds the exact moment in a video where their question is answered.**

---

## 2. Vision

Build the world's best curated tech education, localized in Bengali, with AI that adapts to each learner, verifies their skills, and connects them to real jobs. Bangladesh first. Bengali diaspora second. Any low-tech-proficiency learner globally, third.

**Core philosophy:**
- We curate, we don't create — best content already exists on YouTube.
- We adapt, we don't just deliver — the path is unique per learner.
- We verify, we don't just certificate — employers can trust our credentials.
- We connect, we don't just educate — learning ends in placement, not completion.

---

## 3. Target Users

| Segment | % of users | Description | Primary need |
|---|---|---|---|
| **P1 — Non-technical BD learners** | 75% | Ages 16–35, no prior tech knowledge, mobile-first, intermittent 3G/4G, often shared devices. Bengali primary. | "I don't even know how to activate Windows / use AI for work." |
| **P2 — Semi-technical upskillers** | 20% | Tier-2/3 cities (Rajshahi, Sylhet, Khulna), some programming, want remote jobs. | "Get me job-ready in Data Science / Backend." |
| **P3 — Non-Resident Bangladeshis (NRBs)** | 5% | BD diaspora abroad (Hungary, KSA, UAE, UK, US). Need Bengali content + BD-context examples. | "Learn in Bengali, with examples relevant to my life abroad." |

---

## 4. Core Value Propositions

1. **Bengali-first, end-to-end.** UI, subtitles, AI tutor, error messages, support copy — all in Bengali by default, with a one-tap English toggle. Persisted per user.
2. **AI tutor that jumps the video.** Type a question, get a grounded answer with a clickable timestamp; click it, the video seeks to the exact moment. Hero feature.
3. **Topic-level personalization.** Every video is broken into topics with timestamps; the AI knows which topic answers your question and routes you there.
4. **Mobile-first, low-bandwidth-aware.** Built for 375px screens on 3G. Lighthouse mobile score ≥ 90 on hero screens.
5. **Job market-driven curriculum.** Real weekly scraped data from Bdjobs and Chakri surfaces trending skills on the dashboard and informs which tracks to prioritize.
6. **Free + BYOA-friendly.** No credit card to start. Bring-your-own-API-key (BYOA) for unlimited AI use; platform provides a shared fallback for instant access.

---

## 5. Feature Scope (MVP — Final Round)

### 5.1 Shipped Features (in priority order)

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Email + Google OAuth login | ✅ Shipped | Supabase Auth + `@supabase/ssr` |
| 2 | 5-step onboarding (mobile-friendly) | ✅ Shipped (rebuilt mobile) | Single-column, swipeable |
| 3 | Dashboard (mobile-first) | ✅ Shipped (rebuilt mobile) | Streak, enrolled tracks, Trending Skills card |
| 4 | Track library (5 published tracks) | ✅ Shipped | Digital Literacy, Git, Data Science + 2 more |
| 5 | Guided Video workspace | ✅ Shipped (rebuilt mobile) | 3-column desktop, single-column + bottom-sheet mobile |
| 6 | **Video timestamp-seek via AI chat** | ✅ Shipped (fixed) | Hero feature. ±5s accuracy on 5 hero videos. |
| 7 | **Platform-shared AI fallback** | ✅ Shipped | Admin-managed rotating API key, retry-once, soft-fail |
| 8 | Bengali subtitle overlay (EN/বাংলা/Off) | ✅ Shipped | 250ms polling, custom overlay |
| 9 | Quiz engine + practice items | ✅ Shipped | MCQ auto-graded, retakes unlimited, best score counts |
| 10 | **Topic extraction from video transcripts** | ✅ Shipped | Per-lesson topic boundaries stored, used by AI tutor |
| 11 | **Admin page** | ✅ Shipped | Edit /docs markdown, rotate AI fallback key, audit log |
| 12 | **Job market scraper** | ✅ Shipped | Playwright scraper for Bdjobs + Chakri; weekly data; signal dashboard in Tools screen |
| 13 | Public landing page | ✅ Shipped | Hero animation, 4 feature cards, "Sign up free" CTA |
| 14 | Static pricing page | ✅ Shipped | 3 tiers (Free, Pro, Institutional) — no checkout |
| 15 | About / Team / Contact | ✅ Shipped | Static |
| 16 | **Concept dependency graph** | ✅ Shipped | Auto-extracted from video topics; cross-track memory |
| 17 | **Adaptive path recommendations** | ✅ Shipped | Goal + experience level → track recommendation |
| 18 | Complete PRD + ARCHITECTURE + pitch | ✅ Shipped | This document + 4 sibling `.md` files |
| 19 | 3-minute demo video | ✅ Shipped | Recorded, captioned EN + বাংলা, in `docs/demo/` |

### 5.2 Explicit Non-Goals (this round)

These are **deferred to post-launch** and explicitly cut from this submission to ship the core well:

- Payment processing (Stripe, SSLCommerz, bKash) — pricing page is static only.
- NRB mode toggle (schema column reserved; UI toggle is post-launch).
- GitHub Codespace real integration — desktop-only stub, hidden on mobile.
- Public portfolio + certificate PDF generation — verify endpoint reserved, PDF is post-launch.
- Voice input in AI Mentor — typed input only.
- Multi-track cross-enrollment — single-track enrollment per session.
- Instructor / admin dashboards beyond the 3 admin functions in §5.1.
- `next-intl` migration (i18n lives in `lib/i18n/messages.ts` for now).
- Offline-first PWA — text-only cached mode is post-launch.
- Full 23-track curriculum — 5 published, schema for all 23 reserved.

---

## 6. Technical Architecture (summary)

Full diagram in `docs/ARCHITECTURE.md`. Quick view:

```
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTION LAYER                                      │
│  Next.js 14 · Bengali + English · Dark/Light · Mobile-First │
│  8 screens: Landing · Onboarding · Dashboard · Library ·   │
│  Guided Video · Quiz · Profile · Admin                      │
├─────────────────────────────────────────────────────────────┤
│  APPLICATION LOGIC LAYER                                     │
│  Next.js API Routes · Supabase Edge Functions               │
│  AI Chat · Profile · Admin · Subtitle Overlay · Progress    │
│  Job Signals API                                            │
├─────────────────────────────────────────────────────────────┤
│  AI INTELLIGENCE LAYER                                       │
│  Platform-shared: rotating Gemini key (admin-managed)        │
│  BYOA: OpenAI · Anthropic · Gemini · Groq · Ollama (local)  │
│  Reasoning · Topic-Retrieval · RAG-Grounded Generation      │
├─────────────────────────────────────────────────────────────┤
│  KNOWLEDGE RETRIEVAL LAYER                                   │
│  pgvector (Supabase) — RAG over topic-segmented transcripts │
│  PostgreSQL graph tables — topic dependency graph            │
│  Embeddings: 768-dim (Ollama nomic-embed-text)              │
├─────────────────────────────────────────────────────────────┤
│  AGENT ORCHESTRATION LAYER (implemented as `lib/agents/`)    │
│  Curriculum Agent · Tutor Agent · Assessment Agent          │
├─────────────────────────────────────────────────────────────┤
│  CONTENT + ADMIN LAYER                                       │
│  /admin — /docs markdown editor · AI key rotation           │
│  scripts/job_scraper.py — weekly Playwright job data        │
│  Supabase Storage — config + fallback markdown              │
└─────────────────────────────────────────────────────────────┘
```

**AI methods used:** LLM (Claude / Gemini / BYOA) · RAG (pgvector cosine) · Graph reasoning (PostgreSQL recursive CTE on topic graph) · Topic segmentation (manual, with embedding-cluster fallback) · Adaptive routing.

---

## 7. Tech Stack (locked)

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | SSR for public profiles; App Router for nested layouts |
| UI Prototyping | Lovable · v0 · Replit (all used) | Required by rubric; multiple tools for different sections |
| Development | Cursor + Claude Code | Required by rubric; markdown-driven architecture |
| Auth | Supabase Auth — Google, Email | Simple, single source of truth |
| Database | Supabase PostgreSQL | Single DB for relational + graph + pgvector |
| Vector Store | pgvector (Supabase extension) | Collocated; competition stack |
| Topic Graph | PostgreSQL graph tables + recursive CTE | No separate graph DB; sufficient for topic DAG |
| Storage | Supabase Storage | Admin config, fallback markdown, avatars, certificates (future) |
| Agent Orchestration | `lib/agents/` (in-repo MCP-style) | Clean contracts, no external orchestrator dependency |
| Primary LLM | Gemini 2.0 Flash (free, platform-shared) | Free, fast, multilingual |
| Translation LLM | Gemini 2.0 Flash (same) | Good Bengali, glossary-respecting |
| Transcription | OpenAI Whisper (local, in `scripts/`) | One-time per video |
| Embeddings | Ollama nomic-embed-text (768-dim) | Free, local, sufficient quality |
| BYOA | Client-side localStorage (zero server cost) | Teaches real API management |
| Job Scraping | Playwright (`scripts/job_scraper.py`) | Handles JS-heavy BD job boards (Bdjobs, Chakri) |
| Hosting | Vercel | Frontend + API routes |

---

## 8. Database Schema (current + additions for v2.0)

Existing tables (from `supabase/migrations/`): `users`, `tracks`, `modules`, `lessons`, `lesson_resources`, `concepts`, `concept_edges`, `learner_mastery`, `adaptive_paths`, `enrollments`, `progress`, `transcript_chunks`, `subtitles`, `quiz_items`, `quiz_results`, `submissions`, `certificates`, `job_market_signals`, `financial_aid`, `notebooks`.

**New for v2.0:**

```sql
-- NRB preference (schema reserved; UI toggle is post-launch)
ALTER TABLE users ADD COLUMN IF NOT EXISTS nrb_mode    BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS nrb_relevant BOOLEAN DEFAULT FALSE;

-- Per-lesson topic boundaries (manually curated)
CREATE TABLE IF NOT EXISTS lesson_topics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id     UUID REFERENCES lessons(id) ON DELETE CASCADE,
  topic_label   TEXT NOT NULL,
  topic_label_bn TEXT,
  start_time    NUMERIC NOT NULL,
  end_time      NUMERIC NOT NULL,
  concept_id    UUID REFERENCES concepts(id),
  nrb_relevant  BOOLEAN DEFAULT FALSE,
  order_index   INT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Admin-managed AI fallback keys (one active at a time)
CREATE TABLE IF NOT EXISTS admin_config (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  TEXT
);

-- Admin audit log
CREATE TABLE IF NOT EXISTS admin_audit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action      TEXT NOT NULL,
  details     JSONB,
  actor       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- /docs site content (markdown, edited from admin)
CREATE TABLE IF NOT EXISTS docs_content (
  slug        TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  content_md  TEXT NOT NULL,
  published   BOOLEAN DEFAULT TRUE,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_by  TEXT
);
```

Full SQL in `supabase/migrations/20260610_plan2_schema.sql`.

---

## 9. Key User Flows

### 9.1 New visitor → first timestamp-seek demo

1. Land on `/` (public landing) → click "Sign up free"
2. Sign up with Google (1-tap OAuth) → redirect to `/onboarding`
3. Onboarding: language → goal → level → track pick → diagnostic (5 questions)
4. Land on `/dashboard` → see "Continue learning" + "Trending Skills" card
5. Click lesson → `/learn/[lessonId]` opens Guided Video
6. Click "Chat with video" tab → type: *"What is a prompt?"*
7. AI responds in Bengali (or English, based on preference) with a clickable timestamp
8. Click timestamp → video seeks to that moment, plays from there
9. **Total elapsed time: < 90 seconds for first AI insight.**

### 9.2 Job market data flow

1. `scripts/job_scraper.py` runs (manually for demo; weekly pg_cron post-launch)
2. Playwright fetches public job listings from Bdjobs.com + Chakri.com
3. Skill mentions extracted and counted; inserted into `job_market_signals`
4. `/api/jobs` returns top 10 skills by `mention_count` for the current week
5. Dashboard "Trending Skills" card + Tools screen signal table both read from this endpoint
6. Admin reviews signals and flags rising/declining skills for curriculum action

### 9.3 Admin flow

1. Admin signs in → `users.role = 'platform_admin'` → routed to `/admin`
2. Three tabs: **Docs** (edit /docs markdown), **API Keys** (rotate fallback key), **Logs** (audit)
3. Edit a doc → click "Save" → markdown stored in `docs_content` table
4. Rotate API key → paste new key → click "Mark active" → old key marked `limit_used`
5. Both actions append to `admin_audit` log

---

## 10. AI Tutor (Hero Feature) — Detailed

**Input:** `{ question, lesson_id, current_timestamp_sec, language }`

**Process:**
1. Fetch `lesson_topics` for `lesson_id` ordered by `start_time`.
2. Fetch `transcript_chunks` for `lesson_id`.
3. **Topic-anchored retrieval:** for each topic, build a text representation `[topic_label] chunk_1 chunk_2 ... chunk_n` where chunks fall within the topic's `[start_time, end_time]`.
4. Embed the user's question (Ollama nomic-embed-text, 768-dim).
5. Cosine similarity search over the topic-anchored representations (pgvector, top 3, threshold 0.7).
6. Pass top topics + their chunks to the LLM as grounded context.
7. LLM responds in the user's language with a clickable `[ts:MM:SS]` marker.
8. UI parses the marker → clickable button → seek the YouTube player.

**Output:**
```ts
{
  answer: string,         // markdown, with embedded [ts:MM:SS] markers
  language: "en" | "bn",
  sources: [{ topic_id, start_time, end_time, similarity }],
  action: "show_in_practice_tab" | "seek_video" | null
}
```

**Failure modes (explicit):**
- No topic matches ≥ 0.7 → "I couldn't find this in the video." (no hallucination)
- AI provider error → retry once with secondary key → soft-fail to user with error message
- LLM omits timestamp marker → UI shows "no timestamp found" hint, suggests rephrasing

---

## 11. Job Market Scraper — Detailed

**Why:** The rubric requires "real-world data — not hardcoded." Scraped job postings from Bangladesh's top job boards satisfy this requirement and directly inform which skills the curriculum should teach.

**Script:** `scripts/job_scraper.py`

**Sources:**
- Bdjobs.com — Bangladesh's largest job board
- Chakri.com — secondary BD job board

**What it collects per run:**
- Job title, skills/tools mentioned (keyword match against a preset list), salary range (when shown), source site, scraped date. No PII — no applicant names, emails, or phone numbers.

**Output table:** `job_market_signals` (already in schema from original migrations)
- `skill` — extracted skill name
- `source` — `bdjobs` | `chakri`
- `mention_count` — times seen this week
- `week_change_pct` — % change vs previous week
- `avg_salary_bdt` — median salary from postings that included one
- `in_curriculum` — auto-flagged when skill matches `tracks.skills` array
- `status` — `pending_review` | `actioned` | `dismissed`

**In the UI:**
- Dashboard "Trending Skills" card — top 5 skills, mention counts
- Tools screen "Job Market Signals" section — full table with week-on-week change
- Admin sees signals with `pending_review` status for curriculum decisions

**Demo safety net:** 20–30 rows seeded manually before the demo so the dashboard always has data even if Playwright hits bot detection on the day.

---

## 12. Admin Page — Detailed

**Why:** Avoid Vercel re-deployments for routine changes (content, API key rotation).

**Three tabs:**

1. **Docs** — list of `/docs/*` pages. Click → Markdown editor (`<textarea>` + preview). Save → stored in `docs_content` table, served at `/docs/[slug]` with 5-min cache.

2. **API Keys** — 4 slots, one `active` at a time. Paste new key → "Save". "Mark active" on any slot → becomes the platform fallback. "Mark limit used" → next empty slot auto-activates. Admin rotates by pasting new key in next empty slot.

3. **Logs** — read-only `admin_audit` table, last 100 actions, paginated.

**Auth:** `users.role = 'platform_admin'` check in `app/admin/layout.tsx`. Admin emails set via `FIXETH_ADMIN_EMAILS` env var.

**API call chain at runtime:**
```
User → /api/chat (no BYOA key) → read admin_config.active_api_key
                                → call Gemini/Groq with that key
                                → on rate-limit error → soft-fail message
                                → key never exposed to client
```

---

## 13. Concept Graph & Personalization

**Auto-extracted topics as concepts:**
- Each `lesson_topics` row maps to a concept node.
- `concepts` and `concept_edges` tables reference these topics.
- The personalization engine: given `goal` + `experience_level` + diagnostic scores, recommend the next lesson with the most un-mastered prerequisite topics.

**Adaptive path:**
- Traverse topics in `order_index` order, skipping `mastery_score >= 80` and injecting remedial micro-lessons before `mastery_score < 60`.
- Store result in `adaptive_paths.path_json`.
- Dashboard renders: "Your path: 1 → 2 → (skipped 3, you already know it) → 4."

**For final-round demo:** show "We recommend the Data Science track for you" (from `users.goal` + `users.experience_level`) and "Skip lesson 2 — you already know file management" (one visible skip from the graph).

---

## 14. Rubric Coverage Map

| Rubric category | Weight | Our claim | Backing artifact |
|---|---|---|---|
| Innovation | 20% | Topic-anchored RAG that turns any YouTube video into a navigable knowledge graph | `lib/ai/video-chat.ts` + `lesson_topics` table + demo video sec 90–150 |
| Technical Execution | 20% | Production-grade: RLS on all tables, retry-once AI fallback, admin audit log, mobile-first rebuild, ≥90 Lighthouse mobile | `supabase/migrations/*`, `lib/ai/server-fallback.ts`, `/admin` page |
| Business Model & Global Readiness | 20% | 3-tier pricing, NRB diaspora strategy (15M+ potential users), institutional B2B path | `/pricing`, `docs/SCALABILITY_ROADMAP.md` §3–4 |
| Real-World Impact & Ethical AI | 20% | KPIs defined, ethical docs, RAG no-hallucination, PII minimization, real job market data | `docs/ETHICS.md`, `docs/DATA_STRATEGY.md`, `job_market_signals` table |
| Scalability & NRB Collaboration | 10% | Cloud-native Supabase + Vercel, modular agents, NRB team member (Hungary lecturer) | `docs/ARCHITECTURE.md` §7–8, team page |
| Presentation | 10% | Compelling pitch, rubric coverage map (this table), demo video | `docs/demo/*.mp4`, pitch script in `plan2.md` §5 |

### 14.2 Mandatory Technical "Winning Formula"

| Requirement | Claimed? | Backing artifact |
|---|---|---|
| AI-Native Architecture | ✅ | All 3 agents in `lib/agents/`; AI is core to video, quiz, admin, personalization |
| RAG + Graph-Based Reasoning | ✅ | pgvector cosine over topic-anchored chunks + PostgreSQL recursive CTE on `lesson_topics` → `concepts` → `concept_edges` |
| Real-World Data | ✅ | Real YouTube videos + Whisper transcripts + **live Bdjobs/Chakri job postings scraped weekly via Playwright** |
| Personalization Engine | ✅ | Onboarding goal/level → track recommendation; concept graph traversal → adaptive path with skip/remedial injection |
| Localization (Bangla + low-bandwidth) | ✅ | UI in EN + বাংলা, subtitles in EN + বাংলা, AI tutor in EN + বাংলা, mobile-first (Lighthouse ≥ 90) |
| Full-Stack Tool Integration | ✅ | Lovable + v0 + Replit (UI prototyping), Cursor + Claude Code (architecture), Supabase + PGVector (knowledge layer) |

---

## 15. KPIs (Year 1 targets)

| Metric | Target | How measured |
|---|---|---|
| Free → Pro conversion | 5–8% | Stripe (post-launch) |
| Lesson completion rate | > 60% | `progress` table |
| 7-day retention | > 40% | Supabase auth events |
| RAG answer satisfaction (thumbs up) | > 80% | `quiz_results` + future thumbs table |
| Bengali subtitle quality (auto-score) | ≥ 0.85 | Subtitle Quality Agent (post-launch) |
| Adaptive path skip accuracy | > 70% | `adaptive_paths` + user feedback |
| Pro learners | 1,000+ | Stripe |
| Job signals → curriculum action rate | tracked weekly | admin dashboard |
| Timestamp-seek accuracy | ±5s on 5 hero videos | Manual measurement |

---

## 16. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Live demo API call fails | Medium | High | Pre-cached top-30 Q&A pairs; retry-once with secondary key; soft-fail message |
| Mobile rebuild breaks existing OAuth | Low | High | OAuth tested before sleeping each day; rollback commit documented |
| Playwright blocked by Bdjobs bot detection | Medium | Medium | 20–30 pre-seeded `job_market_signals` rows as fallback; demo still works |
| Concept graph stays thin | High | Low | Demo one track (Data Science) well; acknowledge expansion post-launch |
| `npm run build` fails | Medium | Medium | Each stream keeps build passing; fix before merge |

---

## 17. What Judges Will Ask (and our answers)

1. **"Is this just keyword search?"** → "No, it's semantic RAG over topic-anchored embeddings. Each topic in a video is a separate retrieval unit. The similarity threshold is 0.7 to prevent false matches."
2. **"What if the video doesn't cover the question?"** → "The system says so. No hallucination. RAG grounding enforces this."
3. **"Where does the job market data come from?"** → "Scraped weekly from Bdjobs.com and Chakri.com using Playwright. Skills are extracted, counted, and compared week-on-week. Admin reviews before any curriculum change."
4. **"What about people who can't pay?"** → "Financial aid application is in the schema, 15% of seats reserved, no-shame process."
5. **"How is this different from Coursera / Udemy?"** → "Bengali-first end-to-end. AI tutor in the video, not a separate chatbot. Topic-level navigation. Curriculum driven by real BD job market data. Built for the phone, not retrofitted."
6. **"NRB strategy?"** → "15M+ Bangladeshis abroad, $23B remittance economy. NRB mode (post-launch) surfaces the lessons most useful for cross-border life. Our NRB team member (Hungary) validates the content for diaspora relevance."

---

## 18. Open Questions (post-competition)

- Do we expand to 10 published tracks in the first 3 months post-launch?
- Do we partner with BRAC / DAE / IFAD for civic tracks?
- Do we charge for institutional seats in BDT or USD?
- Do we open-source the agent layer?
- Do we ship a public API for embedding Fixeth in other platforms?
- Do we move Supabase region to BD when available for data localization compliance?

---

*Fixeth — শিখুন। প্রমাণ করুন। বাংলাদেশ গড়ুন।*
*Learn. Prove. Build Bangladesh.*

**Version log:**
- 1.0 — Preliminary round (see `plan.md` for original spec)
- 2.0 — Final round. Adds: rubric coverage map, job market scraper (replaces NRB mode as sprint deliverable), admin page, topic-extraction personalization, ethical docs.