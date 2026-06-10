# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commonly Used Commands

- `npm run dev` - Start the Next.js development server at http://localhost:3000
- `npm run build` - Create a production build of the application
- `npm run start` - Start the production server (after building)
- `npm run lint` - Run ESLint to check for code quality issues
- Note: There is no configured test script in `package.json`. Testing setup is not currently established in the repository.

## High-Level Code Architecture and Structure

### Framework and Rendering
- **Next.js 14 App Router**: The application uses the App Router paradigm with server components by default. Add `"use client"` only when client-side interactivity is required.
- **Styling**: Tailwind CSS with shadcn/ui component library.

### Data Layer
- **Supabase**: The single source of truth for all data (PostgreSQL with pgvector extension for vector search).
- **Database Access**: 
  - Server components and API routes: Use `lib/supabase/server.ts`
  - Client components: Use `lib/supabase/client.ts`
  - **All database queries must reside in `lib/supabase/queries/`** — never inline in route files or components.
- **Vector Store**: The `transcript_chunks` table uses pgvector for cosine similarity search in RAG workflows.

### Agent Logic
- **Business Logic Encapsulation**: Three agents handle core domain logic:
  - `lib/agents/curriculum.ts` - Curriculum planning and sequencing
  - `lib/agents/tutor.ts` - Conversational tutoring and learner support
  - `lib/agents/assessment.ts` - Quiz generation, evaluation, and feedback
- **API Routes**: Route files in `app/api/` should only validate input (with Zod) and call agents — no business logic in route files.

### Type System
- **Centralized Types**: Define all TypeScript types in `types/index.ts` and import from there.
- **API Responses**: Follow the `{ data, error }` shape convention.

### Internationalization
- **next-intl**: All user-facing strings are translated via next-intl.
- **Translation Files**: English (`lib/i18n/en.json`) and Bengali (`lib/i18n/bn.json`).

### Key Architectural Patterns
1. **RAG (Retrieval-Augmented Generation)**:
   - Embed user query → pgvector cosine search → retrieve top 5 chunks → ground LLM prompt with chunks → generate response.
2. **Concept Graph**:
   - Implemented as a recursive CTE in `lib/graph/traverse.ts` for prerequisite tracking and learning path generation.
3. **Subtitle Overlay**:
   - Poll YouTube player every 250ms to match VTT cues for synchronized transcript display.
4. **API Route Validation**:
   - Use Zod for input validation; always return `{ data, error }` object.

### Directory Structure Overview
- `app/` - Next.js App Router routes (organized by feature: auth, dashboard, tracks, profile, etc.)
- `components/` - Shared, reusable UI components
- `lib/` - 
  - `supabase/` - DB client/server configs and query files
  - `agents/` - Core agent implementations (Curriculum, Tutor, Assessment)
  - `graph/` - Concept graph traversal logic
  - `i18n/` - Internationalization JSON files
- `services/subtitle-pipeline/` - Separate Node.js service for audio transcription (Whisper), translation, and VTT generation.
- `public/` - Static assets

### Critical Conventions and Constraints
- **Never** write business logic inside `app/api/` route files.
- **Never** use any database other than Supabase.
- **Never** store API keys or secrets anywhere except `.env.local`.
- Payment processing is intentionally static (pricing page only) — do not implement payment flows.
- BYOA (Bring Your Own Agent) functionality has been removed from scope.

### Development Guidelines
- **Think Before Coding**: State assumptions explicitly; if uncertain, ask. If multiple interpretations exist, present them.
- **Simplicity First**: Implement the minimum code that solves the problem. Avoid speculative features, abstractions for single-use code, and unrequested flexibility.
- **Surgical Changes**: Only modify what is directly related to the task. Do not refactor unrelated code, even if it appears improvable.
- **Goal-Driven Execution**: Transform tasks into verifiable goals before starting work.
