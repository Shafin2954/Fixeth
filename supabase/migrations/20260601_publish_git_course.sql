-- Publish the Git & Version Control track so it appears in the open enrollment library.

UPDATE tracks
SET published = true
WHERE slug = 'git-version-control';
