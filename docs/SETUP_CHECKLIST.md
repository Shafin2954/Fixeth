# Fixeth Setup Checklist

## Phase 2 Complete: Auth & DB Infrastructure ✅

### What's Done
- **DB Schema**: Complete Supabase PostgreSQL schema with pgvector, users, tracks, concepts, lessons, enrollments
- **Supabase Clients**: Server-side (RSC) and client-side Supabase initialization
- **Types**: All core types defined (User, Track, Lesson, Enrollment, etc.)
- **Query Helpers**: Basic CRUD functions for users, tracks, lessons in `lib/supabase/queries/`
- **UI Components**: Basic dashboard, track, lesson, navbar components
- **i18n**: English & Bengali translation strings ready
- **.env.local**: Template created (you need to fill Supabase credentials)

### Next Steps

#### 1. **Supabase Setup** (Required BEFORE testing)
1. Create a Supabase project at https://supabase.com
2. Get your credentials from Project Settings → API
3. In `.env.local`, replace:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   SUPABASE_SERVICE_KEY=YOUR_SERVICE_ROLE_KEY
   ```
4. Run migration: Go to Supabase SQL Editor → paste `supabase/migrations/20260527_init_schema.sql` → Execute
5. Verify tables in "Tables" section

#### 2. **NextAuth v5 Setup** (For login/signup)
```bash
npm install next-auth@beta @auth/core
```
Create `lib/auth.ts`:
- Google OAuth provider
- GitHub OAuth provider
- Email/password (optional for now)
- Session storage in Supabase

#### 3. **Next.js Layouts** (Structure pages)
- `app/(auth)/` — login, signup, onboarding
- `app/(dashboard)/` — dashboard, my tracks, profile
- `app/tracks/` — public track listing
- `app/admin/` — curriculum management (platform_admin only)

#### 4. **Test with Sample Data**
Insert sample tracks & concepts into Supabase to test queries and UI.

### File Structure Created
```
lib/
├── supabase/
│   ├── server.ts         ✅ RSC client
│   ├── client.ts         ✅ Client-side client
│   └── queries/
│       ├── users.ts      ✅
│       ├── tracks.ts     ✅
│       └── lessons.ts    ✅
├── i18n/
│   ├── en.json           ✅
│   └── bn.json           ✅
└── agents/               (Next)

components/
├── shared/navbar.tsx     ✅
├── track/track-card.tsx  ✅
├── lesson/lesson-list.tsx ✅
└── dashboard/
    ├── dashboard-stats.tsx      ✅
    └── dashboard-layout.tsx     ✅

types/index.ts                   ✅

supabase/
└── migrations/
    └── 20260527_init_schema.sql ✅
```

### Environment Variables Needed
```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# LLM APIs (for later phases)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Blocked On
- NextAuth v5 setup (waiting for OAuth provider credentials)
- Sample data in Supabase (for testing UI)
- Next.js page/layout structure (ready to implement when auth is set)
