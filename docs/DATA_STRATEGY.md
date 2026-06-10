# Fixeth — Data Strategy & Privacy
**Version:** 2.0 — Final Round
**For:** THE INFINITY AI BUILDFEST 2026 — EdTech Track
**Companion to:** `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ETHICS.md`

---

## 1. Data Sources

| Source | Method | What we collect | Update frequency | Stored where |
|---|---|---|---|---|
| **YouTube** | YouTube Data API v3 + yt-dlp | Video metadata, captions, audio (for transcription) | Per video, on-demand | `lessons` table, `audio/` Supabase Storage |
| **Audio** | OpenAI Whisper (local, `scripts/youtube_server.py`) | Transcript text with sentence-level timestamps | Per video, one-time | `transcript_chunks` table |
| **Job postings** (post-launch) | Playwright scraper (Bdjobs, Chakri, Indeed, LinkedIn) | Title, skills, salary, no PII | Weekly automated | `job_market_signals` table (schema reserved) |
| **Bdjobs / Chakri** (post-launch) | Playwright | Same as above | Weekly | `job_market_signals` table |
| **User uploads** | Browser → Supabase Storage | Submissions (.ipynb, .py, .pdf, .zip, max 50MB), avatars | Per user action | `notebooks/`, `submissions/`, `avatars/` |
| **User behavior** | First-party events | Lesson completion, quiz scores, chat interactions, page views | Real-time | `progress`, `quiz_results`, future `events` table |
| **User profile** | Sign-up + onboarding | Name, email, language, theme, goal, experience level, NRB mode, country | On change | `users` table |
| **Admin config** | Admin UI → Supabase | AI fallback keys, /docs markdown, audit log | On admin action | `admin_config`, `docs_content`, `admin_audit` |
| **Topic boundaries** | Manual entry (`/admin/topics` or SQL) | Per-lesson topic labels, start/end timestamps, NRB relevance flags | Per lesson | `lesson_topics` table |

---

## 2. Data Minimization (PII Policy)

**Core principle:** collect the minimum data required to deliver the learning experience. Nothing more.

### 2.1 What we collect
- **Required for auth:** email, name (from OAuth or user input), avatar URL.
- **Required for personalization:** language preference, theme preference, learning goal, experience level, NRB mode (opt-in), country code (opt-in, for NRB).
- **Required for progress tracking:** lesson completion %, quiz scores, streak, last active timestamp.
- **Required for AI features:** chat history (transient, not stored long-term beyond session).

### 2.2 What we do NOT collect
- No phone numbers.
- No government ID or national ID number.
- No biometric data.
- No financial information (no payment processing in v2.0).
- No precise geolocation (only country code, opt-in, for NRB).
- No device fingerprinting beyond standard auth cookies.
- No third-party tracking pixels or analytics scripts that follow users off-platform.

### 2.3 What we do NOT do with user data
- We do not sell user data to any third party.
- We do not share user data with advertisers.
- We do not use user data to train third-party LLMs.
- We do not store BYOA API keys on our servers (browser `localStorage` only).

---

## 3. Privacy Safeguards

### 3.1 Row-Level Security (RLS)

Every user-scoped table has RLS enabled. Users can only read/write their own rows.

```sql
-- Example: enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own enrollments" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own enrollments" ON enrollments
  FOR UPDATE USING (auth.uid() = user_id);
```

**Tables with RLS enabled:**
- `users`, `enrollments`, `learner_mastery`, `progress`, `quiz_results`, `submissions`, `notebooks`, `adaptive_paths`, `admin_audit` (read-only for non-admins).

**Tables without RLS (public read, admin write):**
- `tracks`, `modules`, `lessons`, `concepts`, `concept_edges`, `quiz_items`, `transcript_chunks`, `lesson_topics`, `subtitles`, `docs_content` (public read), `job_market_signals` (public read, admin write).

### 3.2 Admin Access

- `users.role` is the single source of truth for admin status.
- The `FIXETH_ADMIN_EMAILS` env var seeds the initial admin list at deploy time.
- Admins can read all `admin_audit` and `admin_config` rows.
- Admins cannot impersonate learners (no "view as user" feature).
- Every admin action appends to `admin_audit` with timestamp, action, details, and actor email.

### 3.3 BYOA Key Handling

- User BYOA keys are stored in **browser `localStorage` only**.
- They are **never transmitted to Fixeth servers** in any API call.
- The `/api/chat` endpoint accepts a `use_byoa: true` flag; the client then makes a direct HTTPS call to the LLM provider with the locally-stored key.
- Platform-shared AI keys (in `admin_config`) are server-side only and never exposed to the client.

---

## 4. Data Retention

