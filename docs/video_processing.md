# Video Processing Pipeline

This guide covers the complete workflow for processing YouTube videos to enable the **Chat with Video** and **Timestamp Intelligence** features in Fixeth.

---

## Overview

The video processing pipeline extracts transcripts from YouTube videos, chunks them with timestamps, generates vector embeddings, and stores them in Supabase for semantic search. This is a **one-time processing cost per video**.

```
YouTube Video
    │
    ▼
┌─────────────────────┐
│  1. TRANSCRIPTION   │  Whisper (local) or YouTube captions
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  2. CHUNKING        │  Sentence-boundary split with overlap
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  3. EMBEDDING       │  sentence-transformers (free) or OpenAI
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  4. STORE IN DB     │  Supabase transcript_chunks table
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  5. QUERY (runtime) │  match_transcript_chunks RPC
└─────────────────────┘
```

---

## Database Schema

The `transcript_chunks` table (already in schema):

```sql
CREATE TABLE transcript_chunks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id  UUID REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  start_time NUMERIC,       -- seconds
  end_time   NUMERIC,       -- seconds
  embedding  VECTOR(1536)   -- or VECTOR(384) for free embeddings
);

CREATE INDEX ON transcript_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

**Note:** If using the free embedding model (384 dimensions), update the schema:
```sql
ALTER TABLE transcript_chunks 
ALTER COLUMN embedding TYPE VECTOR(384);
```

---

## Part 1: Processing Videos

### Option A: Fully Free Stack (Recommended for MVP)

**Requirements:**
- Python 3.9+
- ~4GB disk space for Whisper model
- CPU (slow) or GPU (fast)

**Install dependencies:**
```bash
pip install yt-dlp openai-whisper spacy sentence-transformers supabase python-dotenv

# Download spaCy English model for sentence splitting
python -m spacy download en_core_web_sm
```

**Script: `scripts/process_video_free.py`**

```python
#!/usr/bin/env python3
"""
Video Processing Pipeline - Free Stack
Uses: yt-dlp, whisper (local), spaCy, sentence-transformers

Usage:
  python scripts/process_video_free.py --lesson-id <uuid> --youtube-id <video_id>
  python scripts/process_video_free.py --lesson-id abc123 --youtube-id dQw4w9WgXcQ
"""

import argparse
import os
import re
import tempfile
from pathlib import Path

import spacy
import whisper
import yt_dlp
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from supabase import create_client

load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role for inserts
WHISPER_MODEL = "base"  # Options: tiny, base, small, medium, large
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # 384 dimensions, free
CHUNK_MAX_TOKENS = 300
CHUNK_OVERLAP_SENTENCES = 2


def download_audio(youtube_id: str, output_dir: str) -> str:
    """Download audio from YouTube video."""
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    output_path = os.path.join(output_dir, "audio.mp3")
    
    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "outtmpl": os.path.join(output_dir, "audio.%(ext)s"),
        "quiet": True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    return output_path


def transcribe_audio(audio_path: str, model_name: str = WHISPER_MODEL) -> list[dict]:
    """Transcribe audio using local Whisper model.
    
    Returns list of segments with word-level timestamps:
    [{"text": "Hello world", "start": 0.0, "end": 2.5}, ...]
    """
    print(f"Loading Whisper model '{model_name}'...")
    model = whisper.load_model(model_name)
    
    print("Transcribing audio (this may take a while on CPU)...")
    result = model.transcribe(
        audio_path,
        word_timestamps=True,
        verbose=False
    )
    
    # Extract segments with timestamps
    segments = []
    for segment in result["segments"]:
        segments.append({
            "text": segment["text"].strip(),
            "start": segment["start"],
            "end": segment["end"]
        })
    
    return segments


