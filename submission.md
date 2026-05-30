 1. Data sources

 - Supabase (Postgres primary) + pgvector for embeddings — primary DB/vector store (AGENTS.md, docs/SETUP_CHECKLIST.md).  
 - External LLMs/APIs: OpenAI, Anthropic/Claude (metaprompt.md, .github/copilot-instructions.md).  
 - Public Web / job market scrapes via Playwright (metaprompt.md).  
 - User uploads → Supabase Storage (metaprompt.md, docs/video_processing.md).

 2. Acquisition methods

 - Playwright scraper (weekly pg_cron) for job signals (metaprompt.md).  
 - Video ingest: yt-dlp → Whisper (local) or OpenAI Whisper → chunking → embeddings (docs/video_processing.md).  
 - n8n example flows shown (docs/video_processing.md).  
 - UI bulk uploads → Supabase Storage (docs, frontend components).

 3. Parsing, formats & cleaning

 - Whisper (transcription), spaCy (NLP), sentence-transformers/OpenAI embeddings for vectorization (docs/video_processing.md).  
 - Handles: video/audio (YouTube), VTT, JSON/CSV, PDF, text chunks.  
 - Chunking, overlap, dedup, embedding batching (docs/video_processing.md, metaprompt.md).

 4. Storage targets

 - Supabase Postgres (primary relational) + pgvector for vectors; Supabase Storage for files; Upstash Redis for counters/rate-limiting (metaprompt.md, docs).

 5. Visualization

 - Next.js backend + Vite React frontend (submodule), Tailwind + shadcn UI; Plotly/plot libs referenced for charts (AGENTS.md, metaprompt.md).

 6. Insights — AI / ML

 - RAG using pgvector RPCs, OpenAI embeddings (text-embedding-3-small), Whisper for STT, local sentence-transformers for cheaper embedding generation (metaprompt.md, docs/video_processing.md).

 7. Pipelines & orchestration

 - Supabase triggers, pg_cron scheduled jobs, n8n examples, Playwright cron on Railway (metaprompt.md, docs/video_processing.md).

 8. Outbound — APIs & distribution

 - REST API routes under app/api/*, Vercel deployment, webhooks/export patterns documented (docs/VERCEL_DEPLOYMENT.md).

 9. Open-source stack (roles)

 - Next.js, Vite, React, TypeScript (app/frontend); Tailwind, shadcn UI (styling); Supabase + pgvector (data & vectors); Playwright, yt-dlp, Whisper, spaCy, sentence-transformers (ingest/ML); n8n (automation); Upstash Redis (rate limits) — see AGENTS.md, metaprompt.md, docs/.

 10. Quality, governance & observability

 - Supabase RLS enforced, migrations + pgvector index in repo, Vercel logs/analytics, Upstash counters for throttling, pg_cron scheduling (docs/SETUP_CHECKLIST.md, metaprompt.md, docs/VERCEL_DEPLOYMENT.md).


# Agents


  1. Prompt usage (design & iteration)

 - Pattern: system+user role prompts, quick prompts (Explain / Summarize / 5 Qs), prompt-builder helpers (buildSystemPrompt/buildUserPrompt). Prompts are documented/expected in a registry (docs/PROMPTS.md referenced) and metaprompt is the master build prompt (metaprompt.md, lib/ai/video-chat.ts, components/GuidedVideo.tsx, plan.md).

 2. Prompt versioning & governance

 - Process: prompts required to be recorded/updated in docs/PROMPTS.md; plan.md enforces "Documented Prompts (Explainability Requirement)". Metaprompt includes agent contract sections to standardize I/O (metaprompt.md, plan.md, onboarding.md).

 3. Prompt patterns used

 - Role prompting (system/user messages), quick few-shot-style quick-prompts UI, grounded RAG prompt templates, and rubric-based prompts for assessment scoring. Implementations and examples live in metaprompt.md and agent code (metaprompt.md, lib/ai/video-chat.ts).

 4. Token optimization strategies

 - Platform fallback to cheaper models (Gemini Flash) with rate-limits; transcript & result caching; batching for embeddings; chunking/semantic chunk dedup; client-side local caches (Upstash Redis + local disk caching scripts) (plan.md, metaprompt.md, docs/video_processing.md, scripts/youtube_server.py, plan.md).

 5. Token optimization tools & techniques

 - Gemini Flash fallback (server-side) + Redis counters (Upstash) for quotas; n8n splitInBatches and batch embedding nodes; transcript disk cache; cheap-model routing via BYOA provider selection; sliding-window/chunking in pipeline scripts (lib/ai/byoa.ts, scripts/n8n_video_pipeline_batch.json, scripts/youtube_server.py, plan.md).

 6. LLMs / models used in workflows

 - OpenAI (Whisper, text-embedding-3-small), Anthropic / Claude (primary agent model in docs), Google Gemini (Flash fallback), Ollama (local BYOA), Groq listed as provider; sentence-transformers / local models for cheaper embeddings (metaprompt.md, docs/video_processing.md, lib/ai/byoa.ts, records.md).

 7. How & why specific LLMs were used

 - Whisper/OpenAI: transcription & embeddings; text-embedding-3-small for pgvector; Claude: agent reasoning/tutor; Gemini Flash: low-cost fallback; Ollama: local BYOA inference & local embeddings (metaprompt.md, docs/video_processing.md, lib/ai/byoa.ts).

 8. Retrieval & RAG approaches used

 - pgvector-based RAG (Supabase RPC match_transcript_chunks), semantic chunking (~150 words target or sentence-boundary chunks + overlap), batched embeddings, hybrid idea (keyword + vector) noted as possible; RAG used to ground prompts for agents (metaprompt.md, docs/video_processing.md, lib/supabase/queries/transcript.ts).

 9. RAG architecture details

 - Data sources: lesson transcripts (YouTube → Whisper or captions), transcript_chunks table (pgvector, 1536-dim/768-dim depending), chunking rules and overlap, embedding providers: OpenAI / sentence-transformers / Ollama; pgvector IVF index and server RPCs (metaprompt.md, docs/video_processing.md, supabase/migrations).

 10. MCP / agent contracts & agent usage

 - Custom MCP-style agents implemented and orchestrated in lib/agents/ (Curriculum, Tutor, Assessment). Metaprompt contains agent contracts and expected JSON I/O; API routes call agents (lib/agents/, metaprompt.md, AGENTS.md, app/api/*).

 11. Agent frameworks & orchestration

 - In-repo custom orchestrator (lib/agents/ + metaprompt), Playwright scraper run as an agent job (pg_cron / Railway), n8n for async pipeline automation; multi-agent patterns described in metaprompt/AGENTS.md (lib/agents/, scripts/n8n_video_pipeline_batch.json, metaprompt.md).

 12. Workflow automation & scheduling

 - n8n flows for ingest pipelines (scripts/n8n_video_pipeline_batch.json), pg_cron scheduled jobs for Playwright scrapers, Railway mentioned for cron runs, and server-side fallback routing to platform LLMs (docs/video_processing.md, metaprompt.md).

 13. Local / on-device agents & runtimes

 - Ollama local host support (BYOA selection), Pyodide for in-browser notebooks, local Whisper option for transcription; UI allows users to point to local Ollama endpoints (lib/ai/byoa.ts, components/Tools.tsx, lib/notebook/pyodide.ts).

 14. Fine-tuning / adaptation

 - No evidence of LoRA/QLoRA or full model fine-tuning in repo; emphasis is on BYOA, local embedding alternatives, and model choice rather than custom fine-tunes (docs/video_processing.md, records.md).

 15. Evaluation, testing & quality gates

 - Rubric-based LLM evaluation patterns (metaprompt.md), Judge0 CE for code execution grading, local regression/feature checklists in metaprompt/plan for acceptance; evaluation artifacts saved / cached for UX (metaprompt.md, plan.md, .components/providers/onboarding-shell.tsx).

 16. Guardrails, safety & privacy

 - Zod input validation for API routes, Supabase RLS on user-scoped tables, rate-limiting via Upstash Redis, minimal PII policy noted in plan, graceful error/fallback patterns in agent calls (onboarding.md, .github/copilot-instructions.md, supabase/migrations/, plan.md).

 17. Prompt/versioning & explainability practice

 - Project mandates documented prompts (docs/PROMPTS.md reference), metaprompt as canonical prompt source, plan requires versioned prompt docs and explainability (plan.md, metaprompt.md, onboarding.md).

 18. Notes about how "you and other agents" are integrated in developer workflow

 - Agents are used both at build-time (metaprompt-driven scaffold & prompt templates) and runtime (Tutor/Curriculum/Assessment agents). BYOA lets users route queries to their own model or platform fallback. n8n and scheduled agents handle offline/batch ingestion (metaprompt.md, lib/agents/, scripts/n8n_video_pipeline_batch.json).



 # 3rd section


 1. Data sources

 - Supabase (Postgres) primary DB + pgvector (transcript_chunks) — stores lessons, transcripts, embeddings (metaprompt.md, AGENTS.md, docs/SETUP_CHECKLIST.md).  
 - Video/audio: YouTube (yt-dlp ingestion), VTT/subtitles, Whisper/OpenAI transcription (docs/video_processing.md, scripts/youtube_server.py).  
 - Web scraping: Playwright job-market scraper (weekly, pg_cron) → job signals (metaprompt.md, plan.md).  
 - User uploads → Supabase Storage (submissions, files) (metaprompt.md, docs/video_processing.md).  
 - Automation: n8n flows + pg_cron for scheduled ingest (docs/video_processing.md, scripts/n8n_video_pipeline_batch.json).

 2. AI models & inference

 - OpenAI: Whisper (STT), text-embedding-3-small for embeddings; OpenAI APIs used (docs/video_processing.md, metaprompt.md).  
 - Anthropic / Claude: primary agent reasoning model referenced (metaprompt.md, .github/copilot-instructions.md).  
 - Google Gemini (Flash) used as low-cost platform fallback (plan.md, metaprompt.md).  
 - Ollama (local) + local sentence-transformers / nomic for cheaper embeddings (lib/ai/byoa.ts, records.md, docs/video_processing.md).  
 - Other mentions: Groq provider, potential local LLMs in plan (metaprompt.md, plan.md).

 3. Responsible AI / provenance & safety

 - Input validation with Zod for APIs (policy enforced) ( .github/copilot-instructions.md, app/api/* ).  
 - Supabase Row-Level Security (RLS) on user-scoped tables; migrations and RLS notes present (supabase/migrations/*, plan.md, records.md).  
 - Rate-limiting & caching guards via Upstash Redis (platform fallback counters, quotas) (metaprompt.md, plan.md).  
 - Privacy policy/PII: explicit “minimal learner PII” design; privacy and bias notes in plan (plan.md).  
 - Audit/versioning: docs_versions table (new docs migration) / versions pattern used for doc/agent outputs (metaprompt.md, supabase/migrations).

 4. Tooling, IDE & deployment

 - IDE/workflow: VSCode implied in curriculum/seed metadata; Lovable & v0 used for UI prototyping (plan.md, supabase/migrations/seed_curriculum.sql, onboarding.md).  
 - Frameworks/libraries: Next.js 14 (root), Vite React frontend (submodule), TypeScript, React, Tailwind, shadcn/ui, Supabase, pgvector, Playwright, n8n, spaCy, sentence-transformers (AGENTS.md, metaprompt.md, docs).  
 - Deployment: Vercel for root app; Railway used for scheduled Playwright jobs; Docker/AWS/GCP referenced as infra options (docsV0/VERCEL_DEPLOYMENT.md, metaprompt.md, plan.md).

 5. Context / memory files (project canonical memory)

 - metaprompt.md — master build prompt + MCP agent contracts (primary canonical prompt).  
 - AGENTS.md — agent conventions & expectations.  
 - plan.md — roadmap, prompt explainability requirement.  
 - docs/PROMPTS.md referenced as prompt registry (onboarding.md, AGENTS.md).  
 - records.md, onboarding.md, CLAUDE.md appear as auxiliary context/checklists.

 6. MCP (Model Context Protocol) usage

 - MCP-style agents implemented/orchestrated in repo: lib/agents/ (Curriculum, Tutor, Assessment) and mcp connectors (metaprompt.md, plan.md, AGENTS.md).  
 - Example: Indeed MCP integration for job search (metaprompt.md, plan.md).  
 - Tools exposed via MCP: scrapers, job-market search, subtitle/QA agents (metaprompt.md shows contracts & examples).  
 - Permissions: not a single ACL file in repo — runtime access controlled via server-side secrets and Supabase roles; agent contracts documented in metaprompt/plan for audit (metaprompt.md, plan.md).

 7. Prompt library & usage

 - Canonical master prompt: metaprompt.md (FIXETH master build prompt v3).  
 - Prompt builders: buildSystemPrompt / buildUserPrompt in lib/ai/video-chat.ts; quick-prompts UI in components (components/GuidedVideo.tsx, AIMentor) (lib/ai/video-chat.ts, components/GuidedVideo.tsx).  
 - Registry expectation: docs/PROMPTS.md (referenced in onboarding.md/plan.md) — prompts are expected to be versioned & documented (plan.md).  
 - Prompt patterns: system+user role, quick few-shot actions, rubric-based prompts for assessment (metaprompt.md, plan.md).
