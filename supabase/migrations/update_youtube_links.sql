CREATE TEMP TABLE youtube_imports (
  lesson_id UUID NOT NULL,
  youtube_video_id TEXT NOT NULL
);

COPY youtube_imports (lesson_id, youtube_video_id)
FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER ',');

UPDATE lessons
SET youtube_video_id = yt.youtube_video_id
FROM youtube_imports yt
WHERE lessons.id = yt.lesson_id
  AND yt.youtube_video_id IS NOT NULL
  AND yt.youtube_video_id <> '';

DROP TABLE youtube_imports;

