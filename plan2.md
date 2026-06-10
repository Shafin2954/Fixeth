# Fixeth — PLAN2 (Final Round, Sprint)
**THE INFINITY AI BUILDFEST 2026 — EdTech Track**
**Status:** Active execution plan
**Supersedes:** `plan.md` feature lists (spec lives in `docs/PRD.md`)
**Companion docs:** `docs/PRD.md` · `docs/ARCHITECTURE.md` · `docs/DATA_STRATEGY.md` · `docs/SCALABILITY_ROADMAP.md` · `docs/ETHICS.md`

---

## 0. Constraints

- **Team:** 3 people, all can code + do basic design. Parallel streams from minute 0.
- **Judging bias:** balanced, ~60% flash / 40% substance. Hero feature must work visually.
- **AI:** Free models only (Gemini Flash, Groq). Platform key stored in `admin_config` table, rotated manually from `/admin`.
- **Branch:** single branch, continuous pushes, resolve conflicts in real-time.
- **Deploy:** Vercel auto-deploys on push to `main`.

---

## 1. What We Are Building

### Must ship (no demo without these)

| # | Item | Owner |
|---|---|---|
| 1 | **Video timestamp-seek AI chat (fixed)** — topic-anchored retrieval, actual seek works | S2 |
| 2 | **Mobile-first rebuild** — Onboarding, Dashboard, Guided Video, Track Library at 375px | S1 |
| 3 | **Platform-shared AI fallback** — `/api/chat` uses `admin_config` key, no user friction | S2 |
| 4 | **Public landing page** — hero animation, 4 feature cards, CTA, mobile-perfect | S1 |
| 5 | **Admin page** — 3 tabs: Docs editor, API key rotation (4 slots, 1 active), Audit log | S2 |
| 6 | **Job market scraper** — Playwright scraper for Bdjobs/Chakri, weekly pg_cron, signal dashboard | S3 |
| 7 | **All 5 docs written** — PRD, ARCHITECTURE, DATA_STRATEGY, SCALABILITY_ROADMAP, ETHICS | S3 ✅ |
| 8 | **New DB schema** — `lesson_topics`, `admin_config`, `admin_audit`, `docs_content`, `job_market_signals` tables | S2 |
| 9 | **Static pricing + about pages** — no checkout, just the pitch narrative | S1 |
| 10 | **3-min demo video** — recorded, captioned EN + বাংলা | S3 |

### Ship if time allows (nice to have)

- Manual topic entry for 5 hero videos (SQL inserts, ~30–60 min of data entry — whoever has free time)
- `npm run build` clean with zero TypeScript errors
- Lighthouse mobile ≥ 90 on Guided Video
- NRB mode toggle in profile (toggle + `users.nrb_mode` column)

### Explicitly NOT doing

- Payment processing
- Certificate PDF
- Voice input
- `next-intl` migration
- Offline PWA
- New tracks content (Office, AI-for-Everyone) — schema reserved, no content yet

---

## 2. Three Parallel Streams

Each person owns a file boundary. No stepping on each other's files.

### Stream 1 (S1) — Mobile + UI + Public pages

**Files:**
- `app/(public)/page.tsx` — NEW, landing page
- `app/(public)/pricing/page.tsx` — NEW, static pricing
- `app/(public)/about/page.tsx` — NEW, team + NRB member
- `components/screens/Onboarding.tsx` — mobile-first rewrite
- `components/screens/Dashboard.tsx` — mobile-first rewrite (add job signals card)
- `components/screens/GuidedVideo.tsx` — bottom-sheet mobile layout
- `components/screens/TrackLibraryScreen.tsx` — card list mobile
- `components/layout/AppChrome.tsx` — hamburger nav on mobile
- `app/globals.css` — design tokens, mobile base
- `package.json` — add `framer-motion`

**Done =**
- No horizontal scroll at 375px on any hero screen
- Landing page renders in < 1s, has at least one Framer Motion animation
- Pricing page shows 3 tiers (Free, Pro, Institutional)
- About page has team members including the Hungarian lecturer
- Onboarding is single-column, swipeable on mobile
- Dashboard shows streak, enrolled track, and a "Trending Skills" card pulled from `job_market_signals`

