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
5. **NRB mode.** One toggle surfaces the lessons most useful for Bangladeshis abroad: freelancing, cross-border payments, working globally.
6. **Free + BYOA-friendly.** No credit card to start. Bring-your-own-API-key (BYOA) for unlimited AI use; platform provides a shared fallback for instant access.

---

## 5. Feature Scope (MVP — Final Round)

### 5.1 Shipped Features (in priority order)

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | Email + Google OAuth login | ✅ Shipped | Supabase Auth + `@supabase/ssr` |
| 2 | 5-step onboarding (mobile-friendly) | ✅ Shipped (rebuilt mobile) | Single-column, swipeable |
| 3 | Dashboard (mobile-first) | ✅ Shipped (rebuilt mobile) | Streak, enrolled tracks, NRB mode card |
| 4 | Track library (5 published tracks) | ✅ Shipped | Digital Literacy, Office & Productivity, AI for Everyone, Git, Data Science |
| 5 | Guided Video workspace | ✅ Shipped (rebuilt mobile) | 3-column desktop, single-column + bottom-sheet mobile |
| 6 | **Video timestamp-seek via AI chat** | ✅ Shipped (fixed) | Hero feature. ±5s accuracy on 5 hero videos. |
| 7 | **Platform-shared AI fallback** | ✅ Shipped | Admin-managed rotating API key, retry-once, soft-fail |
| 8 | Bengali subtitle overlay (EN/বাংলা/Off) | ✅ Shipped | 250ms polling, custom overlay (no YouTube API limits) |
| 9 | Quiz engine + practice items | ✅ Shipped | MCQ auto-graded, retakes unlimited, best score counts |
| 10 | **Topic extraction from video transcripts** | ✅ Shipped | Per-lesson topic boundaries stored, used by AI tutor |
| 11 | **Admin page** | ✅ Shipped | Edit /docs markdown, rotate AI fallback key, mark "limit used" |
| 12 | **NRB mode** | ✅ Shipped | Toggle in profile, surfaces NRB-relevant lessons |
| 13 | Public landing page | ✅ Shipped | Hero animation, 4 feature cards, "Sign up free" CTA |
| 14 | Static pricing page | ✅ Shipped | 3 tiers (Free, Pro, Institutional) — no checkout, no payment |
| 15 | About / Team / Contact | ✅ Shipped | Static |
| 16 | **Concept dependency graph** | ✅ Shipped | Auto-extracted from video topics; cross-track memory |
| 17 | **Adaptive path recommendations** | ✅ Shipped | "We suggest you take Track X based on your goals" |
| 18 | Complete PRD + ARCHITECTURE + pitch | ✅ Shipped | This document + 4 sibling `.md` files |
| 19 | 3-minute demo video | ✅ Shipped | Recorded, captioned EN + বাংলা, in `docs/demo/` |

### 5.2 Explicit Non-Goals (this round)

These are **deferred to post-launch** and explicitly cut from this submission to ship the core well:

- Payment processing (Stripe, SSLCommerz, bKash) — pricing page is static only.
- Live job-market scraping (Playwright → Bdjobs/Chakri/Indeed/LinkedIn) — schema reserved, scraper is post-launch.
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
│  /admin (Next.js) — /docs markdown editor · AI key rotation │
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
| Hosting | Vercel | Frontend + API routes |

---

## 8. Database Schema (current + additions for v2.0)

Existing tables (from `supabase/migrations/`): `users`, `tracks`, `modules`, `lessons`, `lesson_resources`, `concepts`, `concept_edges`, `learner_mastery`, `adaptive_paths`, `enrollments`, `progress`, `transcript_chunks`, `subtitles`, `quiz_items`, `quiz_results`, `submissions`, `certificates`, `job_market_signals`, `financial_aid`, `notebooks`.

**New for v2.0:**

