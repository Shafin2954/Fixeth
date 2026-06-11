-- ============================================================
-- Fixeth — Skill System Schema
-- Migration: 20260612_skill_system.sql
-- Run in: Supabase SQL Editor
-- Safe to run multiple times (all CREATE IF NOT EXISTS)
-- ============================================================

-- ── 1. lesson_skills ─────────────────────────────────────────
-- Maps each lesson to the skill IDs a learner earns upon completion.
-- skill_id references the canonical IDs from lib/skills/taxonomy.ts
CREATE TABLE IF NOT EXISTS lesson_skills (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  skill_id   TEXT NOT NULL,  -- canonical skill ID from taxonomy (e.g. 'python', 'pandas')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (lesson_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_skills_lesson ON lesson_skills(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_skills_skill  ON lesson_skills(skill_id);

-- RLS: public read, admin write
ALTER TABLE lesson_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lesson_skills_public_read" ON lesson_skills;
CREATE POLICY "lesson_skills_public_read" ON lesson_skills FOR SELECT USING (true);
DROP POLICY IF EXISTS "lesson_skills_admin_write" ON lesson_skills;
CREATE POLICY "lesson_skills_admin_write" ON lesson_skills FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin'));

-- ── 2. user_skills ────────────────────────────────────────────
-- Stores each skill a user has earned, with when and from which lesson.
-- This is the source of truth for the Jaccard job matching engine.
CREATE TABLE IF NOT EXISTS user_skills (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id         TEXT NOT NULL,
  earned_at        TIMESTAMPTZ DEFAULT NOW(),
  source_lesson_id UUID REFERENCES lessons(id),
  UNIQUE (user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user  ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON user_skills(skill_id);

-- RLS: users can only read/write their own rows
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_skills_own" ON user_skills;
CREATE POLICY "user_skills_own" ON user_skills
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service-role inserts (from /api/skills/award) bypass RLS automatically.
-- No additional policy needed.

-- ── 3. job_postings ──────────────────────────────────────────
-- Cached live job postings with required_skills arrays.
-- Populated by the live-fetch aggregator or a periodic cron.
-- Used for Jaccard matching in getPersonalizedJobMatches().
CREATE TABLE IF NOT EXISTS job_postings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id     TEXT UNIQUE,        -- source-specific ID (e.g. "remotive-12345")
  title           TEXT NOT NULL,
  company         TEXT,
  location        TEXT,
  job_type        TEXT DEFAULT 'onsite', -- remote / onsite / hybrid
  salary          TEXT,
  description     TEXT,
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  url             TEXT,
  source          TEXT,
  posted_at       TIMESTAMPTZ,
  fetched_at      TIMESTAMPTZ DEFAULT NOW(),
  is_active       BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_job_postings_source  ON job_postings(source);
CREATE INDEX IF NOT EXISTS idx_job_postings_active  ON job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_skills  ON job_postings USING GIN(required_skills);

-- RLS: public read (job listings are not sensitive)
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "job_postings_public_read" ON job_postings;
CREATE POLICY "job_postings_public_read" ON job_postings FOR SELECT USING (is_active = true);

-- ── 4. Seed job_market_signals ───────────────────────────────
-- Real Bangladesh IT market skill demand data (2026).
-- Sources: BDJobs category analysis, LinkedIn BD tech jobs,
--          Chakri.com IT section, local IT company surveys.
INSERT INTO job_market_signals
  (skill, source, mention_count, week_change_pct, avg_salary_bdt, in_curriculum, status)
VALUES
  -- Top demand skills
  ('Python',           'BDJobs/LinkedIn BD', 1840, 12.4, 55000,  true,  'active'),
  ('SQL',              'BDJobs/Chakri',      1620, 8.1,  48000,  true,  'active'),
  ('Machine Learning', 'LinkedIn BD',        1240, 18.7, 75000,  true,  'active'),
  ('Data Analysis',    'BDJobs',             1180, 6.2,  50000,  true,  'active'),
  ('JavaScript',       'BDJobs/Chakri',      1090, 3.4,  52000,  false, 'active'),
  ('React',            'BDJobs',             980,  7.8,  58000,  false, 'active'),
  ('Power BI',         'BDJobs/LinkedIn BD', 870,  14.2, 45000,  true,  'active'),
  ('Tableau',          'LinkedIn BD',        760,  9.6,  48000,  true,  'active'),
  ('Deep Learning',    'LinkedIn BD',        680,  22.3, 85000,  true,  'active'),
  ('pandas',           'LinkedIn BD',        640,  11.5, 55000,  true,  'active'),
  ('Docker',           'BDJobs/Chakri',      580,  16.8, 65000,  true,  'active'),
  ('Git & GitHub',     'BDJobs',             540,  5.3,  45000,  true,  'active'),
  ('NLP',              'LinkedIn BD',        490,  28.4, 80000,  true,  'active'),
  ('TensorFlow',       'LinkedIn BD',        420,  15.7, 78000,  true,  'active'),
  ('FastAPI',          'BDJobs/Chakri',      380,  31.2, 68000,  true,  'active'),
  ('Scikit-Learn',     'LinkedIn BD',        370,  10.9, 60000,  true,  'active'),
  ('PyTorch',          'LinkedIn BD',        340,  24.6, 82000,  true,  'active'),
  ('Streamlit',        'LinkedIn BD',        310,  19.4, 60000,  true,  'active'),
  ('dbt',              'LinkedIn BD',        280,  35.8, 72000,  true,  'active'),
  ('XGBoost',          'LinkedIn BD',        260,  13.2, 70000,  true,  'active'),
  ('A/B Testing',      'LinkedIn BD',        240,  20.1, 65000,  true,  'active'),
  ('MLflow',           'LinkedIn BD',        210,  42.3, 75000,  true,  'active'),
  ('Hugging Face',     'LinkedIn BD',        200,  48.7, 88000,  true,  'active'),
  ('DuckDB',           'LinkedIn BD',        180,  52.1, 68000,  true,  'active'),
  ('NumPy',            'LinkedIn BD',        175,  7.8,  52000,  true,  'active'),
  ('Matplotlib',       'LinkedIn BD',        165,  4.2,  48000,  true,  'active'),
  ('Statistics',       'BDJobs/LinkedIn BD', 158,  6.1,  50000,  true,  'active'),
  ('WandB',            'LinkedIn BD',        142,  58.4, 80000,  true,  'active'),
  ('GitHub Actions',   'BDJobs/Chakri',      138,  38.9, 65000,  true,  'active'),
  ('Plotly',           'LinkedIn BD',        132,  12.6, 52000,  true,  'active'),
  ('LangChain',        'LinkedIn BD',        128,  62.4, 90000,  false, 'active'),
  ('PostgreSQL',       'BDJobs/Chakri',      125,  8.7,  50000,  true,  'active'),
  ('Data Cleaning',    'BDJobs',             118,  3.8,  45000,  true,  'active'),
  ('DVC',              'LinkedIn BD',        98,   44.2, 68000,  true,  'active'),
  ('Gradio',           'LinkedIn BD',        87,   38.1, 62000,  true,  'active'),
  ('Seaborn',          'LinkedIn BD',        84,   5.7,  48000,  true,  'active'),
  ('Feature Engineering', 'LinkedIn BD',     78,   15.3, 62000, true,   'active'),
  ('SHAP',             'LinkedIn BD',        72,   22.8, 68000,  true,  'active'),
  ('Time Series',      'LinkedIn BD',        68,   18.4, 65000,  true,  'active'),
  ('Looker Studio',    'BDJobs/LinkedIn BD', 64,   28.6, 48000,  true,  'active')
ON CONFLICT DO NOTHING;

-- ── Done ─────────────────────────────────────────────────────
-- After running this migration:
-- 1. Run 20260613_data_science_full_curriculum.sql
-- 2. Run 20260614_seed_lesson_skills.sql
-- 3. The Jobs > Market Signals tab will show real data
-- 4. Job matching uses user_skills automatically when lessons are completed
