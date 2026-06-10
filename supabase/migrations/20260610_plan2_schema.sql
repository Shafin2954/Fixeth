-- ============================================================
-- Fixeth — PLAN2 Schema Additions
-- Migration: 20260610_plan2_schema.sql
-- Run in: Supabase SQL Editor (project oxfynuytsnifqqhbmpcv)
-- ============================================================

-- ── 1. NRB preference columns on users ──────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS nrb_mode    BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code TEXT;

-- ── 2. NRB relevance flag on lessons ────────────────────────
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS nrb_relevant BOOLEAN DEFAULT FALSE;

-- ── 3. Per-lesson topic boundaries ──────────────────────────
-- Manually curated topic segmentation per video.
-- Used for topic-anchored RAG retrieval and timestamp-seek accuracy.
CREATE TABLE IF NOT EXISTS lesson_topics (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      UUID REFERENCES lessons(id) ON DELETE CASCADE,
  topic_label    TEXT NOT NULL,
  topic_label_bn TEXT,
  start_time     NUMERIC NOT NULL,       -- seconds from video start
  end_time       NUMERIC NOT NULL,       -- seconds from video start
  concept_id     UUID REFERENCES concepts(id),
  nrb_relevant   BOOLEAN DEFAULT FALSE,
  order_index    INT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lesson_topics_lesson     ON lesson_topics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_topics_order      ON lesson_topics(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lesson_topics_nrb        ON lesson_topics(nrb_relevant) WHERE nrb_relevant = TRUE;
CREATE INDEX IF NOT EXISTS idx_lesson_topics_time       ON lesson_topics(lesson_id, start_time, end_time);

-- RLS: lesson_topics are public read, admin write
ALTER TABLE lesson_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_topics_public_read"  ON lesson_topics FOR SELECT USING (true);
CREATE POLICY "lesson_topics_admin_write"  ON lesson_topics FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );
CREATE POLICY "lesson_topics_admin_update" ON lesson_topics FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );
CREATE POLICY "lesson_topics_admin_delete" ON lesson_topics FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );

-- ── 4. Admin-managed AI fallback keys ───────────────────────
-- One row: key = 'api_keys', value = JSON with 4 slots.
-- Server reads the active slot; client never sees the key.
CREATE TABLE IF NOT EXISTS admin_config (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Seed the initial empty key config
INSERT INTO admin_config (key, value) VALUES (
  'api_keys',
  '{"slots": [
    {"slot": 1, "key": "", "status": "empty"},
    {"slot": 2, "key": "", "status": "empty"},
    {"slot": 3, "key": "", "status": "empty"},
    {"slot": 4, "key": "", "status": "empty"}
  ]}'
) ON CONFLICT (key) DO NOTHING;

-- RLS: admin_config is admin-only (no public read — keys are sensitive)
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_config_admin_only" ON admin_config
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );

-- ── 5. Admin audit log ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_audit (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action     TEXT NOT NULL,          -- e.g. 'key_saved', 'key_activated', 'doc_updated'
  details    JSONB,                   -- action-specific payload
  actor      TEXT,                    -- admin email
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: admin_audit is admin-read, no direct insert (server-side only via service role)
ALTER TABLE admin_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_audit_admin_read" ON admin_audit
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );
-- Inserts are done via service-role in API routes, so no INSERT policy needed for anon/auth

-- ── 6. /docs site content ────────────────────────────────────
-- Each row is one docs page, edited from /admin and served at /docs/[slug].
CREATE TABLE IF NOT EXISTS docs_content (
  slug       TEXT PRIMARY KEY,        -- e.g. 'architecture', 'prompts', 'data-strategy'
  title      TEXT NOT NULL,
  content_md TEXT NOT NULL,
  published  BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Seed initial docs pages (empty — admin will fill them in)
INSERT INTO docs_content (slug, title, content_md) VALUES
  ('architecture',       'Architecture Blueprint',        ''),
  ('data-strategy',      'Data Strategy & Privacy',       ''),
  ('scalability',        'Scalability Roadmap',           ''),
  ('ethics',             'Ethics & Responsible AI',       ''),
  ('prompts',            'Prompt Registry',               '')
ON CONFLICT (slug) DO NOTHING;

-- RLS: docs_content is public read (the /docs site is public), admin write
ALTER TABLE docs_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docs_content_public_read" ON docs_content
  FOR SELECT USING (published = TRUE);
CREATE POLICY "docs_content_admin_write" ON docs_content
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );
CREATE POLICY "docs_content_admin_update" ON docs_content
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin')
  );

-- ── 7. RLS policy for users.nrb_mode ────────────────────────
-- The existing users RLS allows users to update their own row.
-- nrb_mode and country_code are user-controlled fields, so no extra policy needed.
-- Verify the existing policy covers UPDATE on new columns:
-- SELECT * FROM pg_policies WHERE tablename = 'users';

-- ── 8. Verify lesson_topics RPC helper (optional, for easier querying) ──
-- This function returns topics for a lesson with their transcript chunks,
-- used by the Tutor Agent for topic-anchored retrieval.
CREATE OR REPLACE FUNCTION get_lesson_topics_with_chunks(p_lesson_id UUID)
RETURNS TABLE (
  topic_id       UUID,
  topic_label    TEXT,
  topic_label_bn TEXT,
  start_time     NUMERIC,
  end_time       NUMERIC,
  order_index    INT,
  nrb_relevant   BOOLEAN,
  chunk_id       UUID,
  chunk_text     TEXT,
  chunk_start    NUMERIC,
  chunk_end      NUMERIC,
  embedding      VECTOR(768)
) AS $$
  SELECT
    t.id           AS topic_id,
    t.topic_label,
    t.topic_label_bn,
    t.start_time,
    t.end_time,
    t.order_index,
    t.nrb_relevant,
    c.id           AS chunk_id,
    c.chunk_text,
    c.start_time   AS chunk_start,
    c.end_time     AS chunk_end,
    c.embedding
  FROM lesson_topics t
  LEFT JOIN transcript_chunks c
    ON c.lesson_id = t.lesson_id
    AND c.start_time >= t.start_time
    AND c.start_time <  t.end_time
  WHERE t.lesson_id = p_lesson_id
  ORDER BY t.order_index, c.start_time;
$$ LANGUAGE sql STABLE;

-- ── Done ─────────────────────────────────────────────────────
-- After running this migration:
-- 1. Go to /admin (set your role to platform_admin first if needed)
-- 2. Paste your Gemini API key in slot 1, mark it active
-- 3. Start adding lesson_topics rows for the 5 hero videos (see plan2.md §6)
-- 4. Confirm /api/chat works without a BYOA key
