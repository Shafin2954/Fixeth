-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  auth_provider TEXT CHECK (auth_provider IN ('google', 'github', 'email')),
  role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'institutional_admin', 'platform_admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  institution_id UUID,
  onboarding_complete BOOLEAN DEFAULT false,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'bn')),
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);

-- Tracks
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER DEFAULT 0,
  difficulty TEXT,
  estimated_hours INTEGER,
  skills TEXT[],
  published BOOLEAN DEFAULT false
);

-- Concepts (graph nodes)
CREATE TABLE concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  UNIQUE(label, track_id)
);

-- Concept edges (graph edges)
CREATE TABLE concept_edges (
  from_concept UUID REFERENCES concepts(id) ON DELETE CASCADE,
  to_concept UUID REFERENCES concepts(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('requires', 'reinforces')),
  PRIMARY KEY (from_concept, to_concept)
);

-- Learner mastery
CREATE TABLE learner_mastery (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
  score NUMERIC DEFAULT 0,
  mastered BOOLEAN DEFAULT false,
  mastered_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, concept_id)
);

-- Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  UNIQUE(track_id, order_index)
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_video_id TEXT,
  notes TEXT,
  order_index INTEGER NOT NULL,
  concept_ids UUID[],
  UNIQUE(module_id, order_index)
);

-- Lesson resources
CREATE TABLE lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  label TEXT,
  url TEXT
);

-- Subtitles
CREATE TABLE subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  lang TEXT CHECK (lang IN ('en', 'bn')),
  vtt_url TEXT,
  auto_score NUMERIC,
  reviewed BOOLEAN DEFAULT false,
  UNIQUE(lesson_id, lang)
);

-- Transcript chunks (pgvector)
CREATE TABLE transcript_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_text TEXT,
  start_time NUMERIC,
  end_time NUMERIC,
  embedding vector(1536)
);

-- Create index for pgvector similarity search
CREATE INDEX ON transcript_chunks USING ivfflat (embedding vector_cosine_ops);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  current_lesson_id UUID REFERENCES lessons(id),
  progress_percent NUMERIC DEFAULT 0,
  final_score NUMERIC,
  certificate_id UUID,
  financial_aid BOOLEAN DEFAULT false,
  UNIQUE(user_id, track_id)
);

-- Submissions (for projects/code challenges)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('quiz', 'coding', 'project', 'peer_review')),
  answer_text TEXT,
  code_text TEXT,
  submission_url TEXT,
  score NUMERIC,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  evaluated_at TIMESTAMPTZ
);

-- RLS policies (optional for auth layer)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_mastery ENABLE ROW LEVEL SECURITY;

-- Indexes for query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_track ON enrollments(track_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_learner_mastery_user ON learner_mastery(user_id);
CREATE INDEX idx_concepts_track ON concepts(track_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
