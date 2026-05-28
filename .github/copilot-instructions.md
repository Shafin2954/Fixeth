# Copilot Instructions for Fixeth

## Quick Reference

**Project:** Fixeth — A Bengali-first, career-track adaptive LMS combining AI-powered learning paths, video intelligence, and graph-based concept reasoning.

**Tech Stack:** Next.js 14 (Backend + Auth only), Vite React (Frontend SPA), TypeScript, Tailwind, shadcn/ui, Supabase (PostgreSQL + Auth), pgvector (RAG), Claude/OpenAI APIs

**Competition:** THE INFINITY AI BUILDFEST 2026 — EdTech Track

**Architecture:** Root is an API-only backend. All UI is rendered from the `@frontend` Vite submodule (git submodule).

---

## Build & Run

### Local Development

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Start dev server (http://localhost:3000)
# Runs Next.js root at 3000, which renders the Vite frontend
npm run dev

# Production build (root)
npm run build

# Start production server
npm start

# Linting (ESLint)
npm run lint
```

**Note:** The frontend is a separate Vite React app. Run `npm run dev` in `/frontend` separately if developing the UI in isolation.

---

## Architecture Overview

### Root App (Next.js 14) — Backend Only

```
┌─────────────────────────────────────────────────────┐
│ Root: Next.js 14 Backend + Auth Layer               │
│ - app/page.tsx: Root redirect (checks auth)         │
│ - app/api/: All backend API routes                  │
│ - app/dashboard: Mounts FrontendApp (protected)     │
│ - app/onboarding: Mounts FrontendApp (protected)    │
│ - app/[...catchAll]: Catch-all → FrontendApp       │
├─────────────────────────────────────────────────────┤
│ Frontend: Vite React SPA (git submodule @frontend/) │
│ - src/App.tsx: Single-page app (handles routing)   │
│ - src/components/: All UI screens (login, dash,    │
│   quiz, notebook, mentor, etc.)                    │
│ - src/lib/: Client-side utils (Supabase, i18n)     │
├─────────────────────────────────────────────────────┤
│ Data Layer (Supabase PostgreSQL + pgvector)        │
│ - Users, Enrollments, Progress                     │
│ - Concepts, Lessons, Concept Dependency Graph      │
│ - transcript_chunks (pgvector): RAG corpus         │
│ - learner_mastery: adaptive progress tracking      │
├─────────────────────────────────────────────────────┤
│ Utilities & Infrastructure                         │
│ - lib/supabase/: DB clients & queries              │
│ - lib/i18n/: Multilingual strings (EN, BN)         │
│ - lib/rag/: Vector search & embeddings             │
│ - lib/graph/: Concept graph traversal (CTE)        │
│ - lib/agents/: MCP agents (Curriculum, Tutor)      │
└─────────────────────────────────────────────────────┘
```

### How UI Routing Works

1. **Unauthenticated users:** Root page checks auth → if no session, FrontendShell renders frontend's login UI
2. **Authenticated users:** All routes mount `FrontendApp` via `FinalizedFrontendShell` component
3. **Frontend routing:** Internal routing (login → signup → onboarding → dashboard → tracks → lessons) is **all client-side** in the Vite app's `App.tsx`
4. **Catch-all route:** `app/[...catchAll]/page.tsx` mounts the frontend for any route not explicitly defined

### Key Integration Point

**FinalizedFrontendShell** (`components/finalized-frontend-shell.tsx`):
- Checks Supabase auth session
- Redirects unauthenticated users appropriately
- Passes user data to FrontendApp
- Syncs user preferences (language, theme) to Supabase
- Handles logout and session management

---

## File Structure

### Root App (Backend Focus)

```
app/
├── page.tsx                    ← Root redirect + auth check
├── dashboard/page.tsx          ← Mounts frontend (protected)
├── onboarding/page.tsx         ← Mounts frontend (protected)
├── [... catchAll]/page.tsx     ← Catch-all → mounts frontend
├── api/                        ← All backend routes
│   ├── auth/                   ← Supabase auth callbacks
│   ├── tutor/                  ← Tutor agent
│   ├── assessment/             ← Assessment agent
│   └── ...
├── layout.tsx
└── globals.css

lib/
├── supabase/
│   ├── server.ts               ← RSC client
│   ├── client.ts               ← Client-side client
│   └── queries/                ← DB query functions
├── i18n/                       ← EN/BN strings
├── rag/                        ← RAG search logic
├── graph/                      ← Concept traversal
└── agents/                     ← MCP agents

components/
├── finalized-frontend-shell.tsx ← KEY: Mounts frontend

utils/
└── supabase/                   ← Supabase client setup
```

### Frontend App (UI Focus) — @frontend submodule

```
frontend/src/
├── App.tsx                     ← Single-page app, handles all routing
├── main.tsx                    ← Entry point
├── components/
│   ├── Onboarding.tsx
│   ├── Dashboard.tsx
│   ├── GuidedVideo.tsx         ← 3-column workspace
│   ├── Notebook.tsx
│   ├── Quiz.tsx
│   ├── Submissions.tsx
│   ├── Codespace.tsx
│   ├── Tools.tsx
│   ├── AIMentor.tsx
│   ├── Sidebar.tsx
│   └── ... (all UI components)
├── lib/
│   ├── supabase.ts             ← Client-side Supabase
│   ├── i18n.ts                 ← Translations
│   └── agents/                 ← Agent orchestrators
└── types.ts

package.json
vite.config.ts
```

---

## Code Conventions

### ✅ Root App Responsibilities

- **API routes only** (`app/api/`) — business logic, agent orchestration, DB queries
- **Auth middleware** — checking Supabase sessions, redirects
- **Data layer** — Supabase clients, query functions, type definitions
- **Backend agents** — MCP agents, LLM orchestration, RAG

### ✅ Frontend App Responsibilities

- **All UI rendering** — every page, component, and screen
- **Client-side routing** — handled in `App.tsx` state machine (no React Router needed)
- **User interactions** — form submissions, clicks, animations
- **Preferences persistence** — language, theme (synced back to root via `FinalizedFrontendShell`)
- **localStorage** — BYOA keys (never sent to backend)

### ❌ What NOT to Do

- **Don't add UI pages to root** — they will be unreachable. Add to `@frontend` instead.
- **Don't write business logic in API routes** — delegate to `lib/agents/`
- **Don't inline DB queries** — put them in `lib/supabase/queries/`
- **Don't use other databases** — Supabase only
- **Don't store secrets anywhere except `.env.local`**
- **Don't add payment processing** — pricing is static-only
- **Don't duplicate components** — root and frontend should not have overlapping UI

### Database & Queries

- **RSC database access:** Use `lib/supabase/server.ts`
- **Client-side database access:** Use `lib/supabase/client.ts`
- **Query organization:** All DB queries in `lib/supabase/queries/`
- **Response format for APIs:** Always return `{ data: T | null, error: string | null }`

### API Routes

- **Structure:** Validate input (Zod) → call agent → return result
- **Never write logic in routes** — routes are thin wrappers
- **Always validate** — use Zod schemas for all inputs

### Types

- **Define centrally:** `types/index.ts` (root) and `frontend/src/types.ts` (frontend)
- **Import from there** — don't redefine types in routes or components

---

## How to Work on Features

### Adding a Frontend Page/Screen

1. Add a new component in `frontend/src/components/`
2. Import it in `frontend/src/App.tsx`
3. Add routing logic in `App.tsx` state machine (see existing examples)
4. No need to touch the root app

### Adding a Backend API Route

1. Create file in `app/api/[feature]/route.ts`
2. Use Zod for validation
3. Call agent logic from `lib/agents/`
4. Return `{ data, error }` shape
5. Frontend calls `/api/[feature]` from Vite app

### Adding a Database Query

1. Create in `lib/supabase/queries/[domain].ts`
2. Use `supabaseServerClient()` (for API routes) or `supabaseClient()` (for client components)
3. Export typed function
4. Call from agents or API routes

### Adding Multilingual Copy

1. Add keys to `lib/i18n/en.json` and `lib/i18n/bn.json` (root)
2. Also add to `frontend/src/lib/i18n.ts` if needed
3. Use in components via i18n hooks

---

## Routing Map

| URL | Handler | Rendered By | Auth Required |
|-----|---------|-------------|---------------|
| `/` | `app/page.tsx` | Redirect logic | No |
| `/dashboard` | `app/dashboard/page.tsx` | FrontendApp | Yes |
| `/onboarding` | `app/onboarding/page.tsx` | FrontendApp | Yes |
| `/login` | `app/[...catchAll]/page.tsx` | FrontendApp | No |
| `/signup` | `app/[...catchAll]/page.tsx` | FrontendApp | No |
| `/tracks` | `app/[...catchAll]/page.tsx` | FrontendApp | No |
| `/learn/[lessonId]` | `app/[...catchAll]/page.tsx` | FrontendApp | Yes |
| `/quiz/[quizId]` | `app/[...catchAll]/page.tsx` | FrontendApp | Yes |
| `/api/*` | `app/api/*/route.ts` | Backend logic | Varies |

---

## Key Files & Reference Docs

| File | Purpose |
|------|---------|
| `AGENTS.md` | Complete conventions, stack, and behavioral guidelines |
| `metaprompt.md` | Master build prompt (frontend specs, data schema, features) |
| `docs/ARCHITECTURE.md` | Detailed system architecture |
| `docs/DATA_STRATEGY.md` | Database schema and data modeling |
| `docs/PROMPTS.md` | System prompts for agents and LLMs |
| `plan.md` | Full project roadmap and feature breakdown |
| `components/finalized-frontend-shell.tsx` | KEY: Mounts frontend into root |
| `lib/supabase/queries/` | Reusable database query functions |
| `lib/agents/` | Curriculum, Tutor, Assessment agent implementations |
| `lib/i18n/` | Translation files (English, Bengali) |
| `frontend/src/App.tsx` | Frontend routing & screen state machine |

---

## Environment Setup

### Root App (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_KEY=[service-role-key]
ANTHROPIC_API_KEY=[claude-api-key]
OPENAI_API_KEY=[openai-api-key]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Frontend App (frontend/.env.local)

```env
VITE_PUBLIC_SUPABASE_URL=https://[project].supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

Fill these before running dev servers.

---

## Common Tasks

### Testing the Frontend in Isolation

```bash
cd frontend
npm run dev  # Runs on port 3000 (or configured Vite port)
```

### Running a Single API Endpoint

```bash
curl http://localhost:3000/api/tutor \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Python?","lesson_id":"...","language":"en"}'
```

### Debugging Authentication Issues

1. Check Supabase session: `supabase.auth.getSession()` in browser console
2. Verify redirect URL matches `.env` `NEXT_PUBLIC_APP_URL`
3. Check FinalizedFrontendShell logs for session state

### Adding a New UI Screen

1. Create `frontend/src/components/MyScreen.tsx`
2. Import in `frontend/src/App.tsx`
3. Add to the screen state machine
4. Style with Tailwind
5. Call backend APIs from `frontend/src/lib/` utilities

---

## Troubleshooting

- **Build errors:** Clear `.next/` and rebuild: `rm -r .next && npm run build`
- **Type errors:** Run `npx tsc --noEmit` to check TypeScript
- **Supabase issues:** Verify `.env.local` credentials and Supabase dashboard status
- **Frontend not loading:** Check `FinalizedFrontendShell` is mounted and auth state is correct
- **Blank screen at `/dashboard`:** Check browser console for errors, ensure Supabase session exists

---

## Questions?

Refer to `AGENTS.md` for behavioral guidelines, `metaprompt.md` for full feature specs, and this file for architecture overview.
