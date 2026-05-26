# Fixeth — Project Onboarding

Welcome to the project. Read this first before touching anything else.

---

## What is Fixeth?

Bengali-first adaptive LMS for Bangladesh. Built for THE INFINITY AI BUILDFEST 2026 (EdTech track). The platform combines RAG-powered video tutoring, graph-based adaptive learning paths, and verified credentials — all localized in Bengali.

**Deadline: May 30, 2026.**

---

## Read First (in this order)

| # | File | What it tells you | Time |
|---|------|------------------|------|
| 1 | `README.md` | Project overview, stack, setup instructions | 3 min |
| 2 | `AGENTS.md` | Coding conventions, architecture rules, what not to do — **read before writing any code** | 5 min |
| 3 | `docs/ARCHITECTURE.md` | System layers, data flow, agent contracts | 5 min |
| 4 | `plan.md` | Full product plan, all features, DB schema, roadmap | 20 min |

---

## File Map

### Root

| File | Purpose | Who writes it |
|------|---------|---------------|
| `README.md` | Public-facing repo intro | Team lead |
| `AGENTS.md` | Instructions for all AI agents + coding conventions | Team lead — update when conventions change |
| `plan.md` | Full planning document — features, schema, roadmap, submission package | Team lead — living document |
| `records.md` | Log of decisions made, work done, open questions | Everyone — log your session |
| `.env.example` | Template for environment variables — no real values | Anyone adding a new env var |
| `.env.local` | Real credentials — **never commit** | Each dev sets up locally |

### docs/

| File | Purpose | Who writes it |
|------|---------|---------------|
| `docs/ARCHITECTURE.md` | Living architecture doc — storage, processing, agent contracts, data flows | Update when architecture changes |
| `docs/PROMPTS.md` | All documented AI prompts used in the system | Update when a prompt is added or changed |
| `docs/DATA_STRATEGY.md` | Scraping sources, RAG setup, ethical safeguards, privacy policy | Update when data sources change |
| `docs/UI_HANDOFF.md` | Per-screen notes: component source, data wiring, what's static vs dynamic | Update when a new screen is designed in Stitch |

### .cursor/rules/

Cursor reads these automatically. Do not put project logic here — only coding style rules.

| File | Purpose |
|------|---------|
| `general.mdc` | Stack overview, import conventions, file placement rules |
| `frontend.mdc` | Component rules — RSC by default, Tailwind only, shadcn patterns |
| `backend.mdc` | API route shape, Zod validation, error handling pattern |
| `database.mdc` | Supabase client usage, RLS awareness, query file rules |

### .github/

| File | Purpose |
|------|---------|
| `.github/copilot-instructions.md` | GitHub Copilot workspace instructions |
| `.github/workflows/ci.yml` | CI pipeline — lint, type-check, build |

---

## Tooling & Who Does What

| Tool | Used for | Owns |
|------|---------|------|
| **Stitch** | UI design | Design only — no logic |
| **Lovable** | Figma/Stitch → React component generation | UI shells only |
| **Cursor** | Main development — data wiring, logic, agents | Everything in `lib/`, `app/api/`, component wiring |
| **GitHub Copilot** | Inline suggestions in VS Code | Repetitive code, boilerplate |
| **Codex CLI** | Terminal tasks — migrations, file generation, repetitive scripts | `supabase/migrations/`, `types/`, seed files |

**Rule:** Stitch/Lovable owns the look. Cursor owns the logic. Never let an agent redesign a component.

---

## UI → Code Handoff Workflow

```
Stitch (design screen)
  → export code or Figma
  → Lovable generates React component if needed
  → drop into components/
  → add entry to docs/UI_HANDOFF.md
  → Cursor wires data and logic
```

For every screen you hand off, add a block to `docs/UI_HANDOFF.md`:

```markdown
## [Screen Name]
- Component: components/[folder]/[File].tsx
- Data source: lib/supabase/queries/[file].ts → [functionName]()
- Dynamic parts: [list what changes per user/data]
- Static parts: [list what must not be changed]
- Auth: [any auth conditions]
```

---

## Dev Setup

```powershell
# Clone and install
git clone https://github.com/your-org/fixeth.git
cd fixeth
npm install

# Set up environment
cp .env.example .env.local
# Fill in .env.local — ask team lead for credentials

# Set up Supabase locally (optional)
npx supabase start

# Run migrations
npx supabase db push

# Start dev server
npm run dev
```

---

## Before You Write Any Code

1. Read `AGENTS.md` — conventions are enforced in code review
2. Check `plan.md` Section 11 (roadmap) — find which phase your task belongs to
3. Check `records.md` — see if a decision about your task was already made
4. If building a new feature, check `docs/ARCHITECTURE.md` — understand where it fits in the layer structure
5. If wiring a UI component, check `docs/UI_HANDOFF.md` — your screen may already have instructions

---

## Where to Write What

| Situation | Where to write |
|-----------|---------------|
| New environment variable added | `.env.example` (template) + tell team |
| Architecture decision made | `docs/ARCHITECTURE.md` + `records.md` |
| New prompt written or changed | `docs/PROMPTS.md` |
| New screen designed in Stitch | `docs/UI_HANDOFF.md` |
| New scraping source added | `docs/DATA_STRATEGY.md` |
| Convention or rule changed | `AGENTS.md` + relevant `.cursor/rules/*.mdc` |
| Work session completed | `records.md` — date, what was done, open questions |
| Bug found (not fixed yet) | `records.md` under Open Questions |
| New DB table or column added | `supabase/migrations/` (new numbered file) + update schema in `plan.md` Section 9 |

---

## records.md — How to Log

Add an entry after every work session:

```markdown
## [Date]

### Done
- [what you built or decided]

### Decisions
- [any architectural or product decision made, with reason]

### Open Questions
- [anything unresolved — tag a name if someone owns it]
```

---

## Key Rules (non-negotiable)

- **Never commit `.env.local`**
- **Never write DB queries inline** — always in `lib/supabase/queries/`
- **Never put logic in API route files** — routes call `lib/agents/` or `lib/supabase/queries/` only
- **Never use any DB other than Supabase**
- **Never implement payment processing** — pricing page is static
- **Always return `{ data, error }` from API routes**
- **Always validate API inputs with Zod**
- **Server components by default** — add `"use client"` only when you need interactivity