### Stream 2 (S2) — AI engine + Admin + DB schema

**Files:**
- `supabase/migrations/20260610_plan2_schema.sql` — NEW, all new tables
- `lib/ai/server-fallback.ts` — NEW, reads `admin_config`, calls Gemini
- `app/api/chat/route.ts` — NEW (or update), uses server-fallback when no BYOA
- `app/api/admin/keys/route.ts` — NEW
- `app/api/admin/docs/[slug]/route.ts` — NEW
- `app/admin/page.tsx` — NEW, 3-tab admin UI
- `app/admin/layout.tsx` — NEW, platform_admin auth check
- `lib/supabase/queries/transcript.ts` — update for topic-anchored retrieval
- `lib/ai/video-chat.ts` — update `buildContext` to use topic groups

**Done =**
- User with no BYOA key can chat with a video and get a timestamped answer
- Admin can paste a key in slot 1, mark it active — subsequent `/api/chat` calls use it
- Admin can edit a `/docs` page and save it — the `/docs/[slug]` route serves the updated content
- `npm run build` clean

### Stream 3 (S3) — Docs, Job Scraper, demo

**Files:**
- `docs/PRD.md` ✅ (done)
- `docs/ARCHITECTURE.md` ✅ (done)
- `docs/DATA_STRATEGY.md` ✅ (done)
- `docs/SCALABILITY_ROADMAP.md` ✅ (done)
- `docs/ETHICS.md` ✅ (done)
- `docs/PROMPTS.md` — update with v2 versioned prompts
- `plan2.md` ✅ (this file)
- `README.md` — rewrite as 1-pager
- `scripts/job_scraper.py` — NEW, Playwright scraper for Bdjobs + Chakri + Indeed + We work remotely + Jobicy + Any other potential source
- `app/api/jobs/route.ts` — NEW, returns trending skills from `job_market_signals`
- `components/screens/Tools.tsx` — update to show job signals dashboard
- Demo video recording (`docs/demo/`)

