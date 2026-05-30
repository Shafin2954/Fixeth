-- Migration: create docs tables and default visibility window

CREATE TABLE IF NOT EXISTS docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb, -- structured blocks: { slides: [...], sections: [...] }
  is_published boolean DEFAULT false,
  visible_override boolean DEFAULT false,
  start_ts timestamptz,
  end_ts timestamptz,
  published_by uuid,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS docs_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docs_id uuid REFERENCES docs(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content jsonb NOT NULL,
  edited_by uuid,
  edited_at timestamptz DEFAULT now(),
  note text
);

CREATE TABLE IF NOT EXISTS docs_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  docs_id uuid REFERENCES docs(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text,
  email text,
  avatar_url text
);

CREATE TABLE IF NOT EXISTS docs_preview_tokens (
  token text PRIMARY KEY,
  docs_id uuid REFERENCES docs(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

-- Insert a default main docs row with the required default window (June 10 -> June 14)
INSERT INTO docs (slug, title, content, is_published, start_ts, end_ts)
SELECT 'main', 'Fixeth — Live Documentation & Pitch', jsonb_build_object('hero', jsonb_build_object('title','Fixeth','subtitle','Live Docs & Pitch Deck')), true,
       TIMESTAMP WITH TIME ZONE '2026-06-10 00:00:00+06', TIMESTAMP WITH TIME ZONE '2026-06-14 23:59:00+06'
WHERE NOT EXISTS (SELECT 1 FROM docs WHERE slug = 'main');

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION docs_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS docs_set_updated_at ON docs;
CREATE TRIGGER docs_set_updated_at BEFORE UPDATE ON docs
FOR EACH ROW EXECUTE PROCEDURE docs_updated_at();
