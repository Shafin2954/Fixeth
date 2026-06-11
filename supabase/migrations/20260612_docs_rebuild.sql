-- Migration: Rebuild docs with full structured content + team-avatars storage bucket

BEGIN;

-- 1. Upsert main docs row with full structured content and correct scheduling
INSERT INTO docs (slug, title, content, is_published, visible_override, start_ts, end_ts)
VALUES (
  'main',
  'Fixeth — Live Documentation & Pitch Deck',
  jsonb_build_object(
    'meta', jsonb_build_object(
      'github_url', 'https://github.com/rafsan-j/Fixeth'
    ),
    'hero', jsonb_build_object(
      'title', 'Fixeth',
      'subtitle', 'Bengali-First AI Learning Platform',
      'tagline', 'Learn. Prove. Build.'
    ),
    'slides', jsonb_build_array(
      jsonb_build_object('id','problem','title','Problem','body','Learners in Bangladesh lack high-quality, Bengali-first career-oriented pathways. English-only LMS platforms are inaccessible to 170 million people, half of whom are under 30. Existing tools do not understand local context, job markets, or language.'),
      jsonb_build_object('id','solution','title','Solution','body','Fixeth: an AI-powered, Bengali-first adaptive LMS combining video intelligence, graph-based concept reasoning, and personalized learning paths. Students watch YouTube lectures in Bengali or English and get an AI tutor that cites the exact timestamp.'),
      jsonb_build_object('id','why-now','title','Why Now','body','Mass availability of LLMs, improved speech-to-text (Whisper), and vector search (pgvector) now enable RAG-driven, personalized learning for non-English speakers at low cost. Bangladesh''s tech talent demand is outpacing supply.'),
      jsonb_build_object('id','demo','title','Product Demo','body','Interactive guided video workspace: ask any question → AI finds the timestamp → video seeks automatically. Includes quizzes, a notebook, job market signals, and a concept-graph learning path tailored to each learner.'),
      jsonb_build_object('id','market','title','Market Opportunity','body','170M Bengali speakers globally. 3M+ university students in Bangladesh. $500M+ Southeast Asia EdTech market. Adjacent: enterprise training, institutional licensing, and diaspora learners.'),
      jsonb_build_object('id','business-model','title','Business Model','body','Freemium subscription for individual learners (free tier with limits, Pro with full AI access). Enterprise licensing for universities and bootcamps. Partner content deals. API access for institutional integrations.'),
      jsonb_build_object('id','traction','title','Traction','body','Pilot learners enrolled in Data Science and Frontend tracks. Live curriculum with 5+ published tracks, 30+ lessons with AI-linked transcripts. Real job market signals scraped weekly from 5+ sources including Bdjobs and Chakri.'),
      jsonb_build_object('id','competition','title','Competition','body','Generic LMS (Coursera, Udemy) — English-only, no job signal integration. Local platforms — no AI personalization. ChatGPT — no video intelligence or curriculum structure. Fixeth differentiates through Bengali-first UX and concept-graph mastery tracking.'),
      jsonb_build_object('id','unique-advantage','title','Unique Advantage','body','Three compounding moats: (1) Bengali-first UX with bilingual AI tutor; (2) video timestamp RAG — AI cites the exact moment in the lecture; (3) live job market signals wired to curriculum so learners learn what employers want.'),
      jsonb_build_object('id','gtm','title','Go-To-Market','body','Campus partnerships with Bangladeshi universities. Localized content creators producing Bengali-language tracks. Referral programs for learners. Enterprise pilots with coding bootcamps. Community-driven track library.'),
      jsonb_build_object('id','vision','title','Vision','body','Democratize high-quality career-track learning for Bengali speakers globally. Become the default AI learning platform for South Asia — starting with Bangladesh, expanding to West Bengal and the global diaspora.')
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id','overview','title','Product Overview','type','markdown','body',
        '## What is Fixeth?' || E'\n\n' ||
        'Fixeth is a Bengali-first adaptive learning platform that turns YouTube lectures into interactive, AI-powered learning experiences. Learners ask questions in English or Bengali, and the AI tutor answers by citing the exact timestamp in the video.' || E'\n\n' ||
        '## Target Users' || E'\n\n' ||
        '- **University students** in Bangladesh studying Computer Science and related fields' || E'\n\n' ||
        '- **Early-career developers** upskilling for the job market' || E'\n\n' ||
        '- **Bootcamp learners** needing structured, career-relevant tracks' || E'\n\n' ||
        '## Core Use Cases' || E'\n\n' ||
        '1. Watch a lecture → ask the AI tutor → video seeks to the exact answer timestamp' || E'\n\n' ||
        '2. Follow a concept-graph learning path adapted to your existing knowledge' || E'\n\n' ||
        '3. Take auto-generated quizzes, submit projects, earn skills certificates' || E'\n\n' ||
        '4. Check live job market signals to know which skills to prioritize'
      ),
      jsonb_build_object('id','features','title','Feature Matrix','type','feature-matrix','body','Live feature status — synced from the features table.'),
      jsonb_build_object('id','architecture','title','Architecture Diagram','type','mermaid','body',
        'graph TD' || E'\n' ||
        '  Browser[Browser / Mobile] --> NextApp[Next.js 14 App Router]' || E'\n' ||
        '  NextApp --> SupaAuth[Supabase Auth]' || E'\n' ||
        '  NextApp --> APIRoutes[API Routes]' || E'\n' ||
        '  APIRoutes --> AgentLayer[AI Agent Layer]' || E'\n' ||
        '  APIRoutes --> DBQueries[DB Query Layer]' || E'\n' ||
        '  AgentLayer --> Anthropic[Anthropic / Claude API]' || E'\n' ||
        '  AgentLayer --> OpenAI[OpenAI API]' || E'\n' ||
        '  AgentLayer --> pgvector[pgvector Similarity Search]' || E'\n' ||
        '  DBQueries --> SupaDB[(Supabase PostgreSQL)]' || E'\n' ||
        '  pgvector --> SupaDB' || E'\n' ||
        '  DBQueries --> Storage[Supabase Storage]'
      ),
      jsonb_build_object('id','data-flow','title','Data Flow Diagram','type','mermaid','body',
        'graph LR' || E'\n' ||
        '  Q[User Question] --> Embed[Embed Query]' || E'\n' ||
        '  Embed --> VS[pgvector cosine search]' || E'\n' ||
        '  VS --> Top5[Top 5 transcript chunks]' || E'\n' ||
        '  Top5 --> Prompt[Grounded LLM Prompt]' || E'\n' ||
        '  Prompt --> LLM[Claude / GPT]' || E'\n' ||
        '  LLM --> Ans[Answer + start_time]' || E'\n' ||
        '  Ans --> Seek[Video seeks to timestamp]' || E'\n' ||
        '  Seek --> User[Learner sees exact moment]'
      ),
      jsonb_build_object('id','tech-stack','title','Technology Stack','type','markdown','body',
        '| Layer | Technology |' || E'\n' ||
        '|---|---|' || E'\n' ||
        '| **Frontend** | Next.js 14 App Router, React 19, Tailwind CSS v4, shadcn/ui, Framer Motion |' || E'\n' ||
        '| **Backend** | Next.js API Routes (Edge/Node), Zod validation |' || E'\n' ||
        '| **Database** | Supabase PostgreSQL with pgvector (768-dim embeddings), Row Level Security |' || E'\n' ||
        '| **AI / LLM** | Anthropic Claude (via SDK), OpenAI GPT (fallback), 4-slot API key rotation |' || E'\n' ||
        '| **Transcription** | Whisper (subtitle pipeline service), VTT generation |' || E'\n' ||
        '| **Auth** | Supabase Auth (Google OAuth, GitHub OAuth, email/password) |' || E'\n' ||
        '| **Storage** | Supabase Storage (team avatars, certificates, user uploads) |' || E'\n' ||
        '| **Infra** | Vercel (Next.js deploy), Supabase Cloud (DB / Auth / Storage) |' || E'\n' ||
        '| **Job Scraping** | Playwright + Node.js service, 5 live sources (Remotive, Jobicy, Adzuna, WWR, Bdjobs) |'
      ),
      jsonb_build_object('id','api-docs','title','API Documentation','type','markdown','body',
        '## Public APIs' || E'\n\n' ||
        '| Endpoint | Method | Description |' || E'\n' ||
        '|---|---|---|' || E'\n' ||
        '| `/api/chat` | POST | RAG-powered AI tutor chat with timestamp citations |' || E'\n' ||
        '| `/api/mentor` | POST | Conversational AI mentor for learner support |' || E'\n' ||
        '| `/api/feature-matrix` | GET | Live feature status from the `features` table |' || E'\n' ||
        '| `/api/docs/live` | GET | Live platform statistics (tracks, lessons, users, enrollments) |' || E'\n' ||
        '| `/api/jobs` | GET | Trending job market skill signals |' || E'\n' ||
        '| `/api/jobs/live` | GET | Live job postings from 5 external sources |' || E'\n' ||
        '| `/api/jobs/matches` | GET | Personalized job matches via Jaccard similarity |' || E'\n' ||
        '| `/api/skills/award` | POST | Award skills to a learner upon lesson completion |' || E'\n\n' ||
        '## Auth Model' || E'\n\n' ||
        'All protected routes require a valid Supabase session cookie. Admin routes additionally require `role = platform_admin` in the `users` table. Row Level Security (RLS) policies enforce data isolation at the database level.' || E'\n\n' ||
        '## External APIs Consumed' || E'\n\n' ||
        '- **Anthropic Claude API** — RAG tutor, mentor, assessment feedback' || E'\n' ||
        '- **OpenAI API** — embedding generation (text-embedding-ada-002), fallback LLM' || E'\n' ||
        '- **Remotive, Jobicy, Adzuna, WWR, Bdjobs** — job market signal scraping'
      ),
      jsonb_build_object('id','data-layer','title','Data Layer','type','markdown','body',
        '## Data Sources' || E'\n\n' ||
        '- **Curriculum**: Manually authored tracks, modules, and lessons stored in Supabase' || E'\n' ||
        '- **Transcripts**: Whisper-generated VTT files chunked and embedded into `transcript_chunks` (pgvector)' || E'\n' ||
        '- **Job Market**: Weekly scraping from Remotive, Jobicy, Adzuna, We Work Remotely, and Bdjobs' || E'\n' ||
        '- **User Activity**: Enrollments, progress, quiz results, and skill awards tracked in real time' || E'\n\n' ||
        '## Storage & Privacy' || E'\n\n' ||
        '- Personal data (email, name) stored only in `users` table under RLS' || E'\n' ||
        '- Transcript chunks contain no PII — only anonymized lecture text' || E'\n' ||
        '- Job postings are public data; no individual data is scraped' || E'\n' ||
        '- User passwords managed by Supabase Auth (bcrypt, never stored in app tables)'
      ),
      jsonb_build_object('id','ai-layer','title','AI Layer','type','markdown','body',
        '## Models Used' || E'\n\n' ||
        '- **Anthropic Claude** (primary): tutor chat, mentor, assessment feedback, content grading' || E'\n' ||
        '- **OpenAI GPT** (fallback): used when Claude API limit is reached via 4-slot key rotation' || E'\n' ||
        '- **OpenAI text-embedding-ada-002**: 1536-dim embeddings for transcript chunk search' || E'\n\n' ||
        '## RAG Pipeline' || E'\n\n' ||
        '1. Embed user query (1536-dim vector)' || E'\n' ||
        '2. pgvector cosine similarity search over `transcript_chunks`' || E'\n' ||
        '3. Retrieve top-5 chunks for the lesson in context' || E'\n' ||
        '4. Inject chunks + timestamps into LLM system prompt' || E'\n' ||
        '5. LLM generates answer + cites `start_time` timestamp' || E'\n' ||
        '6. Frontend video player seeks to cited timestamp' || E'\n\n' ||
        '## Personalization' || E'\n\n' ||
        'The concept graph (`concepts` + `concept_edges`) tracks prerequisite relationships. Learner mastery scores in `learner_mastery` drive adaptive path recommendations — learners skip mastered concepts and get remedial content where they struggle.'
      ),
      jsonb_build_object('id','roadmap','title','Product Roadmap','type','markdown','body',
        '## Short Term (0–3 months)' || E'\n\n' ||
        '- [x] Bengali-first UI with bilingual AI tutor' || E'\n' ||
        '- [x] Video timestamp RAG pipeline' || E'\n' ||
        '- [x] Live job market signals dashboard' || E'\n' ||
        '- [x] Concept graph and adaptive learning paths' || E'\n' ||
        '- [ ] Certificate generation and verification' || E'\n' ||
        '- [ ] Peer review system for project submissions' || E'\n\n' ||
        '## Mid Term (3–9 months)' || E'\n\n' ||
        '- [ ] Enterprise/institutional admin panel' || E'\n' ||
        '- [ ] Mobile app (React Native)' || E'\n' ||
        '- [ ] Expanded track library with community contributions' || E'\n' ||
        '- [ ] Live coding IDE integration' || E'\n\n' ||
        '## Long Term (9–24 months)' || E'\n\n' ||
        '- [ ] Multi-tenant white-label platform for universities' || E'\n' ||
        '- [ ] Regional expansion: West Bengal, Assam, global diaspora' || E'\n' ||
        '- [ ] AI-generated track creation from syllabus upload'
      ),
      jsonb_build_object('id','security','title','Security','type','markdown','body',
        '## Authentication' || E'\n\n' ||
        '- Supabase Auth handles all credential management (bcrypt, JWT sessions)' || E'\n' ||
        '- OAuth 2.0 via Google and GitHub — no passwords stored in app' || E'\n' ||
        '- Session cookies managed by @supabase/ssr; CSRF protected' || E'\n\n' ||
        '## RBAC' || E'\n\n' ||
        '- `learner` — default; can only access own data' || E'\n' ||
        '- `institutional_admin` — manages enrolled users within their institution' || E'\n' ||
        '- `platform_admin` — full admin access (docs, API keys, audit logs)' || E'\n\n' ||
        '## Data Protection' || E'\n\n' ||
        '- Row Level Security (RLS) enforced on all user data tables' || E'\n' ||
        '- Admin operations use service role key (server-side only, never exposed to client)' || E'\n' ||
        '- API keys stored encrypted in `admin_config`; masked in UI (first 4 + last 4 chars)'
      ),
      jsonb_build_object('id','analytics','title','Analytics & Live Dashboard','type','live-stats','body','Live platform metrics — auto-synced from the database.'),
      jsonb_build_object('id','changelog','title','Changelog','type','markdown','body',
        '## v0.3 — 2026-06-12' || E'\n' ||
        '- Rebuilt /docs module with full YC pitch deck + technical documentation' || E'\n' ||
        '- Admin panel: structured section editor, visibility scheduler, team manager with photo upload' || E'\n' ||
        '- Architecture and Data Flow diagrams (Mermaid)' || E'\n' ||
        '- Live stats dashboard and feature matrix' || E'\n\n' ||
        '## v0.2 — 2026-06-10' || E'\n' ||
        '- Job market intelligence with 5-source scraping and Jaccard skill matching' || E'\n' ||
        '- Skill taxonomy and auto-awarding on lesson completion' || E'\n' ||
        '- Data Science full curriculum with 30+ lessons and transcript chunks' || E'\n\n' ||
        '## v0.1 — 2026-06-01' || E'\n' ||
        '- Initial launch: RAG tutor, concept graph, Bengali subtitle pipeline' || E'\n' ||
        '- Supabase auth, enrollments, progress tracking'
      )
    ),
    'team', jsonb_build_object(
      'name', 'Team Fixeth',
      'members', jsonb_build_array(
        jsonb_build_object('id','1','full_name','Jawat Al Sovon','role','Team Lead','email',null,'avatar_url',null),
        jsonb_build_object('id','2','full_name','Shafin Ahmed','role','Full Stack Developer','email','ahmedshafin240@gmail.com','avatar_url',null),
        jsonb_build_object('id','3','full_name','Rafsan Jani','role','Full Stack Developer','email',null,'avatar_url',null),
        jsonb_build_object('id','4','full_name','S M Sadman Sakib Sayor','role','ML Engineer','email',null,'avatar_url',null)
      )
    )
  ),
  true,
  false,
  TIMESTAMP WITH TIME ZONE '2026-06-10 00:00:00+06',
  TIMESTAMP WITH TIME ZONE '2026-06-14 23:59:00+06'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  is_published = true,
  visible_override = false,
  start_ts = TIMESTAMP WITH TIME ZONE '2026-06-10 00:00:00+06',
  end_ts = TIMESTAMP WITH TIME ZONE '2026-06-14 23:59:00+06',
  updated_at = now();

-- 2. Create team-avatars storage bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('team-avatars', 'team-avatars', true, 2097152, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 3. RLS policy: public read for team-avatars objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'team-avatars public read'
  ) THEN
    CREATE POLICY "team-avatars public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'team-avatars');
  END IF;
END $$;

COMMIT;
