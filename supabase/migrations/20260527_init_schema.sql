-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ── USERS ───────────────────────────────────────────────────
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT UNIQUE NOT NULL,
  name                TEXT,
  username            TEXT UNIQUE,
  avatar_url          TEXT,
  role                TEXT DEFAULT 'learner',
  plan                TEXT DEFAULT 'free',
  institution_id      UUID,
  preferred_language  TEXT DEFAULT 'en',
  preferred_theme     TEXT DEFAULT 'dark',
  goal                TEXT,
  experience_level    TEXT,
  byoa_provider       TEXT,
  streak              INT DEFAULT 0,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  last_active         TIMESTAMPTZ
);

-- ── CURRICULUM ──────────────────────────────────────────────
CREATE TABLE tracks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  title_en        TEXT NOT NULL,
  title_bn        TEXT,
  description_en  TEXT,
  description_bn  TEXT,
  price_bdt       INT DEFAULT 0,
  is_free         BOOLEAN DEFAULT FALSE,
  difficulty      TEXT,
  estimated_hours INT,
  skills          TEXT[],
  tools           TEXT[],
  published       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id    UUID REFERENCES tracks(id) ON DELETE CASCADE,
  title_en    TEXT NOT NULL,
  title_bn    TEXT,
  order_index INT NOT NULL
);

CREATE TABLE lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID REFERENCES modules(id) ON DELETE CASCADE,
  title_en         TEXT NOT NULL,
  title_bn         TEXT,
  youtube_video_id TEXT,
  notes_md         TEXT,
  notes_bn_md      TEXT,
  order_index      INT NOT NULL,
  estimated_mins   INT,
  concept_ids      UUID[]
);

CREATE TABLE lesson_resources (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  label     TEXT,
  url       TEXT
);

-- ── CONCEPT GRAPH (PostgreSQL, no separate graph DB) ────────
CREATE TABLE concepts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  track_id   UUID REFERENCES tracks(id),
  difficulty INT CHECK (difficulty BETWEEN 1 AND 5)
);

CREATE TABLE concept_edges (
  from_concept UUID REFERENCES concepts(id),
  to_concept   UUID REFERENCES concepts(id),
  type         TEXT CHECK (type IN ('requires','reinforces')),
  PRIMARY KEY (from_concept, to_concept)
);

-- ── LEARNER STATE ────────────────────────────────────────────
CREATE TABLE learner_mastery (
  user_id     UUID REFERENCES users(id),
  concept_id  UUID REFERENCES concepts(id),
  score       NUMERIC DEFAULT 0,
  mastered    BOOLEAN DEFAULT FALSE,
  attempts    INT DEFAULT 0,
  mastered_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, concept_id)
);

CREATE TABLE adaptive_paths (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID REFERENCES users(id),
  track_id  UUID REFERENCES tracks(id),
  path_json JSONB NOT NULL,
  built_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE enrollments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  track_id          UUID REFERENCES tracks(id),
  enrolled_at       TIMESTAMPTZ DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  current_lesson_id UUID REFERENCES lessons(id),
  progress_percent  NUMERIC DEFAULT 0,
  final_score       NUMERIC,
  grade             TEXT,
  certificate_id    UUID,
  financial_aid     BOOLEAN DEFAULT FALSE,
  UNIQUE (user_id, track_id)
);

CREATE TABLE progress (
  user_id      UUID REFERENCES users(id),
  lesson_id    UUID REFERENCES lessons(id),
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  watch_pct    INT DEFAULT 0,
  PRIMARY KEY (user_id, lesson_id)
);

-- ── KNOWLEDGE RETRIEVAL (pgvector RAG) ──────────────────────
CREATE TABLE transcript_chunks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  UUID REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  start_time NUMERIC,
  end_time   NUMERIC,
  embedding  VECTOR(1536)
);

CREATE INDEX ON transcript_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- pgvector similarity search RPC
CREATE OR REPLACE FUNCTION match_transcript_chunks(
  query_embedding VECTOR(1536),
  target_lesson_id UUID,
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID, chunk_text TEXT,
  start_time NUMERIC, end_time NUMERIC, similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT id, chunk_text, start_time, end_time,
         1 - (embedding <=> query_embedding) AS similarity
  FROM transcript_chunks
  WHERE lesson_id = target_lesson_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- ── SUBTITLES ────────────────────────────────────────────────
CREATE TABLE subtitles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      UUID REFERENCES lessons(id),
  lang           TEXT NOT NULL,
  vtt_url        TEXT,
  cues_json      JSONB,
  quality_score  NUMERIC,
  auto_published BOOLEAN DEFAULT FALSE,
  reviewed       BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (lesson_id, lang)
);

-- ── ASSESSMENT ──────────────────────────────────────────────
CREATE TABLE quiz_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID REFERENCES lessons(id),
  concept_id   UUID REFERENCES concepts(id),
  question_en  TEXT NOT NULL,
  question_bn  TEXT,
  options      JSONB NOT NULL,
  difficulty   INT DEFAULT 2,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  quiz_item_id    UUID REFERENCES quiz_items(id),
  selected_index  INT,
  is_correct      BOOLEAN,
  time_taken_secs INT,
  attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id),
  lesson_id         UUID REFERENCES lessons(id),
  type              TEXT,
  file_urls         TEXT[],
  notes             TEXT,
  score             NUMERIC,
  max_score         NUMERIC DEFAULT 100,
  grade_breakdown   JSONB,
  ai_feedback       TEXT,
  ai_feedback_bn    TEXT,
  peer_reviews      JSONB,
  status            TEXT DEFAULT 'submitted',
  plagiarism_score  NUMERIC,
  integrity_flagged BOOLEAN DEFAULT FALSE,
  graded_by         TEXT DEFAULT 'pending',
  submitted_at      TIMESTAMPTZ DEFAULT NOW(),
  graded_at         TIMESTAMPTZ
);

-- ── CERTIFICATES ─────────────────────────────────────────────
CREATE TABLE certificates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  track_id      UUID REFERENCES tracks(id),
  enrollment_id UUID REFERENCES enrollments(id),
  cert_hash     TEXT UNIQUE NOT NULL,
  score         NUMERIC,
  grade         TEXT,
  pdf_url       TEXT,
  issued_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── JOB MARKET ───────────────────────────────────────────────
CREATE TABLE job_market_signals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill           TEXT NOT NULL,
  source          TEXT,
  mention_count   INT,
  week_change_pct NUMERIC,
  avg_salary_bdt  INT,
  in_curriculum   BOOLEAN DEFAULT FALSE,
  status          TEXT DEFAULT 'pending_review',
  scraped_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── FINANCIAL AID ────────────────────────────────────────────
CREATE TABLE financial_aid (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  track_id     UUID REFERENCES tracks(id),
  reason       TEXT,
  income_range TEXT,
  status       TEXT DEFAULT 'pending',
  applied_at   TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE enrollments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results    ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own rows only" ON enrollments
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON learner_mastery
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON progress
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON quiz_results
  USING (auth.uid() = user_id);
CREATE POLICY "own rows only" ON submissions
  USING (auth.uid() = user_id);