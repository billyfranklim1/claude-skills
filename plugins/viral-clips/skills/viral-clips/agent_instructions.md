# Viral Clips — Agent Instructions

Complete 8-step workflow for converting long-form content into viral 9:16 clips.

## Step 1 — Ingest source

**If URL provided** (YouTube, Instagram, TikTok, X):
```bash
yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]" \
  -o "source/video.%(ext)s" "URL"
```

**If local file**: copy/symlink into `source/video.mp4`.

**Extract audio** for transcription:
```bash
ffmpeg -i source/video.mp4 -vn -acodec mp3 -ab 128k source/audio.mp3 -y
```

**Get duration** (to estimate processing time and clip ranges):
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 source/video.mp4
```

## Step 2 — Transcribe with word timestamps

Use whisper with `--word_timestamps True` — this is **essential** for karaoke captions.

```bash
whisper source/audio.mp3 \
  --model small \
  --language pt \
  --output_format json \
  --word_timestamps True \
  --output_dir source/
```

Output: `source/audio.json` with segments + words[].

Language auto-detection: omit `--language`. For speed on English: use `--model base.en`.

Read [rules/08-transcript-pipeline.md](rules/08-transcript-pipeline.md) for diarization and WhisperX options.

## Step 3 — Detect viral moments

Run the moment detector:
```bash
python3 scripts/detect_moments.py source/audio.json > moments/candidates.json
```

Output: top-N ranked clips with `start`, `end`, `score`, `label`, `hook`, `text`.

Read [rules/01-viral-moment-detection.md](rules/01-viral-moment-detection.md) for heuristics.

## Step 4 — Confirm with user

**ALWAYS present the candidates before rendering.** Show:
- Top 7-10 candidates with timestamps, labels, and preview text
- Estimated durations
- Suggested style preset (educational / hot-take / entertainment / emotional)

Ask user to confirm or adjust. Do not render 20+ clips without explicit request.

## Step 5 — Generate Remotion composition

If a Remotion project doesn't exist yet, scaffold one:
```bash
mkdir remotion && cd remotion
npm init -y
npm install remotion @remotion/cli @remotion/bundler @remotion/renderer \
  react react-dom typescript @types/react @types/react-dom
```

Create these files (copy patterns from [rules/07-remotion-components.md](rules/07-remotion-components.md)):
- `src/index.ts` — `registerRoot`
- `src/Root.tsx` — one `<Composition>` per clip
- `src/ClipComposition.tsx` — reusable clip component
- `src/components/VirtualCaption.tsx`
- `src/components/HookTitle.tsx`
- `src/components/SpeakerZoom.tsx`
- `src/data/clips.ts` — clip defs from candidates.json
- `public/video.mp4` (symlink to source)
- `public/captions.json` (whisper JSON)

## Step 6 — Render

Render each clip in parallel (max 3 at a time to not overwhelm the machine):
```bash
npx remotion render clip-id-1 out/clips/clip1.mp4 --codec h264 &
npx remotion render clip-id-2 out/clips/clip2.mp4 --codec h264 &
npx remotion render clip-id-3 out/clips/clip3.mp4 --codec h264 &
wait
```

Read [rules/09-render-and-export.md](rules/09-render-and-export.md) for platform-specific flags.

## Step 7 — Compress for platforms

Remotion's H.264 output is already good, but compress for faster upload:
```bash
ffmpeg -i out/clips/clip1.mp4 \
  -c:v libx264 -crf 22 -preset medium \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  out/clips-final/clip1.mp4 -y
```

Target sizes:
- TikTok/Reels: < 50MB preferred (max 287MB)
- YouTube Shorts: up to 256GB but <100MB is ideal

## Step 8 — Report + caption suggestions

Return to user:
- File paths of all rendered clips
- Duration + size per clip
- **Suggested caption/hashtags per platform** (generate from hook + key nouns in transcript)
- Platform-specific hashtag strategy:
  - TikTok: 3-5 niche hashtags + 1-2 trending
  - Reels: 15-25 hashtags mix
  - Shorts: 3-5 hashtags in description

---

## Common gotchas

- **Safe zones**: Captions go in the middle-third, NOT bottom (TikTok UI covers it). See [rules/06-safe-zones.md](rules/06-safe-zones.md).
- **Hook delay**: Don't waste the first 3 seconds. See [rules/02-hook-formulas.md](rules/02-hook-formulas.md).
- **Clip length**: Under 15s feels unfinished, over 60s loses retention. 25-45s is the sweet spot.
- **Horizontal source video**: Must be reframed to 9:16. Use face-tracking crop OR center-crop with scale 1.15. See [rules/07-remotion-components.md](rules/07-remotion-components.md) `VerticalVideo`.
- **Word timestamps missing**: If whisper doesn't output words[], re-run with `--word_timestamps True`. Without them, karaoke doesn't work.
- **Audio desync**: Remotion's `startFrom`/`endAt` are in frames, not seconds. Always `Math.round(seconds * fps)`.
