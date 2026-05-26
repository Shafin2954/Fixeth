## Planning
1. Project draft
2. Features to keep
3. Finalizing plan
    - tech stack to use
    - system architecture

## Execution

### Phase 1: Infrastructure & Setup ✅
1. Created project repo with AGENTS.md (common agent instructions)
2. plan.md (full project outline)
3. records.md (progress tracking)

### Phase 2: Auth & DB ✅
**Completed:**
- ✅ Supabase deployed (schema running with all tables + indexes)
- ✅ Supabase clients (utils/supabase/server.ts, client.ts)
- ✅ **Switched to Supabase Auth** (removed NextAuth, simpler approach)
- ✅ OAuth ready for GitHub & Google

### Phase 3: UI Components ✅
**Completed:**
- ✅ Navbar, TrackCard, LessonList, DashboardStats, DashboardLayout
- ✅ i18n files (en.json, bn.json)
- ✅ i18n config (i18n.ts)

### Phase 4: Pages & Routes ✅
**Completed:**
- ✅ Root layout & home page
- ✅ Login page — `supabase.auth.signInWithOAuth('google' | 'github')`
- ✅ Signup page — Same OAuth flow, redirects to /onboarding
- ✅ Dashboard page (dynamic, on-demand)
- ✅ Tracks listing (queries Supabase DB)
- ✅ Build succeeds ✓

**Tech Stack Verified:**
- Next.js 16.2.6
- Supabase Auth (GitHub, Google, Email/Magic Link)
- PostgreSQL + pgvector
- Tailwind + shadcn/ui

### Phase 5: Setup OAuth (IN PROGRESS)
**Next Steps (See SUPABASE_AUTH_SETUP.md):**
- [ ] Create GitHub OAuth App → Get credentials
- [ ] Add GitHub to Supabase (Project Settings → Auth → Providers)
- [ ] Create Google OAuth credentials → Get credentials
- [ ] Add Google to Supabase (Project Settings → Auth → Providers)
- [ ] Test login/signup locally

### Phase 6: Core Features (Coming Next)
- [ ] Onboarding flow (diagnostic test, track selection)
- [ ] Lesson detail page with video player
- [ ] Agent stubs (curriculum, tutor, assessment) — MCP servers
- [ ] RAG pipeline (YouTube → Whisper → pgvector)
- [ ] Concept graph traversal


