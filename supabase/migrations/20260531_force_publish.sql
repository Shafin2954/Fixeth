-- Migration: force publish main docs now (clear schedule, set published)

BEGIN;

UPDATE docs
SET visible_override = true,
    is_published = true,
    start_ts = NULL,
    end_ts = NULL,
    published_at = now()
WHERE slug = 'main';

COMMIT;
