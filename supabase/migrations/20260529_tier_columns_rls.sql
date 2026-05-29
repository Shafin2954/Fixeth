-- Tier columns + extended RLS for user-scoped tables

ALTER TABLE tracks
  ADD COLUMN IF NOT EXISTS tier INT CHECK (tier BETWEEN 1 AND 3);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS ui_tier INT DEFAULT 1 CHECK (ui_tier BETWEEN 1 AND 3);

COMMENT ON COLUMN tracks.tier IS '1=non-tech, 2=foundation tech, 3=advanced tech';
COMMENT ON COLUMN users.ui_tier IS 'Adaptive UI tier derived from enrolled track';

-- adaptive_paths
ALTER TABLE adaptive_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own rows only" ON adaptive_paths;
CREATE POLICY "own rows only" ON adaptive_paths
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own rows only" ON certificates;
CREATE POLICY "own rows only" ON certificates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- financial_aid
ALTER TABLE financial_aid ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own rows only" ON financial_aid;
CREATE POLICY "own rows only" ON financial_aid
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- enrollments / progress: ensure INSERT + UPDATE work (SELECT required for UPDATE)
DROP POLICY IF EXISTS "own rows only" ON enrollments;
CREATE POLICY "own rows only" ON enrollments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own rows only" ON progress;
CREATE POLICY "own rows only" ON progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own rows only" ON learner_mastery;
CREATE POLICY "own rows only" ON learner_mastery
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own rows only" ON quiz_results;
CREATE POLICY "own rows only" ON quiz_results
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "own rows only" ON submissions;
CREATE POLICY "own rows only" ON submissions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