| Data type | Retention | Reason |
|---|---|---|
| User profile | Until account deletion | Core product |
| Auth session | 30 days (Supabase default) | Standard |
| Lesson progress | Until account deletion | Required for adaptive path |
| Quiz results | Until account deletion | Required for mastery tracking |
| Chat history (transient) | 24 hours in memory, not persisted | Privacy by design — we do not store chat |
| Admin audit log | 1 year | Compliance |
| Job market signals (post-launch) | 90 days, then aggregated to monthly | Stale data is removed |
| Submissions | Until certificate issued, then archived 2 years | Credential verification |

**Account deletion:** a "Delete my account" button in profile settings. On click, all user-scoped rows are deleted (cascade), `auth.users` row is deleted via Supabase Auth API, and the email is added to a suppression list to prevent re-registration with the same email (if requested).

---

## 5. RAG & Embedding Data Strategy

### 5.1 What gets embedded
- Whisper transcripts of curated YouTube videos.
- 768-dim embeddings (Ollama `nomic-embed-text`).
- Stored in `transcript_chunks` with `lesson_id`, `start_time`, `end_time`, `chunk_text`, `embedding`.
- Per-lesson topic boundaries in `lesson_topics` (not embedded themselves, but used to group chunks for topic-anchored retrieval).

### 5.2 What does NOT get embedded
- User-generated content (submissions, chat messages).
- User profile data.
- Quiz answers or diagnostic responses.
- Admin audit logs.

### 5.3 Vector index
- `ivfflat` index on `embedding` with `vector_cosine_ops`, `lists = 100`.
- Cosine similarity threshold for retrieval: **0.7** (filters out weak matches).
- Top-K for retrieval: **3 topics** (then expanded to ~5 chunks per topic).

### 5.4 Re-embedding policy
- Videos are re-embedded once on initial ingest.
- Re-embedding is triggered if: (a) the source video caption is updated, (b) the embedding model is upgraded, (c) the chunking strategy changes.
- Re-embedding is **never** triggered by user data — the embedding corpus is content-only.

---

## 6. Job Market Scraping (Post-Launch, Schema Reserved)

### 6.1 Sources
- **Bdjobs.com** — Bangladesh's largest job board.
- **Chakri.com** — secondary BD job board.
- **Indeed.com** — international, with BD filter.
- **LinkedIn** — public postings only (no API access in v2.0).

### 6.2 Method
- Playwright (handles JS-heavy boards that basic HTTP scrapers miss).
- Weekly cron via Supabase `pg_cron` (Mondays 09:00 BST).
- Extracts: job title, skills mentioned, salary range (when listed), company name, posting date.
- **No PII collected:** no applicant names, no email addresses, no phone numbers, no profile URLs.

### 6.3 Storage
- `job_market_signals` table with `skill`, `source`, `mention_count`, `week_change_pct`, `avg_salary_bdt`, `in_curriculum`, `status`.
- Weekly snapshot compared to previous week for trend detection.
- Rising skills (>15% WoW) flagged for admin review.
- Declining skills (<-15% WoW) flagged for de-emphasis.

### 6.4 Privacy
- No personal data of job applicants or employers is stored.
- Public postings only — no private recruiter views.
- Compliant with the public-information principle under GDPR and Bangladesh's Digital Security Act.

---

## 7. Compliance

### 7.1 GDPR (EU users, including NRBs in EU)
- Right to access: users can download their data via profile settings.
- Right to deletion: see §4 above.
- Right to portability: JSON export of profile + progress + quiz results.
- Data minimization: see §2 above.
- Lawful basis: consent (sign-up = consent to data processing for the learning service).
- Data Protection Officer: not required at current scale; contact email on the privacy page.

### 7.2 Bangladesh Digital Security Act 2018 (BD users)
- We are not a "critical information infrastructure" subject.
- We comply with data localization: all data is stored in Supabase (Singapore region for v2.0; can be moved to BD region if and when Supabase offers it).
- We do not process communications content (chat is transient).
- We do not retain personal data beyond the legitimate purpose.

### 7.3 Children's data
- Minimum age: 13 (or 16 if GDPR applies).
- Users under 18 must have parental consent (sign-up flow requires confirmation).
- We do not knowingly collect data from children under 13.
- Parents can request deletion via the support email.

### 7.4 AI-specific compliance
- EU AI Act: Fixeth is a "limited risk" AI system (educational). Transparency obligations met by: source citation on every RAG response, visible AI indicators in the UI, public model selection rationale in `docs/ARCHITECTURE.md`.
- Bangladesh National AI Policy 2024 (draft): we align with the "human-centric, transparent, accountable" principles.

---

## 8. Subtitle Translation Pipeline

### 8.1 Source
- English captions from YouTube (when available) — `captions` API endpoint.
- Whisper transcription (when no captions) — `scripts/youtube_server.py`.