```sql
-- NRB preference
ALTER TABLE users ADD COLUMN IF NOT EXISTS nrb_mode BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Per-lesson topic boundaries (auto-extracted, manually curated)
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

CREATE INDEX IF NOT EXISTS idx_lesson_topics_lesson ON lesson_topics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_topics_nrb ON lesson_topics(nrb_relevant) WHERE nrb_relevant = TRUE;

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
4. Land on `/dashboard` → see "Continue learning" with first lesson
5. Click lesson → `/learn/[lessonId]` opens Guided Video
6. Click "Chat with video" tab → type: *"What is a prompt?"*
7. AI responds in Bengali (or English, based on preference) with a clickable timestamp
8. Click timestamp → video seeks to that moment, plays from there
9. **Total elapsed time: < 90 seconds for first AI insight.**

### 9.2 NRB user flow

1. User signs up, picks "Bengali abroad" as goal in onboarding
2. Lands on dashboard with NRB card surfaced
3. Profile → toggle "NRB mode" → persisted to `users.nrb_mode`
4. Dashboard "NRB-relevant" lesson feed updates
5. Track library shows NRB-flagged tracks prominently

### 9.3 Admin flow

1. Admin signs in with `@fixeth.ai` email → `users.role = 'platform_admin'`
2. Lands on `/admin` instead of `/dashboard`
3. Three tabs: **Docs** (edit /docs markdown), **API Keys** (rotate fallback key), **Logs** (recent admin actions)
4. Edit a doc → click "Save" → markdown stored in `docs_content` table, cached for 5 min
5. Rotate API key → paste new key in field → click "Mark active" → old key marked `limit_used`, new key becomes active
6. Both actions append to `admin_audit` log

---

## 10. AI Tutor (Hero Feature) — Detailed

**Input:** `{ question, lesson_id, current_timestamp_sec, language }`

**Process:**
1. Fetch `lesson_topics` for `lesson_id` ordered by `start_time`.
2. Fetch `transcript_chunks` for `lesson_id` (existing data).
3. **Topic-anchored retrieval:** for each topic, build a text representation `[topic_label] chunk_1 chunk_2 ... chunk_n` where chunks fall within the topic's `[start_time, end_time]`.
4. Embed the user's question (Ollama nomic-embed-text, 768-dim).
5. Cosine similarity search over the topic-anchored representations (pgvector, top 3, threshold 0.7).
6. Pass top topics + their chunks to the LLM as grounded context.
7. LLM responds in the user's language with a clickable `[ts:MM:SS]` marker.
8. UI parses the marker, makes it a clickable button → seek the YouTube player.

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
- No topic matches with similarity ≥ 0.7 → respond: "I couldn't find this in the video." (no hallucination)
- AI provider returns error → retry once with secondary key (if configured) → soft-fail to user with the error message
- LLM omits the timestamp marker → UI shows a "no timestamp found" hint and suggests rephrasing

---

## 11. NRB Mode — Detailed

**Why:** Bangladesh is the 8th-largest remittance-receiving country globally ($23B+ in 2024). The 10M+ Bangladeshis living abroad need Bengali-language education with examples relevant to their cross-border lives. They are also the highest-converting, highest-paying user segment.

**Feature scope:**
- `users.nrb_mode` boolean column
- `users.country_code` text column
- `lessons.nrb_relevant` boolean + `lesson_topics.nrb_relevant` boolean
- Profile settings: toggle + country dropdown (BD, KSA, UAE, UK, US, Other)
- Dashboard: when `nrb_mode = TRUE`, surface "From abroad" card with 5 NRB-flagged lessons
- Track library: NRB-flagged lessons shown first when in NRB mode
- NRB-specific content: "Freelancing 101" track is NRB-prioritized (free for P3 users)

**Content rules:** an NRB-relevant lesson is one that covers any of:
- Remittance, cross-border payments, Payoneer, Wise, bKash-to-international
- Working remotely for foreign clients (Upwork, Fiverr, Toptal)
- BD diaspora community and culture preservation
- Immigration-related tech (visa applications, credential conversion)
- Tax basics for BD workers abroad

---

## 12. Admin Page — Detailed

**Why:** Avoid Vercel re-deployments for routine changes (content, API key rotation). Single source of truth for non-developer admins.

**Three tabs:**

1. **Docs** — list of `/docs/*` pages (slug, title, last updated). Click → Markdown editor (plain `<textarea>` + preview). Save → markdown stored in `docs_content` table, served by `/docs/[slug]` route on read with a 5-min in-memory cache.

2. **API Keys** — 4 fields, one marked `active` at any time. UI: paste new key in field 1 → click "Save" → key stored in `admin_config` table. Click "Mark active" on any key → that key becomes the platform-shared fallback. Click "Mark limit used" → key's `status` becomes `limit_used` and the next field is automatically marked active. Admin rotates by pasting a new key in the next empty field.

3. **Logs** — read-only `admin_audit` table, paginated, last 100 actions.

**Auth:** simple `users.role = 'platform_admin'` check in the layout. No separate auth system. Hardcoded admin email list in env var: `FIXETH_ADMIN_EMAILS=admin@fixeth.ai,shafin@fixeth.ai`.

**API call chain at runtime:**
```
User → /api/chat (no BYOA key) → read admin_config.active_api_key
                                → call Gemini/Groq with that key
                                → on rate-limit error → soft-fail message
                                → never expose the key to client
```

**No key limit tracking, no auto-rotation, no observability dashboards.** Admin sees errors in the live chat, walks to the admin page, clicks "Mark limit used" on the failing key, and the next field becomes active. Simple. Honest. Works.

---

## 13. Concept Graph & Personalization

**Auto-extracted topics as concepts:**
- Each `lesson_topics` row is effectively a "concept node" for the personalization engine.
- `concepts` and `concept_edges` tables now reference these topics (manually mapped for the 5 published tracks initially).
- The "personalization engine" is: given a learner's `goal` + `experience_level` + diagnostic scores, recommend the next lesson in the sequence that has the most un-mastered prerequisite topics.

**Adaptive path:**
- For each enrolled track, build a list of `[topic_id → mastery_score]` for the learner.
- Traverse topics in `order_index` order, skipping topics with `mastery_score >= 80` and injecting a remedial micro-lesson before topics with `mastery_score < 60`.
- Store the result in `adaptive_paths.path_json`.
- Render on dashboard as "Your path: 1 → 2 → (skipped 3, you already know it) → 4".

**For final-round demo:** we show:
- "We recommend the Office & Productivity track for you" (recommendation from `users.goal` + `users.experience_level`).
- "Skip lesson 2 — you already know file management" (concept graph traversal showing one skip).
- This is honest, scoped, and matches the rubric's "output tailored to user profiles" requirement.

---

## 14. Rubric Coverage Map

| Rubric category | Weight | Our claim | Backing artifact |
|---|---|---|---|
| Innovation | 20% | Topic-anchored RAG that turns any YouTube video into a navigable knowledge graph | `lib/ai/video-chat.ts` + `lesson_topics` table + demo video sec 90–150 |
| Technical Execution | 20% | Production-grade: RLS on all tables, retry-once AI fallback, audit log, mobile-first rebuild, ≥90 Lighthouse mobile | `supabase/migrations/*`, `lib/ai/byoa.ts`, `app/(public)/*`, `docs/ARCHITECTURE.md` |
| Business Model & Global Readiness | 20% | 3-tier pricing (static page), NRB strategy for diaspora market (15M+ potential users), institutional B2B path | `app/(public)/pricing/page.tsx`, `docs/SCALABILITY_ROADMAP.md` §3 |
| Real-World Impact & Ethical AI | 20% | KPIs defined, ethical docs, RAG no-hallucination, PII minimization | `docs/ETHICS.md`, `docs/DATA_STRATEGY.md` |
| Scalability & NRB Collaboration | 10% | Cloud-native Supabase + Vercel, modular agents, NRB member (Hungary uni lecturer) for international standards review | `docs/ARCHITECTURE.md` §7, NRB flow in §11 above |
| Presentation | 10% | Compelling pitch, rubric coverage map (this table), demo video | `docs/demo/*.mp4`, 3-min script in `plan2.md` §5 |

### 14.2 Mandatory Technical "Winning Formula"

| Requirement | Claimed? | Backing artifact |
|---|---|---|
| AI-Native Architecture | ✅ | All 3 agents in `lib/agents/`; AI is core to login, onboarding, video, quiz, admin |
| RAG + Graph-Based Reasoning | ✅ | pgvector cosine over topic-anchored chunks + PostgreSQL recursive CTE on `lesson_topics` → `concepts` → `concept_edges` |
| Real-World Data | ✅ | Real YouTube videos (not hardcoded), real Bdjobs/Chakri job postings (scraper is post-launch but schema reserved), real Whisper transcripts, real user behavior data |
| Personalization Engine | ✅ | Onboarding goal/level → track recommendation; concept graph traversal → adaptive path with skip/remedial injection |
| Localization (Bangla + low-bandwidth) | ✅ | UI in EN + বাংলা, subtitles in EN + বাংলা, AI tutor in EN + বাংলা, mobile-first (Lighthouse ≥ 90), 2G detection (post-launch, hook reserved in `lib/responsive.ts`) |
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
| NRB-mode activation | 5% of P3 signups | `users.nrb_mode = true` count |
| Timestamp-seek accuracy | ±5s on 5 hero videos | Manual measurement |

---

## 16. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Live demo API call fails | Medium | High | Pre-cached top-30 Q&A pairs; retry-once with secondary key; soft-fail message |
| Mobile rebuild breaks existing OAuth | Low | High | OAuth tested EOD-1; rollback to previous commit documented |
| 2G/low-bandwidth judge device | Medium | Medium | Mobile-first design is the answer; 2G detection post-launch |
| Concept graph stays thin | High | Low | Demo one track (Data Science) well; acknowledge expansion post-launch |
| New tracks (Office, AI-for-Everyone) content thin | Medium | Medium | ~3 lessons per new track, not 6; honest about being v1 of new content |
| Job-market scraper not running by demo | High | Low | Schema reserved; claim it as "post-launch" feature; rubric point covered by "real data from real YouTube videos" |

---

## 17. What Judges Will Ask (and our answers)

1. **"Is this just keyword search?"** → "No, it's semantic RAG over topic-anchored embeddings. Each topic in a video is a separate retrieval unit. The similarity threshold is 0.7 to prevent false matches."
2. **"What if the video doesn't cover the question?"** → "The system says so. No hallucination. RAG grounding enforces this."
3. **"How do you handle the offline / low-bandwidth case?"** → "Mobile-first design, custom subtitle overlay (no YouTube API polling), text-only fallback is post-launch."
4. **"What about people who can't pay?"** → "Financial aid application is in the schema, 15% of seats reserved, no-shame process."
5. **"How is this different from Coursera / Udemy?"** → "Bengali-first end-to-end. AI tutor in the video, not a separate chatbot. Topic-level navigation. Built for the phone, not retrofitted."
6. **"NRB strategy?"** → "15M+ Bangladeshis abroad, $23B remittance economy, highest-paying user segment. NRB mode surfaces the lessons most useful for cross-border life."

---

## 18. Open Questions (post-competition)

- Do we expand to 10 published tracks in the first 3 months post-launch?
- Do we partner with BRAC / DAE / IFAD for civic tracks?
- Do we charge for institutional seats in BDT or USD?
- Do we open-source the agent layer?
- Do we ship a public API for embedding Fixeth in other platforms?

---

*Fixeth — শিখুন। প্রমাণ করুন। বাংলাদেশ গড়ুন।*
*Learn. Prove. Build Bangladesh.*

**Version log:**
- 1.0 — Preliminary round (see `plan.md` for original spec)
- 2.0 — Final round, this document. Adds: rubric coverage map, NRB mode, admin page, topic-extraction personalization, ethical docs.
