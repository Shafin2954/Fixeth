# AI Detail Usage

---

# Prompt Usage

### Prompt Design and Iteration

Fixeth uses structured prompts across the platform for AI tutoring, subtitle translation, curriculum generation, assessment grading, and adaptive path recommendations.

The core prompt patterns are:

* System + user role prompting for all LLM calls
* RAG-grounded generation: retrieved transcript chunks are injected into the system prompt so the model can only answer from what's in the video
* Topic-anchored citation: every tutor response must include a `[ts:MM:SS]` marker copied from the retrieved chunk, never invented
* Rubric-based JSON output for the Assessment Agent
* Bengali glossary enforcement: 50-100 technical terms are explicitly listed as "keep in English" to prevent translation ambiguity

All production prompts are documented and versioned in `docs/PROMPTS.md`.

### Prompt Versioning and Governance

* Every prompt change is recorded in `docs/PROMPTS.md` with a version bump and date
* Old versions are retained in the same file for audit purposes
* Agent input/output contracts are standardized so replacing a prompt doesn't break downstream consumers
* The `docs_content` table stores the live version of the prompt registry, editable from the `/admin` page without redeployment

### Prompt Patterns Used

* RAG-grounded generation (retrieved topic chunks in system prompt)
* Role prompting with persona options (default, Socratic, RPG)
* Rubric-based structured JSON output
* Multi-level explanations (ELI5, Student, Practitioner, Researcher)
* Bengali translation with glossary enforcement

---

# Token Optimization

### Optimization Strategies

* Transcript chunking: 2-3 sentences per chunk with 2-sentence overlap. Only the top-3 topic matches (cosine ≥ 0.7) reach the LLM — not the full transcript.
* 5-minute in-memory cache on `/api/chat`: repeated questions within a session skip the LLM entirely
* Embeddings are generated once per video during ingestion, not at query time
* The platform uses Gemini 2.0 Flash as the default model — fast and free-tier friendly
* BYOA routes the user's questions through their own API key, removing platform AI cost entirely for that session

### Methods Used

* Top-K retrieval (top 3 topics, threshold 0.7) limits context size
* In-memory caching for repeated questions
* One-time embedding generation per video (not per query)
* Cheap-model routing (Gemini Flash as default, BYOA for heavy users)

---

# LLMs and Models Used

### Platform-Shared (Admin-Managed)

#### Gemini 2.0 Flash (Primary)

The default model for all AI features when a user has no personal API key configured. The platform admin manages up to 4 rotating key slots from the `/admin` page. On a rate-limit error, the system retries once with the next available slot. If all slots are exhausted, users see a soft-fail message and are prompted to add their own key.

Used for:
* AI tutor responses (via Tutor Agent)
* Bengali subtitle translation
* Assessment grading (Assessment Agent)
* Curriculum path generation (Curriculum Agent)

### BYOA (User-Supplied Keys — Stored in localStorage Only)

Users can paste their own API key in profile settings. The key is stored in browser `localStorage` and never sent to Fixeth servers. When a BYOA key is present, the client calls the LLM provider directly.

Supported providers: OpenAI, Anthropic, Gemini, Groq, Ollama (local)

### Whisper (Local, Offline)

Used once per video during ingestion for speech-to-text transcription with segment-level timestamps. Runs locally via `scripts/process_video_free.py` (using the `base` model) or via the OpenAI Whisper API for faster processing.

### Ollama — nomic-embed-text (Production Embeddings)

768-dimensional embeddings for all transcript chunks. Runs locally during the ingestion pipeline. Embeddings are stored in pgvector and never regenerated at query time unless the video or chunking strategy changes.

### sentence-transformers — all-MiniLM-L6-v2 (Free Fallback)

384-dimensional embeddings. Used as a cost-free alternative during development or when Ollama is unavailable. Requires changing the `transcript_chunks.embedding` column dimension to `VECTOR(384)` in the schema.

---

# Retrieval and RAG

### Retrieval Architecture

Every AI tutor response goes through this pipeline:

1. Fetch `lesson_topics` rows for the lesson, ordered by `start_time`
2. For each topic, gather `transcript_chunks` where `start_time` falls within the topic's time range
3. Build a topic representation string: `TOPIC: <label> [<start>s – <end>s]` followed by timestamped chunk lines
4. Embed the user's question using Ollama `nomic-embed-text` (768-dim)
5. Cosine similarity search via the `match_transcript_chunks` pgvector RPC
6. Filter: similarity ≥ 0.7; take top 3 topics
7. If nothing passes the threshold: return "I couldn't find this in the video" — no fallback to general knowledge
8. Otherwise: pass the retrieved topics to the LLM with an explicit instruction to use only the provided context

### Key Design Decisions

* The 0.7 cosine threshold prevents weak matches. The system would rather admit it doesn't know than guess.
* Topic-anchored retrieval is a step up from flat chunk search. Grouping chunks by topic gives the LLM more coherent context and lets it cite timestamps accurately.
* If no `lesson_topics` rows exist for a lesson, the system falls back to the legacy flat-chunk format, so existing lessons without topic annotations still work.

### Embedding Storage

* pgvector (Supabase extension), ivfflat index with cosine ops, `lists = 100`
* Production: 768-dim (Ollama nomic-embed-text)
* Development fallback: 384-dim (sentence-transformers)

---

# Open Source Tools and Libraries

### AI Stack

