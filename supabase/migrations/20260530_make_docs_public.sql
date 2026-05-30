-- Migration: mark main docs visible immediately (override scheduling)

BEGIN;

UPDATE docs
SET visible_override = true,
    is_published = true,
    published_at = now()
WHERE slug = 'main';

COMMIT;