### 8.2 Translation
- Model: Gemini 2.0 Flash (free tier, multilingual).
- Glossary: 50–100 technical terms preserved in English (e.g. "useState", "DataFrame", "API", "Git", "return", "function").
- Output: Bengali text, max 12 words per subtitle segment for readability.

### 8.3 Quality Gate (post-launch)
- Subtitle Quality Agent scores: fluency (0.4) + accuracy (0.4) + term preservation (0.2).
- Score ≥ 0.85 → auto-publish.
- Score < 0.85 → human review queue (admin page, post-launch).
- Learners can flag "Incorrect translation" → feeds the review queue.

### 8.4 Storage
- WebVTT format in Supabase Storage (`vtt/` bucket).
- Per-lesson, per-language, with `quality_score` and `auto_published` flags.
- Served by `/api/subtitle?lesson_id=&lang=` with 24h cache.

### 8.5 Privacy
- Source captions and translations are public-readable (no PII).
- Quality scores are admin-readable only.
- Review queue is admin-only.

---

## 9. Bias Mitigation

### 9.1 In the AI tutor
- **Source grounding:** RAG constrains answers to retrieved chunks. No external knowledge. The model cannot "import" stereotypes from its training data because it has no access to them in the prompt.
- **Language symmetry:** the system prompt explicitly enforces the user's language. Bengali queries get Bengali answers; English queries get English answers. No code-switching unless the glossary specifies.
- **Threshold for retrieval:** 0.7 cosine similarity. Below threshold, the system says "I couldn't find this in the video" rather than fabricating.
- **No demographic inputs:** the AI tutor is not given the learner's gender, ethnicity, religion, or location. Only the question, lesson, and language.

### 9.2 In the personalization engine
- **Mastery-based, not demographic-based:** skipping lessons is based on diagnostic scores and quiz performance, not on the learner's profile.
- **No filter bubble:** the adaptive path follows the concept graph, not the learner's prior clicks. We do not optimize for engagement at the cost of breadth.
- **Cross-track memory is transparent:** if a learner mastered Python in Data Science, Backend skips it. This is shown to the learner with a reason: "Already mastered."

### 9.3 In job market signals (post-launch)
- Skill frequency counts, not company-by-company bias.
- Admin review before any curriculum change — no auto-insertion.
- Salary benchmarks are medians, not skewed by outliers.

### 9.4 In the Bengali translation
- Glossary-enforced term preservation prevents "translating" technical concepts into ambiguous Bengali.
- Quality scoring is multi-dimensional (fluency + accuracy + term preservation) to catch different failure modes.
- Learner flag → human review closes the loop.

---

## 10. Transparency

### 10.1 To learners
- Every AI response includes a source citation: "Source: ~14:32 in this video."
- The "I couldn't find this in the video" message is shown when retrieval fails — no silent fallback to general knowledge.
- The adaptive path shows which concepts were skipped and why: "Skipped 4 concepts (you already scored >80%)."
- BYOA status is visible in profile: "Using your Gemini key" vs. "Using Fixeth's shared key (free, rate-limited)."
- Admin can be contacted for data access, deletion, or complaints via the contact page.

### 10.2 To judges
- All prompts are documented in `docs/PROMPTS.md` with version history.
- All model choices are documented in `docs/ARCHITECTURE.md` §7.
- All data sources are documented in this file.
- All ethical safeguards are documented in `docs/ETHICS.md`.
- The PRD claims map directly to the rubric in `docs/PRD.md` §14.

### 10.3 To admins
- Every admin action is logged in `admin_audit`.
- Audit log is read-only for non-admins.
- Audit log retention: 1 year.

---

## 11. Data Subject Rights Implementation

| Right | How implemented | Where to find it |
|---|---|---|
| Right to access | `/api/profile/export` returns JSON of all user-scoped data | Profile settings → "Download my data" |
| Right to rectification | Users can edit their own profile fields | Profile settings |
| Right to deletion | `DELETE /api/profile` cascades to all user-scoped tables | Profile settings → "Delete my account" |
| Right to portability | Same export as access, in JSON | Profile settings → "Download my data" |
| Right to object | "Opt out of personalization" toggle in profile | Profile settings |
| Right to restrict processing | "Pause my progress" toggle (not delete) | Profile settings |
| Right to withdraw consent | Toggle off AI features; toggle off NRB mode | Profile settings |
| Right to complain | Contact email on `/about` page | `/about` |

---

## 12. Open Data Items (post-competition)

- Public dataset of common learner misconceptions (anonymized) — for EdTech research.
- Public dashboard of job market skill trends (post-launch, scraper live).
- Open-source release of the topic-extraction agent (after competitive advantage is established).

---

*Fixeth Data Strategy v2.0 — Last updated 2026-06-10*
