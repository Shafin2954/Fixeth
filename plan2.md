# Fixeth — PLAN2 (Final Round, 48-Hour Sprint)
**THE INFINITY AI BUILDFEST 2026 — EdTech Track**
**Status:** Active execution plan
**Supersedes:** `plan.md` feature lists (spec lives in `docs/PRD.md`)
**Companion docs:** `docs/PRD.md` · `docs/ARCHITECTURE.md` · `docs/DATA_STRATEGY.md` · `docs/SCALABILITY_ROADMAP.md` · `docs/ETHICS.md`

---

## 0. Constraints

- **Time:** 48h, hard stop. We sleep after the pitch.
- **Team:** 3 people, all can code + do basic design. Parallel streams from minute 0.
- **Judging bias:** balanced, ~60% flash / 40% substance. Hero feature must work visually.
- **AI:** Free models only (Gemini Flash, Groq). Platform key stored in `admin_config` table, rotated manually from `/admin`.
- **Branch:** single branch, continuous pushes, resolve conflicts in real-time.
- **Deploy:** Vercel auto-deploys on push to `main`.

---

## 1. What We Are Building (48h scope)

### Must ship (no demo without these)

| # | Item | Owner |
|---|---|---|
| 1 | **Video timestamp-seek AI chat (fixed)** — topic-anchored retrieval, actual seek works | S2 |
| 2 | **Mobile-first rebuild** — Onboarding, Dashboard, Guided Video, Track Library at 375px | S1 |
| 3 | **Platform-shared AI fallback** — `/api/chat` uses `admin_config` key, no user friction | S2 |
| 4 | **Public landing page** — hero animation, 4 feature cards, CTA, mobile-perfect | S1 |
| 5 | **Admin page** — 3 tabs: Docs editor, API key rotation (4 slots, 1 active), Audit log | S2 |
| 6 | **NRB mode** — toggle in profile, dashboard card, `lesson_topics.nrb_relevant` flag | S3 |
| 7 | **All 5 docs written** — PRD, ARCHITECTURE, DATA_STRATEGY, SCALABILITY_ROADMAP, ETHICS | S3 ✅ |
| 8 | **New DB schema** — `lesson_topics`, `admin_config`, `admin_audit`, `docs_content` tables | S2 |
| 9 | **Static pricing + about pages** — no checkout, just the pitch narrative | S1 |
| 10 | **3-min demo video** — recorded, captioned EN + বাংলা | S3 |

### Ship if time allows (nice to have)

- Manual topic entry for 5 hero videos (SQL inserts, ~30–60 min of data entry — whoever has free time)
- `npm run build` clean with zero TypeScript errors
- Lighthouse mobile ≥ 90 on Guided Video
- Bengali i18n strings for NRB mode UI

### Explicitly NOT doing

- Payment processing
- Job-market Playwright scraper
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
- `components/screens/Dashboard.tsx` — mobile-first rewrite
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
- Dashboard shows streak, enrolled track, NRB mode card (when enabled)

### Stream 2 (S2) — AI engine + Admin + DB schema

**Files:**
- `supabase/migrations/20260610_plan2_schema.sql` — NEW, all new tables
- `lib/ai/server-fallback.ts` — NEW, reads `admin_config`, calls Gemini
- `app/api/chat/route.ts` — NEW (or update), uses server-fallback when no BYOA
- `app/api/admin/keys/route.ts` — NEW
- `app/api/admin/docs/[slug]/route.ts` — NEW
- `app/admin/page.tsx` — NEW, 3-tab admin UI
- `app/admin/layout.tsx` — NEW, platform_admin auth check
- `lib/supabase/queries/transcript.ts` — update `windowTranscript` for topic-anchored retrieval
- `lib/ai/video-chat.ts` — update `buildContext` to use topic groups

**Done =**
- User with no BYOA key can chat with a video and get a timestamped answer
- Admin can paste a key in slot 1, mark it active — subsequent `/api/chat` calls use it
- Admin can edit a `/docs` page and save it — the `/docs/[slug]` route serves the updated content
- `npm run build` clean

### Stream 3 (S3) — Docs, NRB, demo

