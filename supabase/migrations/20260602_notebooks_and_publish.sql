-- ─────────────────────────────────────────────────────────────
-- 1. Publish the Git & GitHub track so it shows in the library
-- ─────────────────────────────────────────────────────────────
UPDATE tracks
SET published = true
WHERE slug = 'git-version-control';

-- ─────────────────────────────────────────────────────────────
-- 2. Notebooks: user-owned Jupyter-style notebooks.
--    A notebook may be standalone (lesson_id / track_id NULL) or
--    attached to a lesson ("practice this notebook").
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notebooks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id  UUID REFERENCES lessons(id) ON DELETE SET NULL,
  track_id   UUID REFERENCES tracks(id) ON DELETE SET NULL,
  title      TEXT NOT NULL DEFAULT 'Untitled notebook',
  -- cells: [{ id, type: 'code' | 'markdown', source: string, outputs?: any[] }]
  cells      JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notebooks_user_idx ON notebooks (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS notebooks_lesson_idx ON notebooks (lesson_id);

ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notebooks_select_own" ON notebooks;
DROP POLICY IF EXISTS "notebooks_insert_own" ON notebooks;
DROP POLICY IF EXISTS "notebooks_update_own" ON notebooks;
DROP POLICY IF EXISTS "notebooks_delete_own" ON notebooks;

CREATE POLICY "notebooks_select_own" ON notebooks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notebooks_insert_own" ON notebooks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notebooks_update_own" ON notebooks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notebooks_delete_own" ON notebooks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Optional: lesson authors can attach a "starter notebook" to a lesson by
-- inserting a row with a NULL user_id is not allowed (user_id is NOT NULL),
-- so starter notebooks are seeded per-user on first open by the app.
