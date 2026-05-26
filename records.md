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
- ✅ Middleware for session refresh (middleware.ts)
- ✅ NextAuth v5 with SupabaseAdapter
- ✅ OAuth providers (Google, GitHub) — ready for credentials
- ✅ Auth API routes (app/api/auth/[...nextauth]/route.ts)

### Phase 3: UI Components ✅
**Completed:**
- ✅ Navbar, TrackCard, LessonList, DashboardStats, DashboardLayout
- ✅ i18n files (en.json, bn.json) with Bengali translations
- ✅ i18n config (i18n.ts)

### Phase 4: Pages & Routes ✅
**Completed:**
- ✅ Root layout & home page
- ✅ Login page (app/login/page.tsx) — Google + GitHub OAuth
- ✅ Signup page (app/signup/page.tsx) — Google + GitHub OAuth
- ✅ Dashboard page (app/dashboard/page.tsx) — Stats + Get Started
- ✅ Tracks listing (app/tracks/page.tsx) — Server-side page, queries DB
- ✅ Build succeeds with no errors (npm run build ✓)

**Tech Stack Verified:**
- Next.js 16.2.6 (App Router)
- TypeScript + Tailwind
- Supabase (PostgreSQL + Auth + Storage)
- NextAuth v5 + @auth/supabase-adapter
- next-intl for i18n

### Phase 5: Next Steps (Coming Soon)
- [ ] Add OAuth credentials to .env.local (Google Client ID/Secret, GitHub Client ID/Secret)
- [ ] Test login/signup flow
- [ ] Build onboarding (diagnostic test, track selection)
- [ ] Lesson detail page with video player
- [ ] Agent stubs (curriculum.ts, tutor.ts, assessment.ts) — MCP servers
- [ ] RAG pipeline (Whisper → pgvector embeddings)
- [ ] Concept graph traversal logic
- [ ] Assessment system