| Tool | Purpose |
| --- | --- |
| Ollama (nomic-embed-text) | Production transcript embeddings (768-dim) |
| sentence-transformers | Free local embedding fallback (384-dim) |
| Whisper | One-time video transcription with timestamps |
| spaCy | Sentence boundary detection during chunking |
| pgvector | Vector similarity search in Supabase |
| Playwright | Weekly job market scraping from Bdjobs and Chakri |
| n8n | Workflow automation for ingestion pipelines |

### Custom Agents

Three agents, implemented in `lib/agents/`:

* **Curriculum Agent** (`curriculum.ts`): concept graph traversal via recursive CTE, builds adaptive learning path with skip and remedial injection per learner mastery scores
* **Tutor Agent** (`tutor.ts`): topic-anchored RAG, `[ts:MM:SS]` citation enforcement, retry-once on rate limit
* **Assessment Agent** (`assessment.ts`): rubric-based grading with structured JSON output and Bengali feedback

---

# Agent Frameworks and Orchestration

### Architecture

Custom in-repo agent orchestration under `lib/agents/`. No external agent framework dependency.

Each agent has a defined input/output contract documented in `docs/ARCHITECTURE.md` §5. Replacing a model or prompt requires changes in one file.

### Agent Responsibilities

| Agent | Trigger | Output |
| --- | --- | --- |
| Curriculum Agent | Enrollment, quiz result, module completion | Ordered lesson path with skip/remedial flags |
| Tutor Agent | User question in Guided Video chat tab | Grounded answer + clickable timestamp + source topics |
| Assessment Agent | Submission grading | Per-criterion scores, total, feedback (EN + Bengali) |

### Automation

* pg_cron for scheduled jobs (weekly job scraper)
* Supabase Triggers for event-driven updates (lesson completion, quiz results)
* n8n as an alternative orchestration layer for video ingestion

---

# Evaluation and Quality Measurement

### Tutor Agent

* Cosine threshold (0.7) is the primary quality gate — no retrieval below threshold means no fabricated answer
* `[ts:MM:SS]` marker parsing: if the LLM omits a timestamp, the UI shows "no timestamp found" and suggests rephrasing
* Timestamp accuracy target: ±5 seconds on the 5 hero videos (measured manually)

### Assessment Agent

* Rubric-based scoring: per-criterion scores summed against a defined max
* Bengali feedback required when `user.language === 'bn'`
* Pass/fail determined by whether `total >= threshold` in the rubric

### Subtitle Quality Agent (Post-Launch)

* Composite score: `(fluency × 0.4) + (accuracy × 0.4) + (term_preserve × 0.2)`
* ≥ 0.85 → auto-publish; < 0.85 → human review queue
* Learner flagging feeds the same queue

---

# Guardrails, Safety and Privacy

### Hallucination Prevention

* RAG grounding limits the LLM to retrieved transcript chunks. It has no access to its training knowledge during a tutor interaction.
* Hard retrieval threshold (0.7): below it, the system says "I couldn't find this in the video"
* The system prompt explicitly says: "Do not use outside knowledge"

### Input Validation

* Zod schemas on all Next.js API routes
* Pydantic in Python ingestion scripts

### Abuse Prevention

* Upstash Redis rate limiting: 30 `/api/chat` requests per minute per IP
* In-memory cache reduces duplicate requests reaching the LLM

### Privacy

* No PII collected beyond what auth and personalization require (email, name, language preference, goal, experience level)
* BYOA keys stored in `localStorage` only — never transmitted to Fixeth servers
* Platform AI keys stored in `admin_config` table server-side — never returned to the client
* Chat history is transient (not persisted beyond 24 hours in memory)
* Row-Level Security on all user-scoped tables

---

# Frontend AI and Visual Builders

### Tools Used

* Lovable — initial UI scaffolding and component layout
* v0 — component prototyping
* Cursor Composer with Claude — architecture, agent contracts, implementation
* Replit — specific screen prototypes

### Usage

These tools handled UI scaffolding and early prototyping. Business logic, agent architecture, database schema, and API integrations were built manually.

---

# Local and On-Device Models

### Runtime

* Ollama

### Models Supported via BYOA

* Llama 3 series
* DeepSeek
* Qwen 2 series
* Mistral
* Gemma

### Why Local Models Matter

For BYOA users, local Ollama models mean zero API cost and no data leaving their machine. For the platform's embedding pipeline, Ollama `nomic-embed-text` runs locally during ingestion so there's no per-video API cost for embeddings.

---

# AI Development Lifecycle

### Process

1. Requirements defined in `docs/PRD.md`
2. Prompt design documented in `docs/PROMPTS.md` before implementation
3. Agent input/output contracts defined in `docs/ARCHITECTURE.md` §5
4. Implementation in `lib/agents/`
5. Manual evaluation (timestamp accuracy, retrieval quality, Bengali translation score)
6. Build check (`npm run build`) before each merge

### Review Gates

* Every prompt change requires a version bump in `docs/PROMPTS.md`
* Agent contract changes require documentation updates before merging
* Build must pass before deployment

---

# Live Documentation

Fixeth ships a live `/docs` module powered by the `docs_content` table in Supabase. Admins can edit any page from `/admin` without redeployment. The module covers architecture, prompts, data strategy, ethics, and the scalability roadmap — all of which are also maintained as versioned `.md` files in the repo.

---

# Additional Notes

Fixeth is built AI-native, not AI-bolted-on. The AI tutor, adaptive curriculum, assessment grading, subtitle translation, and job market analysis are core to how the platform works — not optional features layered on top of a traditional LMS. The architecture is intentionally modular so that swapping a model provider, changing a prompt, or upgrading the embedding dimension requires changes in one place and nothing breaks downstream.