**Files:**
- `docs/PRD.md` ✅ (done)
- `docs/ARCHITECTURE.md` ✅ (done)
- `docs/DATA_STRATEGY.md` ✅ (done)
- `docs/SCALABILITY_ROADMAP.md` ✅ (done)
- `docs/ETHICS.md` ✅ (done)
- `docs/PROMPTS.md` — update with v2 versioned prompts
- `plan2.md` ✅ (this file)
- `README.md` — rewrite as 1-pager
- `app/api/profile/nrb/route.ts` — NEW, toggle NRB mode
- `components/profile/nrb-toggle.tsx` — NEW, in ProfileSettings
- `lib/i18n/messages.ts` — add NRB strings
- Demo video recording (`docs/demo/`)

**Done =**
- All 5 docs are real, not empty
- NRB toggle in profile persists to `users.nrb_mode`
- Dashboard surfaces NRB card when toggled on
- `README.md` has live link, stack, rubric coverage summary
- Demo video exists in `docs/demo/` and is captioned

---

## 3. Hour-by-Hour Plan

### Day 1 (0–24h)

| Hours | S1 (UI) | S2 (AI) | S3 (Docs/NRB) |
|---|---|---|---|
| 0–2 | Install `framer-motion`. Set Tailwind mobile-first tokens. Read `GuidedVideo.tsx` fully. | Read `lib/ai/`, `lib/supabase/`, `app/api/`. Audit current transcript_chunks state. | Re-read all existing docs. Plan NRB feature scope. |
| 2–6 | Rewrite `Onboarding.tsx` mobile-first (single column, swipeable steps). | Write `supabase/migrations/20260610_plan2_schema.sql`. Apply to Supabase SQL editor. | Write `README.md` rewrite. Add NRB columns to schema (coordinate with S2). |
| 6–10 | Rewrite `Dashboard.tsx` mobile-first (hide non-core nav, show streak + track + NRB card slot). | Write `lib/ai/server-fallback.ts` + `app/api/chat/route.ts` with admin key lookup. Test with curl. | Write `docs/PROMPTS.md` v2. Start NRB toggle in `ProfileSettings`. |
| 10–14 | Rewrite `GuidedVideo.tsx` mobile — bottom-sheet for transcript/chat, video top. | Write admin API routes (`/api/admin/keys`, `/api/admin/docs/[slug]`). | Finish NRB toggle. Wire to `/api/profile/nrb`. Test persist to DB. |
| 14–18 | Rewrite `TrackLibraryScreen.tsx` mobile. Write landing page `app/(public)/page.tsx`. | Write `/app/admin/page.tsx` (3-tab UI: Docs, API Keys, Logs). | Dashboard NRB card: when `users.nrb_mode = true`, show card querying `lesson_topics WHERE nrb_relevant = true LIMIT 5`. |
| 18–22 | Add Framer Motion hero animation to landing page. Write pricing + about pages. Fix `AppChrome.tsx` hamburger nav. | End-to-end test: user with no key → chat → server key used → answer with timestamp. Fix any breaks. | Write pitch script first draft. Identify which 5 videos to manually add topics to. |
| 22–24 | EOD-1 sync. Each person demos their stream. List blockers. | EOD-1 sync. | EOD-1 sync. |

### Day 2 (24–48h)

| Hours | S1 (UI) | S2 (AI) | S3 (Docs/NRB) |
|---|---|---|---|
| 24–28 | Polish landing animations. Mobile Lighthouse test. Fix anything < 90. | Manual topic entry for 5 hero videos (SQL inserts — see §6 guide). Test seek accuracy. | Record screen capture take 1. |
| 28–32 | Final visual polish, dark/light parity, accessibility pass. | Hardening: cache top-30 Q&A, rate-limit `/api/chat` 30 req/min/IP. | Edit demo video. Add EN + বাংলা captions. |
| 32–36 | Static pages final review. `npm run build` clean. | `npm run build` clean. Push to Vercel, test on production URL. | Final pitch script polish. |
| 36–40 | Deploy check on real mobile device. | Production smoke test: admin → set key → chat → works. | Submit docs to competition portal. |
| 40–44 | **Integration** — merge any remaining conflicts, re-deploy, full flow test. | **Integration.** | **Integration.** |
| 44–47 | Buffer. Re-record demo if needed. | Buffer. | Buffer. |
| 47–48 | **Submit.** | **Submit.** | **Submit.** |

---

## 4. Rubric Coverage Map (Quick Reference)

