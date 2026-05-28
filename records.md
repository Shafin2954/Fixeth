## Planning
1. Project draft
2. Features to keep
3. Finalizing plan
    - tech stack to use
    - system architecture

## Execution

### Current Source of Truth
- SQL tables, Supabase Auth, and finalized frontend shell integration are complete.
- Earlier records marked UI components, pages, routes, and build as complete, but those are no longer treated as completed execution phases.
- Auth uses Supabase Auth, not NextAuth, following current project direction.
- The app now uses the finalized UI from `frontend/` instead of the older root `app/` and `components/` dashboard shell.
- Supabase currently syncs auth user profile, onboarding completion, preferred language, and preferred theme.
- Feature data wiring is still pending; many finalized UI panels still use local/static demo data.
- BYOA and payment processing are excluded by `AGENTS.md`, even where older metaprompt sections mention them.

### Phase 1: SQL Foundation ✅
**Completed:**
- ✅ Supabase PostgreSQL schema tables
- ✅ pgvector extension and `transcript_chunks` vector table
- ✅ RLS planned for user-scoped tables

**Still verify after clean rerun:**
- [ ] `match_transcript_chunks` RPC exists
- [ ] `get_concept_path` RPC exists
- [ ] RLS policies exist for `enrollments`, `learner_mastery`, `progress`, `quiz_results`, and `submissions`

### Phase 2: Auth ✅
**Completed:**
- ✅ Supabase Auth selected as the auth system
- ✅ GitHub OAuth configured
- ✅ Google OAuth configured
- ✅ Login/signup flow uses Supabase OAuth

**Still verify:**
- [ ] Auth callback redirects correctly after the clean DB reset
- [ ] User profile row creation/sync works with the new `users` schema
- [ ] `users` RLS/read-write policy is compatible with profile updates

### Phase 3: i18n + Theme System (Partial)
- [x] Finalized frontend local English/Bengali translation map
- [ ] `next-intl` wiring
- [x] Language toggle persisted to `users.preferred_language`
- [x] Finalized frontend dark/light theme state
- [x] Theme toggle persisted to `users.preferred_theme`

### Phase 4: Finalized UI Shell ✅
**Completed:**
- ✅ `/dashboard` renders the finalized `frontend/src/App.tsx` shell
- ✅ `/onboarding` renders the same finalized shell for signup redirects
- ✅ `/` redirects into `/dashboard`
- ✅ Supabase session guard redirects signed-out users to `/login`
- ✅ Sign out uses Supabase Auth and returns to `/login`

**Still refine:**
- [ ] Remove or replace BYOA visual references to match `AGENTS.md`
- [ ] Decide whether old root dashboard/components should be deleted after the new shell is stable
- [ ] Confirm mobile nav behavior from the finalized UI

### Phase 5: Onboarding (Partial)
- [x] 5-step finalized onboarding flow mounted
- [x] Goal and experience collection
- [x] Track selection
- [x] Diagnostic assessment
- [x] Onboarding completion persisted to Supabase `users.onboarding_complete`
- [ ] Curriculum Agent integration after onboarding

### Phase 6: Dashboard
- [ ] Continue learning card
- [ ] Stats grid
- [ ] Track cards from Supabase data
- [ ] Recommended next lesson
- [ ] Job market feed
- [ ] Mentor prompt panel

### Phase 7: Guided Video Workspace
- [ ] 3-column lesson layout
- [ ] YouTube IFrame player
- [ ] Notes tab
- [ ] Transcript tab
- [ ] Chat with Video tab
- [ ] Practice tab

### Phase 8: Video Timestamp Intelligence
- [ ] Embed learner query
- [ ] Query `match_transcript_chunks`
- [ ] Return timestamped source chunks
- [ ] Seek video from AI response
- [ ] Show timestamp badge after seek

### Phase 9: Transcript + Subtitle Pipeline
- [ ] YouTube captions fetch
- [ ] Whisper fallback
- [ ] Chunking and embeddings insert
- [ ] Bengali GPT-4o translation
- [ ] Quality gate
- [ ] VTT upload to Supabase Storage
- [ ] Subtitle overlay polling every 250ms

### Phase 10: Curriculum Agent
- [ ] Seed Data Science concepts
- [ ] Seed concept edges
- [ ] Traverse graph with `get_concept_path`
- [ ] Build adaptive path
- [ ] Persist `adaptive_paths`

### Phase 11: Tutor Agent
- [ ] RAG-grounded lesson answers
- [ ] Bengali/English response handling
- [ ] Timestamp action selection
- [ ] Quiz question generation
- [ ] Source chunk reporting

### Phase 12: Quiz + Assessment
- [ ] Quiz item loader
- [ ] Quiz result persistence
- [ ] Mastery score updates
- [ ] Code assessment path
- [ ] Assessment Agent feedback

### Phase 13: Submissions
- [ ] Submission list view
- [ ] New submission upload to Supabase Storage
- [ ] Submission detail view
- [ ] Rubric tab
- [ ] AI feedback tab
- [ ] Peer review tab

### Phase 14: AI Mentor
- [ ] Session history
- [ ] Level selector
- [ ] Context pills
- [ ] Quick prompts
- [ ] Voice input
- [ ] Markdown/code rendering

### Phase 15: Notebook
- [ ] JupyterLite iframe
- [ ] Notebook toolbar
- [ ] Theme sync
- [ ] Library install modal

### Phase 16: Code Space
- [ ] GitHub repo listing
- [ ] Starter template list
- [ ] Codespace launch state machine
- [ ] Open/stop Codespace actions
- [ ] Alternative coding services grid

### Phase 17: Tools & Resources
- [ ] Indeed/job market status
- [ ] Cloud service OAuth connect buttons
- [ ] Resource library
- [ ] Track-based resource filtering

### Phase 18: Portfolio + Certificates
- [ ] Public profile page
- [ ] Certificate verification page
- [ ] Certificate PDF generation
- [ ] LinkedIn certificate link
- [ ] QR code verification

### Phase 19: Job Market Agent
- [ ] Playwright scraper
- [ ] Weekly scheduled job
- [ ] Skill trend persistence
- [ ] Admin review status flow

## 2026-05-28

### Done
- Mounted finalized `frontend/` UI inside the Next.js app through `components/finalized-frontend-shell.tsx`.
- Replaced the old `/dashboard` page with the finalized frontend shell.
- Added `/onboarding` route so Supabase signup redirects land on the finalized onboarding flow.
- Redirected `/` to `/dashboard`.
- Wired Supabase Auth session loading, profile row upsert, onboarding completion, language/theme persistence, and sign out.
- Fixed small frontend TypeScript blockers needed for Next build compatibility.
- Excluded the generated `frontend/` submodule from root ESLint while keeping imported code covered by TypeScript/build.

### Verified
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

### Next
- Run the clean Supabase schema and verify the `users` RLS policy allows profile upsert/update.
- Replace static dashboard/course data with queries from `lib/supabase/queries/`.
- Remove BYOA UI references or convert them to the approved platform-AI flow.
- Start wiring onboarding output to Curriculum Agent path generation.


