# S2 Tasks - AI Engine, Admin, DB Schema

Source docs: `plan2.md` and `docs/PRD.md`.

## Assumptions

- `/api/chat` is the first user-facing S2 priority because it unblocks no-key learners.
- Server-side reads of `admin_config` require a Supabase service-role key in deployment.
- Existing BYOA stays available, but no-key users fall back to the platform Gemini key.
- Existing docs admin under `/docs/admin` remains untouched; S2 adds `/admin` using `docs_content`.

## Task Board

### P0 - Hero Chat Path

- [ ] Fix `20260610_plan2_schema.sql` so the topic RPC matches the current `transcript_chunks.embedding` dimension.
- [ ] Add `lib/ai/server-fallback.ts` to read active API slots and call Gemini server-side.
- [ ] Add `app/api/chat/route.ts` with Zod validation and `{ data, error }` responses.
- [ ] Update `components/screens/GuidedVideo.tsx` so no-key users call `/api/chat`.
- [ ] Preserve BYOA behavior for users who already configured a personal key.
- [ ] Verify a timestamped answer parses into clickable seek buttons.

### P1 - Topic-Anchored Retrieval

- [ ] Add `getTopicsWithChunks(lessonId)` in `lib/supabase/queries/transcript.ts`.
- [ ] Update `lib/ai/video-chat.ts` to build grouped topic context when topics exist.
- [ ] Fall back to current flat timed transcript context when topics are missing.
- [ ] Add source metadata to `/api/chat` responses for topic timestamps.

### P2 - Admin APIs

- [ ] Add shared admin guard for `users.role = 'platform_admin'`.
- [ ] Add `app/api/admin/keys/route.ts` for key save, activate, and limit-used actions.
- [ ] Enforce one active API key slot server-side.
- [ ] Add `app/api/admin/docs/[slug]/route.ts` to update `docs_content`.
- [ ] Write `admin_audit` rows for key and docs changes.

### P3 - Admin UI

- [ ] Add `app/admin/layout.tsx` with platform-admin redirect.
- [ ] Add `app/admin/page.tsx` with Docs, API Keys, and Logs tabs.
- [ ] Mask API keys in the UI and never send full keys back to the client.
- [ ] Load last 100 audit rows read-only.

### P4 - Hardening

- [ ] Add 5-minute in-memory cache for repeated `/api/chat` questions.
- [ ] Add `/api/chat` IP rate limit of 30 requests/minute.
- [ ] Run `npm run build`.
- [ ] Smoke test the full no-key chat path.

