-- Migration: create features table for feature matrix

CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planned', -- planned|upcoming|current
  created_at timestamptz DEFAULT now()
);

-- Seed sample features (only if none exist)
INSERT INTO features (name, description, status)
SELECT 'RAG Tutor', 'Retrieval-augmented tutor using pgvector and LLMs', 'current'
WHERE NOT EXISTS (SELECT 1 FROM features);

INSERT INTO features (name, description, status)
SELECT 'Playwright Job Scraper', 'Weekly job market scraping via Playwright', 'current'
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Playwright Job Scraper');

INSERT INTO features (name, description, status)
SELECT 'Docs Live Module', 'Public docs + pitch deck with scheduling and admin controls', 'current'
WHERE NOT EXISTS (SELECT 1 FROM features WHERE name = 'Docs Live Module');
