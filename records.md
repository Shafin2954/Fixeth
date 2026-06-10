## 2026-05-30 — Video intelligence, real Notebook & GitHub Codespace

### Supabase wiring fixed
- Real curriculum/auth/enrollment/progress data lives in project `oxfynuytsnifqqhbmpcv`.
  The v0-connected integration (`nrahjflthceovpulydlc`) is EMPTY; its injected
  `NEXT_PUBLIC_SUPABASE_URL/KEY` were pointing the app at the wrong project.
- New `lib/supabase/config.ts` is the single source of truth. It defaults to the
  data project and only honors `NEXT_PUBLIC_SUPABASE_DATA_URL` / `_DATA_KEY`
  overrides (NOT the generic vars). `client.ts`, `server.ts`, `middleware.ts`,
  and `app/auth/callback/route.ts` all import from it.

### Course provider ↔ live data (already in place, verified)
- `course-provider.tsx` fetches real modules/lessons; `markLessonComplete()`
  upserts `progress` and recomputes `enrollments.progress_percent`. Wired to the
  GuidedVideo "Mark Complete" button.

### Video intelligence (NEW)
- `lib/supabase/queries/transcript.ts` — fetches `transcript_chunks` per lesson.
- `lib/ai/byoa.ts` — client-side BYOA LLM (Gemini REST + Ollama) using the user's
  own key from `preferences.ai`. Zero server inference cost.
- `lib/ai/video-chat.ts` — keyword retrieval over transcript, prompt building,
  and timestamp-chip parsing of answers.
- `GuidedVideo.tsx` — Transcript tab now renders real chunks with live highlight
  of the current segment; clicking a line seeks the player. Chat-with-Video calls
  the BYOA model with retrieved transcript context; answer timestamps become
  clickable jump chips. Progress bar is real (current/duration, click to seek).
- `youtube-player.tsx` — added `getDuration()` to the handle + `onReady` wiring.

### Notebook — real Python (NEW)
- `lib/notebook/pyodide.ts` — boots Pyodide (CPython in WASM) from CDN; runs cells,
  auto-loads imported packages (numpy/pandas), captures stdout/stderr.
- `lib/supabase/queries/notebooks.ts` — save/list/delete notebooks to the
  `notebooks` table (per-user) with localStorage mirror/fallback.
- `Notebook.tsx` — rewritten: notebook list sidebar, create/open/save/delete,
  add/move/delete cells, real per-cell execution, kernel status.

### Codespace — GitHub connected (NEW)
- `lib/github/client.ts` — BYOA Personal Access Token (browser-only) → list repos,
  list files, read file contents via GitHub REST.
- `Codespace.tsx` — rewritten: Connect-GitHub modal, repo list, loads real repo
  files into the editor, terminal `python` runs the real Pyodide interpreter.

### TODO / requires user action
- Run `supabase/migrations/20260602_notebooks_and_publish.sql` in the
  `oxfynuytsnifqqhbmpcv` SQL editor (this project is NOT reachable via v0's
  Supabase MCP). It publishes the Git course (`git-version-control`) and creates
  the `notebooks` table + RLS. Until then: Git course stays hidden and notebooks
  persist via localStorage only.

## 2026-06-10 — S2 P0 Tasks Completed

- Fixed `20260610_plan2_schema.sql` topic RPC dimension (already matched 1536).
- Added `lib/ai/server-fallback.ts` to read active API slots and call Gemini server-side.
- Added `app/api/chat/route.ts` with Zod validation and `{ data, error }` responses.
- Updated `components/screens/GuidedVideo.tsx` so no-key users call `/api/chat` (preserves BYOA behavior).
- Verified a timestamped answer parses into clickable seek buttons (via `parseAnswerSegments` in video-chat.ts).
- Added `getTopicsWithChunks(lessonId)` in `lib/supabase/queries/transcript.ts`.

## 2026-06-10 — S2 P1 Tasks Completed

- Added `getTopicsWithChunks(lessonId)` in `lib/supabase/queries/transcript.ts`.
- Updated `lib/ai/video-chat.ts` to build grouped topic context when topics exist.
- Updated `lib/ai/video-chat.ts` to fall back to current flat timed transcript context when topics are missing.
- Updated `app/api/chat/route.ts` to use topic-anchored retrieval when topics exist.
- Added source metadata to `/api/chat` responses for topic timestamps.

## 2026-06-10 — S2 P2 Tasks Completed

- Added shared admin guard for `users.role = 'platform_admin'` (via `isPlatformAdmin` function).
- Added `app/api/admin/keys/route.ts` for key save, activate, and limit-used actions.
- Enforced one active API key slot server-side in keys route.
- Added `app/api/admin/docs/[slug]/route.ts` to update `docs_content`.
- Write `admin_audit` rows for key and docs changes in both admin routes.

## 2026-06-10 — S2 P3 Tasks Completed

- Added `app/admin/layout.tsx` with platform-admin redirect.
- Added `app/admin/page.tsx` with Docs, API Keys, and Logs tabs.
- Masked API keys in the UI (showing only first 4 chars + "...").
- Load last 100 audit rows read-only and display in admin UI.

## 2026-06-10 — S2 P4 Tasks Completed

- Added 5-minute in-memory cache for repeated `/api/chat` questions.
- Added `/api/chat` IP rate limit of 30 requests/minute.
- Successfully ran `npm run build`.
- Smoke test of full no-key chat path pending manual verification.

## 2026-06-11 — Data Population Tasks Completed

- Processed 14 Whisper JSON files in the `/files` directory to generate INSERT statements for the `transcript_chunks` table.
  - Each statement automatically finds the correct `lesson_id` by matching the `youtube_video_id` from the `lessons` table.
  - The generated SQL is in `supabase/migrations/generated_transcript_inserts.sql`.

- Generated INSERT statements for the `lesson_topics` table from the `lesson_topics.md` file.
  - Processed 13 videos with a total of 189 topics.
  - The generated SQL is in `supabase/migrations/20260613_populate_lesson_topics.sql`.

These steps prepare the database for the chat-with-video feature by populating the necessary transcript and topic data.