def chunk_transcript(segments: list[dict], nlp, max_tokens: int = CHUNK_MAX_TOKENS, overlap: int = CHUNK_OVERLAP_SENTENCES) -> list[dict]:
    """Chunk transcript into overlapping segments with timestamps.
    
    Strategy:
    - Split by sentence boundaries using spaCy
    - Group 2-3 sentences per chunk
    - Overlap by 2 sentences for context continuity
    """
    # Combine all text
    full_text = " ".join([s["text"] for s in segments])
    doc = nlp(full_text)
    sentences = list(doc.sents)
    
    # Build word -> timestamp mapping
    word_times = []
    for seg in segments:
        words = seg["text"].split()
        duration = seg["end"] - seg["start"]
        time_per_word = duration / max(len(words), 1)
        
        for i, word in enumerate(words):
            word_times.append({
                "word": word,
                "start": seg["start"] + (i * time_per_word),
                "end": seg["start"] + ((i + 1) * time_per_word)
            })
    
    # Chunk sentences
    chunks = []
    i = 0
    word_idx = 0
    
    while i < len(sentences):
        # Take 2-3 sentences per chunk
        chunk_sentences = sentences[i:i + 3]
        chunk_text = " ".join([s.text.strip() for s in chunk_sentences])
        
        # Find timestamps for this chunk
        chunk_words = chunk_text.split()
        if word_idx < len(word_times):
            start_time = word_times[word_idx]["start"]
            end_idx = min(word_idx + len(chunk_words), len(word_times) - 1)
            end_time = word_times[end_idx]["end"]
        else:
            start_time = chunks[-1]["end_time"] if chunks else 0
            end_time = start_time + 10  # fallback
        
        chunks.append({
            "chunk_text": chunk_text,
            "start_time": round(start_time, 2),
            "end_time": round(end_time, 2)
        })
        
        word_idx += len(chunk_words)
        i += max(1, 3 - overlap)  # Move by (sentences - overlap)
    
    return chunks