**Done =**
- All 5 docs are real, not empty
- Playwright scraper can run locally and insert rows into `job_market_signals`
- `/api/jobs` returns top trending skills for the week
- Dashboard "Trending Skills" card shows real data (or a seeded snapshot if scraper hasn't run yet)
- Tools screen has a "Job Market Signals" section with skill trend table
- `README.md` has live link, stack, rubric coverage summary
- Demo video exists in `docs/demo/` and is captioned

---

## 3. Task Order (per stream)

Work top to bottom. Each task should be completable independently. Push after each one.

### S1 — Mobile + UI

1. Install `framer-motion`. Set Tailwind mobile-first breakpoint tokens in `app/globals.css`.
2. Read `GuidedVideo.tsx` fully before touching it — it is 700+ lines.
3. Rewrite `Onboarding.tsx` mobile-first (single column, swipeable steps, no fixed widths).
4. Rewrite `Dashboard.tsx` mobile-first — hide non-core nav, show streak + track + Trending Skills card slot.
5. Rewrite `GuidedVideo.tsx` mobile — video top, bottom-sheet for transcript/chat tabs.
6. Rewrite `TrackLibraryScreen.tsx` mobile — card list, 1-tap enroll.
7. Write landing page `app/(public)/page.tsx` — hero animation, 4 feature cards, "Sign up free" CTA.
8. Add Framer Motion hero animation to landing page.
9. Write `app/(public)/pricing/page.tsx` — 3-tier static table.
10. Write `app/(public)/about/page.tsx` — team + Hungarian lecturer section.
11. Fix `AppChrome.tsx` hamburger nav for mobile.
12. Mobile Lighthouse test on all 4 hero screens. Fix anything < 90.
13. Final visual polish — dark/light parity, accessibility pass.
14. `npm run build` clean. Deploy check on real mobile device.

### S2 — AI engine + Admin

1. Read `lib/ai/`, `lib/supabase/`, `app/api/` fully. Audit current transcript_chunks state in Supabase.
2. Apply `supabase/migrations/20260610_plan2_schema.sql` to Supabase SQL editor.
3. Write `lib/ai/server-fallback.ts` — reads `admin_config.api_keys`, calls Gemini Flash, retry-once on 429.
4. Update `app/api/chat/route.ts` — use server-fallback when request has no BYOA key. Test with curl.
5. Write `app/api/admin/keys/route.ts` — PATCH to update slot status/value.
6. Write `app/api/admin/docs/[slug]/route.ts` — PUT to update `docs_content` row.
7. Write `app/admin/layout.tsx` — platform_admin role check, redirect non-admins.
8. Write `app/admin/page.tsx` — 3-tab UI: Docs editor, API Keys, Logs (see §7 spec).
9. Update `lib/supabase/queries/transcript.ts` — add `getTopicsWithChunks(lesson_id)` helper.
10. Update `lib/ai/video-chat.ts` `buildContext()` — group chunks by topic when topics exist, fall back to flat chunks when they don't.
11. End-to-end test: user with no key → chat → server key used → answer with timestamp → video seeks.
12. Hardening: simple in-memory cache for repeated questions (5-min TTL), rate-limit `/api/chat` 30 req/min/IP.
13. `npm run build` clean. Push to Vercel, smoke test on production URL.

### S3 — Docs, Job Scraper, demo

1. Update `docs/PROMPTS.md` with v2 versioned prompts (file already provided — place it).
2. Rewrite `README.md` as 1-pager with live link, stack overview, rubric coverage table.
3. Write `scripts/job_scraper.py` — Playwright scraper targeting Bdjobs.com and Chakri.com public listings. Extracts: job title, skills mentioned, salary (if shown). Inserts into `job_market_signals` table via Supabase service role key.
4. Seed 20–30 realistic `job_market_signals` rows manually (as a fallback if scraper hits bot protection during demo). This is the demo safety net.
5. Write `app/api/jobs/route.ts` — GET returns top 10 skills by `mention_count` for the current week from `job_market_signals`.
6. Update `components/screens/Tools.tsx` — add "Job Market Signals" section: table of top skills, mention count, week change %, salary range. Reads from `/api/jobs`.
7. Wire Dashboard "Trending Skills" card to `/api/jobs` (coordinate with S1 — S1 owns the card slot, S3 provides the data).
8. Run the scraper once locally. Verify rows appear in Supabase. Screenshot it.
9. Record demo video take 1 — full 3-min run-of-show from §5.
10. Edit demo video. Add EN + বাংলা captions.
11. Final pitch script review against demo video. Sync timings.
12. Submit all docs to competition portal.

---

## 4. Rubric Coverage Map (Quick Reference)

| Rubric (weight) | What we ship | Artifact |
|---|---|---|
| Innovation (20%) | Topic-anchored RAG: any YouTube video becomes a navigable knowledge graph with clickable timestamps | `lesson_topics` table + `lib/ai/video-chat.ts` + demo |
| Technical Execution (20%) | RLS on all tables, retry-once AI fallback, admin audit log, mobile-first (≥90 Lighthouse) | `supabase/migrations/*`, `lib/ai/server-fallback.ts`, admin page |
| Business Model & Global Readiness (20%) | 3-tier pricing page, NRB diaspora strategy (15M+ potential users), institutional B2B | `/pricing`, `docs/SCALABILITY_ROADMAP.md` §3–4 |
| Real-World Impact & Ethical AI (20%) | KPIs defined, RAG no-hallucination, PII minimization, learner rights, real job market data | `docs/ETHICS.md`, `docs/DATA_STRATEGY.md`, `job_market_signals` table |
| Scalability & NRB Collaboration (10%) | Cloud-native Vercel + Supabase, modular agents, NRB team member | `docs/ARCHITECTURE.md` §7–8 |
| Presentation (10%) | Compelling pitch, rubric map, demo video | Demo video in `docs/demo/`, pitch script §5 |

| Mandatory requirement | Status | Evidence |
|---|---|---|
| AI-Native Architecture | ✅ | All 3 agents in `lib/agents/`; AI drives video, quiz, admin |
| RAG + Graph-Based Reasoning | ✅ | pgvector cosine + PostgreSQL CTE on `lesson_topics` → `concepts` → `concept_edges` |
| Real-World Data | ✅ | Real YouTube videos, Whisper transcripts, **live Bdjobs/Chakri job postings** via Playwright scraper |
| Personalization Engine | ✅ | Goal + level → track recommendation; concept graph → adaptive path with skip/remedial |
| Localization (Bangla + low-bandwidth) | ✅ | UI + subtitles + AI tutor in EN + বাংলা; mobile-first (375px) |
| Full-Stack Tool Integration | ✅ | Lovable + v0 + Replit (UI), Cursor + Claude Code (arch), Supabase + PGVector (knowledge) |

---

## 5. The 3-Minute Demo Script

| Sec | Screen | Narration |
|---|---|---|
| 0–15 | Landing page, hero animation | "170 million Bangladeshis. Half under 30. Every quality tech education platform is English-only and unadaptive. We built Fixeth." |
| 15–35 | Click "Get Started" → Google OAuth (1-tap) | "Bengali-first. AI-native. Thirty seconds to start." |
| 35–60 | Onboarding, mobile view (5 steps) | "Goal: get a job. Level: complete beginner. Track: Digital Literacy." |
| 60–90 | Dashboard, mobile, enrolled track, streak, Trending Skills card | "The dashboard knows what you know. And it knows what the market wants — right now, from real job postings." |
| 90–150 | Guided Video, type "What is a prompt?" | **Hero moment.** "Watch this. I ask a question. The AI finds the exact moment in the video where it's explained — and seeks there. [click timestamp] 14:32. That is the feature." |
| 150–180 | Toggle বাংলা subtitles | "Bengali subtitles. Real-time. Technical terms preserved in English." |
| 180–220 | Tools screen → Job Market Signals table | "This data is scraped from Bdjobs and Chakri every week. Python is up 23% this week. React is rising. That's not our guess — that's the market." |
| 220–260 | Track library, 5 published tracks | "Five published tracks. Eight more reserved in the schema. Curriculum driven by what employers actually want." |
| 260–290 | Architecture diagram (from `docs/ARCHITECTURE.md`) | "pgvector RAG. PostgreSQL concept graph. Three MCP-style agents. No hallucination — the AI only answers from the video." |
| 290–300 | Landing page CTA, QR code | "fixeth.vercel.app. Thank you." |

**Backup plan:** if the live timestamp-seek fails, play the pre-recorded screen capture. Do not skip the feature — show the recording.

---

## 6. Manual Topic Entry Guide

For each of the 5 hero videos, watch the video and fill in the SQL below. ~5–10 topics per video. Total: ~50 SQL inserts. Whoever finishes their stream tasks first does this.

**Template:**
```sql
INSERT INTO lesson_topics (lesson_id, topic_label, topic_label_bn, start_time, end_time, order_index, nrb_relevant)
VALUES
  ('<lesson_uuid>', 'Introduction & Overview',    'পরিচিতি ও সারসংক্ষেপ', 0,    45,   1, false),
  ('<lesson_uuid>', 'Core Concept A',             'মূল ধারণা A',           45,   180,  2, false),
  ('<lesson_uuid>', 'Practical Example',          'ব্যবহারিক উদাহরণ',      180,  340,  3, false),
  ('<lesson_uuid>', 'Common Mistakes',            'সাধারণ ভুল',            340,  480,  4, false),
  ('<lesson_uuid>', 'Summary & Next Steps',       'সারসংক্ষেপ ও পরবর্তী', 480,  600,  5, false);
```

**Lesson UUIDs** — run in Supabase SQL editor:
```sql
SELECT id, title_en FROM lessons ORDER BY created_at;
```

Once inserted, the AI tutor automatically uses these for topic-anchored retrieval. No code change needed.

---

## 7. Admin Page — Quick Spec

**Route:** `/admin`
**Auth:** `users.role = 'platform_admin'` checked in `app/admin/layout.tsx`

**Tab 1 — Docs**
- List all rows from `docs_content` table (slug, title, last updated)
- Click any row → markdown `<textarea>` + preview panel
- Save button → `PUT /api/admin/docs/[slug]`

**Tab 2 — API Keys**
- 4 rows, each: slot number, masked key value ("sk-...xyz"), status badge (active/limit_used/empty), "Mark active" button, "Mark limit used" button
- Paste new key → input field → "Save" button → `PATCH /api/admin/keys`
- Only one slot can be "active" at a time; server enforces this

**Tab 3 — Logs**
- Read-only table of `admin_audit` — last 100 rows
- Columns: timestamp, action, actor, details (JSON)
- No delete, no edit

---

## 8. Server AI Fallback Chain

```
User sends chat message
  ↓
Client checks: does localStorage have a BYOA key?
  ├── YES → direct call to LLM provider from client (existing BYOA flow)
  └── NO → POST /api/chat { question, lesson_id, language }
              ↓
            Read admin_config WHERE key = 'api_keys'
            Find slot with status = 'active'
              ↓
            Call Gemini Flash with that key
              ├── Success → return { answer, sources, action }
              └── Rate-limit error → retry once with next non-limit_used slot
                    ├── Success → return answer
                    └── All slots exhausted → return { error: "AI temporarily unavailable. Add your own key in Settings." }
```

**Key stored as:**
```json
{
  "slots": [
    { "slot": 1, "key": "AIza...", "status": "active" },
    { "slot": 2, "key": "",        "status": "empty" },
    { "slot": 3, "key": "",        "status": "empty" },
    { "slot": 4, "key": "",        "status": "empty" }
  ]
}
```

Key is **never** sent to the client. `/api/chat` reads it server-side and makes the LLM call server-side.

---

## 9. Job Scraper — Quick Spec

**Script:** `scripts/job_scraper.py`
**Trigger:** run manually for the demo; `pg_cron` weekly for post-launch
**Target sites:** Bdjobs.com, Chakri.com (public listings pages only)

**What it extracts per posting:**
- Job title
- Skills / tools mentioned (keyword matching from a preset list)
- Salary range (if shown)
- Source site
- Scraped date

**What it inserts:**
```sql
INSERT INTO job_market_signals (skill, source, mention_count, week_change_pct, avg_salary_bdt, in_curriculum, status)
VALUES ('Python', 'bdjobs', 47, 23.4, 45000, true, 'pending_review');
```

**Demo safety net:** seed 20–30 rows manually with realistic data (Python, React, SQL, Git, Excel, etc.) before the demo so the dashboard always has data even if Playwright hits bot detection on the day.

**In-curriculum flag:** cross-reference scraped skills against `tracks.skills` array. Auto-set `in_curriculum = true` when there's a match.

---

## 10. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Hero demo (timestamp-seek) fails live | Medium | Critical | Pre-record screen capture; have it on standby |
| Mobile rebuild breaks OAuth | Low | High | Test auth flow end-to-end before sleeping |
| Gemini API rate-limited during demo | Medium | High | Pre-cache 30 Q&A pairs; have a backup Gemini key in slot 2 |
| Topic boundaries missing for hero videos | High | Medium | Whoever finishes first does the manual entry (§6) |
| Playwright blocked by Bdjobs bot detection | Medium | Medium | Pre-seeded rows in `job_market_signals` are the fallback; demo still works |
| `npm run build` fails | Medium | Medium | Each stream keeps build passing throughout; fix before merge |
| Git conflict at integration | Low | Medium | Only 1 active branch, push frequently, resolve inline |
| Demo video not ready | Low | High | Record early; 2h buffer at the end |

---

## 11. Post-Competition (Week 1)

If we place top 3:
- Announce publicly, add 5 more published tracks
- Open institutional pilot waitlist
- Pitch BRAC and ICT Division
- Schedule weekly Playwright job scraper via pg_cron
- Launch NRB-targeted marketing

Team commitment: platform stays live for at least 12 months post-competition.

---

*Fixeth PLAN2 — Last updated 2026-06-10*