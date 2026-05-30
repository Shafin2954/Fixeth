-- Migration: update team members in main docs content (no contacts/emails)

BEGIN;

-- Update JSON content team array for main doc
UPDATE docs
SET content = jsonb_set(coalesce(content, '{}'::jsonb), '{team}', '[
  { "full_name": "Jawat Al Sovon", "role": "Team Lead", "email": null, "avatar_url": null },
  { "full_name": "Shafin Ahmed", "role": "Member", "email": null, "avatar_url": null },
  { "full_name": "Rafsan Jani", "role": "Member", "email": null, "avatar_url": null },
  { "full_name": "S M Sadman Sakib Sayor", "role": "Member", "email": null, "avatar_url": null }
]'::jsonb, true),
    updated_at = now()
WHERE slug = 'main';

-- Insert docs_team_members rows if missing
INSERT INTO docs_team_members (docs_id, full_name, role, email, avatar_url)
SELECT d.id, t.full_name, t.role, NULL, NULL
FROM docs d,
LATERAL (
  VALUES
    ('Jawat Al Sovon', 'Team Lead'),
    ('Shafin Ahmed', 'Member'),
    ('Rafsan Jani', 'Member'),
    ('S M Sadman Sakib Sayor', 'Member')
) AS t(full_name, role)
WHERE d.slug = 'main'
  AND NOT EXISTS (
    SELECT 1 FROM docs_team_members m WHERE m.docs_id = d.id AND m.full_name = t.full_name
  );

-- Snapshot version
INSERT INTO docs_versions (docs_id, version_number, content, edited_by, note)
SELECT id, COALESCE((SELECT max(version_number) FROM docs_versions dv WHERE dv.docs_id = docs.id), 0) + 1, content, NULL, 'Update team members (seed)'
FROM docs WHERE slug = 'main';

COMMIT;