def generate_embeddings(chunks: list[dict], model_name: str = EMBEDDING_MODEL) -> list[list[float]]:
    """Generate embeddings using sentence-transformers (free, local)."""
    print(f"Loading embedding model '{model_name}'...")
    model = SentenceTransformer(model_name)
    
    texts = [c["chunk_text"] for c in chunks]
    print(f"Generating embeddings for {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True)
    
    return [emb.tolist() for emb in embeddings]


def store_in_supabase(lesson_id: str, chunks: list[dict], embeddings: list[list[float]]):
    """Insert chunks and embeddings into Supabase."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment")
    
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Prepare rows
    rows = []
    for chunk, embedding in zip(chunks, embeddings):
        rows.append({
            "lesson_id": lesson_id,
            "chunk_text": chunk["chunk_text"],
            "start_time": chunk["start_time"],
            "end_time": chunk["end_time"],
            "embedding": embedding
        })
    
    # Delete existing chunks for this lesson (idempotent)
    client.table("transcript_chunks").delete().eq("lesson_id", lesson_id).execute()
    
    # Insert new chunks
    print(f"Inserting {len(rows)} chunks into database...")
    client.table("transcript_chunks").insert(rows).execute()
    print("Done!")


def main():
    parser = argparse.ArgumentParser(description="Process YouTube video for semantic search")
    parser.add_argument("--lesson-id", required=True, help="UUID of the lesson in database")
    parser.add_argument("--youtube-id", required=True, help="YouTube video ID (e.g., dQw4w9WgXcQ)")
    parser.add_argument("--whisper-model", default=WHISPER_MODEL, help="Whisper model size")
    args = parser.parse_args()
    
    # Load spaCy
    print("Loading spaCy model...")
    nlp = spacy.load("en_core_web_sm")
    
    with tempfile.TemporaryDirectory() as tmpdir:
        # Step 1: Download audio
        print(f"\n[1/4] Downloading audio for video: {args.youtube_id}")
        audio_path = download_audio(args.youtube_id, tmpdir)
        
        # Step 2: Transcribe
        print(f"\n[2/4] Transcribing with Whisper ({args.whisper_model})...")
        segments = transcribe_audio(audio_path, args.whisper_model)
        print(f"  Got {len(segments)} segments")
        
        # Step 3: Chunk
        print(f"\n[3/4] Chunking transcript...")
        chunks = chunk_transcript(segments, nlp)
        print(f"  Created {len(chunks)} chunks")
        
        # Step 4: Embed
        print(f"\n[4/4] Generating embeddings...")
        embeddings = generate_embeddings(chunks)
        
        # Step 5: Store
        print(f"\n[5/5] Storing in Supabase...")
        store_in_supabase(args.lesson_id, chunks, embeddings)
    
    print(f"\nSuccessfully processed video {args.youtube_id} for lesson {args.lesson_id}")


if __name__ == "__main__":
    main()
```

---

### Option B: OpenAI Stack (Better Quality, Paid)

**Cost estimate:**
- Whisper API: $0.006/min (~$0.06 for 10-min video)
- Embeddings: $0.02 per 1M tokens (~$0.001 for 10-min video)
- **Total: ~$0.06-0.10 per video**

**Install dependencies:**
```bash
pip install yt-dlp openai spacy supabase python-dotenv

python -m spacy download en_core_web_sm
```

**Script: `scripts/process_video_openai.py`**

```python
#!/usr/bin/env python3
"""
Video Processing Pipeline - OpenAI Stack
Uses: yt-dlp, OpenAI Whisper API, OpenAI Embeddings (text-embedding-3-small)

Usage:
  python scripts/process_video_openai.py --lesson-id <uuid> --youtube-id <video_id>
"""

import argparse
import os
import tempfile
from pathlib import Path

import spacy
import yt_dlp
from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client

load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = "text-embedding-3-small"  # 1536 dimensions
CHUNK_OVERLAP_SENTENCES = 2


def download_audio(youtube_id: str, output_dir: str) -> str:
    """Download audio from YouTube video."""
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    output_path = os.path.join(output_dir, "audio.mp3")
    
    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "outtmpl": os.path.join(output_dir, "audio.%(ext)s"),
        "quiet": True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    return output_path


def transcribe_with_openai(audio_path: str, client: OpenAI) -> list[dict]:
    """Transcribe using OpenAI Whisper API with word timestamps."""
    print("Transcribing with OpenAI Whisper API...")
    
    with open(audio_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )
    
    segments = []
    for segment in response.segments:
        segments.append({
            "text": segment["text"].strip(),
            "start": segment["start"],
            "end": segment["end"]
        })
    
    return segments


def chunk_transcript(segments: list[dict], nlp, overlap: int = CHUNK_OVERLAP_SENTENCES) -> list[dict]:
    """Chunk transcript into overlapping segments with timestamps."""
    full_text = " ".join([s["text"] for s in segments])
    doc = nlp(full_text)
    sentences = list(doc.sents)
    
    # Build word -> timestamp mapping
    word_times = []
    for seg in segments:
        words = seg["text"].split()
        duration = seg["end"] - seg["start"]
        time_per_word = duration / max(len(words), 1)
        
        for i, word in enumerate(words):
            word_times.append({
                "word": word,
                "start": seg["start"] + (i * time_per_word),
                "end": seg["start"] + ((i + 1) * time_per_word)
            })
    
    chunks = []
    i = 0
    word_idx = 0
    
    while i < len(sentences):
        chunk_sentences = sentences[i:i + 3]
        chunk_text = " ".join([s.text.strip() for s in chunk_sentences])
        
        chunk_words = chunk_text.split()
        if word_idx < len(word_times):
            start_time = word_times[word_idx]["start"]
            end_idx = min(word_idx + len(chunk_words), len(word_times) - 1)
            end_time = word_times[end_idx]["end"]
        else:
            start_time = chunks[-1]["end_time"] if chunks else 0
            end_time = start_time + 10
        
        chunks.append({
            "chunk_text": chunk_text,
            "start_time": round(start_time, 2),
            "end_time": round(end_time, 2)
        })
        
        word_idx += len(chunk_words)
        i += max(1, 3 - overlap)
    
    return chunks


def generate_embeddings_openai(chunks: list[dict], client: OpenAI) -> list[list[float]]:
    """Generate embeddings using OpenAI text-embedding-3-small."""
    print(f"Generating embeddings for {len(chunks)} chunks...")
    
    texts = [c["chunk_text"] for c in chunks]
    
    # Batch in groups of 100
    embeddings = []
    for i in range(0, len(texts), 100):
        batch = texts[i:i + 100]
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=batch
        )
        embeddings.extend([e.embedding for e in response.data])
    
    return embeddings


def store_in_supabase(lesson_id: str, chunks: list[dict], embeddings: list[list[float]]):
    """Insert chunks and embeddings into Supabase."""
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    rows = []
    for chunk, embedding in zip(chunks, embeddings):
        rows.append({
            "lesson_id": lesson_id,
            "chunk_text": chunk["chunk_text"],
            "start_time": chunk["start_time"],
            "end_time": chunk["end_time"],
            "embedding": embedding
        })
    
    # Delete existing chunks for this lesson
    client.table("transcript_chunks").delete().eq("lesson_id", lesson_id).execute()
    
    # Insert new chunks
    print(f"Inserting {len(rows)} chunks into database...")
    client.table("transcript_chunks").insert(rows).execute()
    print("Done!")


def main():
    parser = argparse.ArgumentParser(description="Process YouTube video for semantic search (OpenAI)")
    parser.add_argument("--lesson-id", required=True, help="UUID of the lesson in database")
    parser.add_argument("--youtube-id", required=True, help="YouTube video ID")
    args = parser.parse_args()
    
    # Initialize clients
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    nlp = spacy.load("en_core_web_sm")
    
    with tempfile.TemporaryDirectory() as tmpdir:
        # Step 1: Download
        print(f"\n[1/4] Downloading audio for video: {args.youtube_id}")
        audio_path = download_audio(args.youtube_id, tmpdir)
        
        # Step 2: Transcribe
        print(f"\n[2/4] Transcribing with OpenAI Whisper...")
        segments = transcribe_with_openai(audio_path, openai_client)
        print(f"  Got {len(segments)} segments")
        
        # Step 3: Chunk
        print(f"\n[3/4] Chunking transcript...")
        chunks = chunk_transcript(segments, nlp)
        print(f"  Created {len(chunks)} chunks")
        
        # Step 4: Embed
        print(f"\n[4/4] Generating OpenAI embeddings...")
        embeddings = generate_embeddings_openai(chunks, openai_client)
        
        # Step 5: Store
        print(f"\n[5/5] Storing in Supabase...")
        store_in_supabase(args.lesson_id, chunks, embeddings)
    
    print(f"\nSuccessfully processed video {args.youtube_id} for lesson {args.lesson_id}")


if __name__ == "__main__":
    main()
```

---

## Part 2: Storing in Database

### Manual SQL Insert (Alternative)

If you pre-process videos externally, you can bulk insert via SQL:

```sql
-- Insert transcript chunks
INSERT INTO transcript_chunks (lesson_id, chunk_text, start_time, end_time, embedding)
VALUES 
  ('lesson-uuid-here', 'First chunk of text...', 0.0, 15.5, '[0.1, 0.2, ...]'::vector),
  ('lesson-uuid-here', 'Second chunk of text...', 13.0, 28.2, '[0.3, 0.4, ...]'::vector),
  -- ... more chunks
;
```

### Batch Processing Script

To process all lessons with videos:

```python
#!/usr/bin/env python3
"""Process all lessons that have youtube_video_id but no transcript chunks."""

from supabase import create_client
import subprocess

SUPABASE_URL = "..."
SUPABASE_KEY = "..."

client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get lessons with videos but no chunks
lessons = client.table("lessons").select("id, youtube_video_id").not_.is_("youtube_video_id", "null").execute()

existing = client.table("transcript_chunks").select("lesson_id").execute()
processed_ids = set(r["lesson_id"] for r in existing.data)

for lesson in lessons.data:
    if lesson["id"] in processed_ids:
        print(f"Skipping {lesson['id']} - already processed")
        continue
    
    print(f"\nProcessing lesson {lesson['id']} - video {lesson['youtube_video_id']}")
    subprocess.run([
        "python", "scripts/process_video_free.py",
        "--lesson-id", lesson["id"],
        "--youtube-id", lesson["youtube_video_id"]
    ])
```

---

## Part 3: Querying at Runtime

### RPC Function (Already in Schema)

```sql
-- This function is already created in the init schema
CREATE OR REPLACE FUNCTION match_transcript_chunks(
  query_embedding VECTOR(1536),  -- or VECTOR(384) for free model
  target_lesson_id UUID,
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID, 
  chunk_text TEXT,
  start_time NUMERIC, 
  end_time NUMERIC, 
  similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT id, chunk_text, start_time, end_time,
         1 - (embedding <=> query_embedding) AS similarity
  FROM transcript_chunks
  WHERE lesson_id = target_lesson_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
```

### TypeScript Client Usage

```typescript
// lib/supabase/queries/transcript.ts

import { createClient } from "@/lib/supabase/client";

interface TranscriptMatch {
  id: string;
  chunk_text: string;
  start_time: number;
  end_time: number;
  similarity: number;
}

export async function searchTranscript(
  lessonId: string,
  queryEmbedding: number[],
  threshold = 0.75,
  limit = 5
): Promise<TranscriptMatch[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc("match_transcript_chunks", {
    query_embedding: queryEmbedding,
    target_lesson_id: lessonId,
    match_threshold: threshold,
    match_count: limit
  });
  
  if (error) {
    console.error("[searchTranscript]", error.message);
    return [];
  }
  
  return data || [];
}
```

### Tutor Agent Integration

```typescript
// lib/agents/tutor.ts (simplified)

export async function runTutorAgent(input: {
  question: string;
  lesson_id: string;
  language: "en" | "bn";
}): Promise<TutorResponse> {
  // 1. Generate embedding for user question
  const queryEmbedding = await generateEmbedding(input.question);
  
  // 2. Search transcript chunks
  const chunks = await searchTranscript(input.lesson_id, queryEmbedding, 0.75, 5);
  
  // 3. If no relevant chunks found
  if (chunks.length === 0) {
    return {
      answer: input.language === "bn" 
        ? "এই বিষয়ে ভিডিওতে কিছু খুঁজে পাইনি।"
        : "I couldn't find anything about this in the video.",
      timestamp: null
    };
  }
  
  // 4. Build context from chunks
  const context = chunks.map(c => c.chunk_text).join("\n\n");
  const bestChunk = chunks[0];
  
  // 5. Generate answer with LLM
  const answer = await callLLM([
    { role: "system", content: TUTOR_SYSTEM_PROMPT },
    { role: "user", content: `Context from video:\n${context}\n\nQuestion: ${input.question}` }
  ]);
  
  // 6. Return with timestamp
  return {
    answer,
    language: input.language,
    timestamp: {
      seek_to_seconds: bestChunk.start_time,
      label: `At ${formatTime(bestChunk.start_time)}`
    }
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
```

### Embedding Generation (Runtime)

For querying, you need to embed the user's question using the same model:

**Free Stack (sentence-transformers via API or client-side):**
```typescript
// Option 1: Use Hugging Face Inference API (free tier available)
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
      body: JSON.stringify({ inputs: text })
    }
  );
  return response.json();
}
```

**OpenAI Stack:**
```typescript
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  return response.data[0].embedding;
}
```

---

## Part 4: n8n Workflow (Alternative)

For automated processing when new lessons are added.

### Workflow Nodes

```
┌─────────────────┐
│ Supabase Trigger│  Watch: lessons table, INSERT
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Filter          │  Has youtube_video_id?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ HTTP Request    │  Download audio via yt-dlp API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OpenAI Node     │  Whisper transcription
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Code Node       │  Chunk with sentence boundaries
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OpenAI Node     │  Generate embeddings (batched)
│ (or HF API)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Node   │  Insert into transcript_chunks
└─────────────────┘
```

### n8n JSON Export

```json
{
  "name": "Video Processing Pipeline",
  "nodes": [
    {
      "name": "Supabase Trigger",
      "type": "n8n-nodes-base.supabaseTrigger",
      "parameters": {
        "table": "lessons",
        "event": "INSERT"
      }
    },
    {
      "name": "Has Video?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [{
            "value1": "={{ $json.youtube_video_id }}",
            "operation": "isNotEmpty"
          }]
        }
      }
    },
    {
      "name": "Download Audio",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://your-yt-dlp-service.com/download",
        "method": "POST",
        "body": {
          "video_id": "={{ $json.youtube_video_id }}"
        }
      }
    },
    {
      "name": "Transcribe",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "operation": "transcribe",
        "model": "whisper-1",
        "binaryPropertyName": "audio"
      }
    },
    {
      "name": "Chunk Text",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Sentence chunking logic here\nconst segments = $input.all();\n// ... chunking code\nreturn chunks;"
      }
    },
    {
      "name": "Generate Embeddings",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "operation": "embed",
        "model": "text-embedding-3-small",
        "input": "={{ $json.chunk_text }}"
      }
    },
    {
      "name": "Store Chunks",
      "type": "n8n-nodes-base.supabase",
      "parameters": {
        "operation": "insert",
        "table": "transcript_chunks",
        "columns": "lesson_id,chunk_text,start_time,end_time,embedding"
      }
    }
  ]
}
```

### Self-Hosted yt-dlp Service

For n8n, you'll need a microservice to handle YouTube downloads:

```python
# ytdlp-service/main.py (FastAPI)
from fastapi import FastAPI
import yt_dlp
import tempfile
from fastapi.responses import FileResponse

app = FastAPI()

@app.post("/download")
async def download(video_id: str):
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        ydl_opts = {
            "format": "bestaudio/best",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
            }],
            "outtmpl": f.name.replace(".mp3", ""),
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([f"https://youtube.com/watch?v={video_id}"])
        return FileResponse(f.name, media_type="audio/mpeg")
```

---

## Summary

| Approach | Cost | Speed | Automation |
|----------|------|-------|------------|
| **Free Stack (Python)** | $0 | Slow (CPU) | Manual or cron |
| **OpenAI Stack (Python)** | ~$0.10/video | Fast | Manual or cron |
| **n8n Workflow** | ~$0.10/video | Fast | Automatic on insert |

### Recommended Path

1. **Start with Free Stack** for development and initial curriculum
2. **Upgrade to OpenAI** when processing time matters
3. **Add n8n** when you need fully automated processing

### Environment Variables Required

```bash
# .env or .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For Python scripts (write access)
OPENAI_API_KEY=sk-...              # For OpenAI stack
HF_TOKEN=hf_...                    # For Hugging Face embeddings (optional)
```
