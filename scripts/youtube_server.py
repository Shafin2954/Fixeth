#!/usr/bin/env python3
"""
FastAPI server — YouTube audio download + Whisper transcription
n8n calls POST /process-video, gets back transcript + segments
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pytubefix import YouTube
import whisper
import subprocess
import os
import json
from pathlib import Path

app = FastAPI()

AUDIO_DIR = Path("C:/Temp/youtube_audio")
TRANSCRIPT_DIR = Path("C:/Temp/whisper_output")
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)

# Load Whisper model once at startup (small = good balance of speed/accuracy)
print("Loading Whisper model...")
whisper_model = whisper.load_model("small")
print("Whisper model ready.")


@app.post("/process-video")
async def process_video(youtube_id: str, lesson_id: str):
    """
    Download audio + transcribe with Whisper.

    Args:
        youtube_id: YouTube video ID (e.g. "dQw4w9WgXcQ")
        lesson_id:  UUID of the lesson row in Supabase

    Returns:
        {
            "success": true,
            "lesson_id": "...",
            "youtube_id": "...",
            "title": "...",
            "transcript": "full text",
            "segments": [{"start": 0.0, "end": 4.2, "text": "..."}, ...]
        }
    """
    try:
        audio_path = AUDIO_DIR / f"{youtube_id}.mp3"
        transcript_path = TRANSCRIPT_DIR / f"{youtube_id}.json"

        # ── 1. Return cached transcript if available ──────────────
        if transcript_path.exists():
            with open(transcript_path, "r", encoding="utf-8") as f:
                cached = json.load(f)
            return JSONResponse({
                "success": True,
                "lesson_id": lesson_id,
                "youtube_id": youtube_id,
                "title": cached.get("title", "unknown"),
                "transcript": cached["transcript"],
                "segments": cached["segments"],
                "cached": True
            })

        # ── 2. Download audio via pytubefix ───────────────────────
        title = "unknown"
        if not audio_path.exists():
            youtube_url = f"https://www.youtube.com/watch?v={youtube_id}"
            yt = YouTube(youtube_url, use_oauth=False, allow_oauth_cache=True)
            title = yt.title

            # Get best audio-only stream
            stream = yt.streams.get_audio_only()
            if not stream:
                raise Exception("No audio stream found for this video.")

            # Download to a temp file
            tmp_path = stream.download(
                output_path=str(AUDIO_DIR),
                filename=f"{youtube_id}_tmp"
            )

            # Convert to mp3 via ffmpeg
            subprocess.run([
                "ffmpeg", "-y", "-i", tmp_path,
                "-q:a", "0", "-map", "a",
                str(audio_path)
            ], check=True, capture_output=True)

            os.remove(tmp_path)
        else:
            title = "unknown (cached audio)"

        # ── 3. Transcribe with Whisper ────────────────────────────
        result = whisper_model.transcribe(
            str(audio_path),
            language=None,        # auto-detect (handles both EN and BN)
            task="transcribe",
            verbose=False
        )

        segments = [
            {
                "start": round(seg["start"], 3),
                "end": round(seg["end"], 3),
                "text": seg["text"].strip()
            }
            for seg in result["segments"]
        ]

        transcript_text = result["text"].strip()

        # ── 4. Cache transcript to disk ───────────────────────────
        cache_data = {
            "title": title,
            "transcript": transcript_text,
            "segments": segments
        }
        with open(transcript_path, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)

        return JSONResponse({
            "success": True,
            "lesson_id": lesson_id,
            "youtube_id": youtube_id,
            "title": title,
            "transcript": transcript_text,
            "segments": segments,
            "cached": False
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Processing failed: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "youtube-processor", "whisper_model": "small"}


if __name__ == "__main__":
    import uvicorn
    print("🎬 YouTube Processor starting on http://localhost:8001")
    print("   POST /process-video?youtube_id=VIDEO_ID&lesson_id=UUID")
    uvicorn.run(app, host="127.0.0.1", port=8001, reload=False)