| Rubric (weight) | What we ship | Artifact |
|---|---|---|
| Innovation (20%) | Topic-anchored RAG: any YouTube video becomes a navigable knowledge graph with clickable timestamps | `lesson_topics` table + `lib/ai/video-chat.ts` + demo |
| Technical Execution (20%) | RLS on all tables, retry-once AI fallback, admin audit log, mobile-first (≥90 Lighthouse) | `supabase/migrations/*`, `lib/ai/server-fallback.ts`, admin page |
| Business Model & Global Readiness (20%) | 3-tier pricing page, NRB diaspora strategy (15M+ potential users), institutional B2B | `/pricing`, `docs/SCALABILITY_ROADMAP.md` §3–4 |
| Real-World Impact & Ethical AI (20%) | KPIs defined, RAG no-hallucination, PII minimization, learner rights | `docs/ETHICS.md`, `docs/DATA_STRATEGY.md` |
| Scalability & NRB Collaboration (10%) | Cloud-native Vercel + Supabase, modular agents, NRB team member | `docs/ARCHITECTURE.md` §7–8 |
| Presentation (10%) | Compelling pitch, rubric map, demo video | Demo video in `docs/demo/`, pitch script §5 |

| Mandatory requirement | Status | Evidence |
|---|---|---|
| AI-Native Architecture | ✅ | All 3 agents in `lib/agents/`; AI drives video, quiz, admin |
| RAG + Graph-Based Reasoning | ✅ | pgvector cosine + PostgreSQL CTE on `lesson_topics` → `concepts` → `concept_edges` |
| Real-World Data | ✅ | Real YouTube videos, Whisper transcripts, real user behavior in Supabase |
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
| 60–90 | Dashboard, mobile, enrolled track, streak | "The dashboard knows what you know. It's already building your path." |
| 90–150 | Guided Video, type "What is a prompt?" | **Hero moment.** "Watch this. I ask a question. The AI finds the exact moment in the video where it's explained — and seeks there. [click timestamp] 14:32. That is the feature." |
| 150–180 | Toggle বাংলা subtitles | "Bengali subtitles. Real-time. Technical terms preserved in English." |
| 180–210 | Profile → NRB mode toggle → dashboard updates | "For Bangladeshis abroad — one toggle. Surfaces lessons most useful for life outside Bangladesh." |
| 210–240 | Track library, 5 published tracks | "Five published tracks. Eight more reserved in the schema." |
| 240–270 | Architecture diagram (from `docs/ARCHITECTURE.md`) | "pgvector RAG. PostgreSQL concept graph. Three MCP-style agents. No hallucination — the AI only answers from the video." |
| 270–300 | Landing page CTA, QR code | "fixeth.vercel.app. Thank you." |

**Backup plan:** if the live timestamp-seek fails, play the pre-recorded screen capture. Do not skip the feature — show the recording.

---

## 6. Manual Topic Entry Guide

For each of the 5 hero videos, watch the video and fill in the SQL below. ~5–10 topics per video. Total: ~50 SQL inserts. Estimated time: 30–60 min per person who does it.

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

**Assign NRB-relevant = true** for topics covering: freelancing, cross-border payments, working remotely, CV/resume, international job sites.

**Lesson UUIDs** are in the Supabase `lessons` table. Check them from the Supabase dashboard or run:
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

Stored in `admin_config` as: `key = 'api_keys'`, `value = <above JSON>`.

Key is **never** sent to the client. `/api/chat` reads it server-side and makes the LLM call server-side.

---

## 9. Risk Register (48h)

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Hero demo (timestamp-seek) fails live | Medium | Critical | Pre-record screen capture; have it on standby |
| Mobile rebuild breaks OAuth | Low | High | Test auth flow end-to-end on EOD-1 before sleeping |
| Gemini API rate-limited during demo | Medium | High | Pre-cache 30 Q&A pairs; have a backup Gemini key in slot 2 |
| Topic boundaries missing for hero videos | High | Medium | S3 does manual entry on Day 2 morning as first task |
| `npm run build` fails | Medium | Medium | Each stream keeps build passing throughout; fix before merge |
| Git conflict at integration | Low | Medium | Only 1 active branch, push frequently, resolve inline |
| Demo video not ready | Low | High | Start recording Day 2 morning; 2h buffer at end |

---

## 10. Post-Competition (Week 1)

If we place top 3:
- Announce publicly, add 5 more published tracks
- Open institutional pilot waitlist
- Pitch BRAC and ICT Division
- Launch NRB-targeted marketing

Team commitment: platform stays live for at least 12 months post-competition.

---

*Fixeth PLAN2 — Last updated 2026-06-10*
