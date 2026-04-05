---
name: viral-clips
description: Create viral short-form clips (TikTok, Reels, YouTube Shorts) from long-form content (podcasts, interviews, YouTube videos, livestreams) using Remotion. Produces 9:16 1080×1920 vertical clips with animated karaoke captions, hook titles, speaker zooms, B-roll overlays, and viral-moment auto-detection from transcripts. Use when the user asks to "make clips", "generate cuts", "viralize this video", "create shorts", "turn podcast into TikToks", "cortar vídeo", "fazer cortes virais", or provides a long-form video/audio asset they want segmented into shareable clips.
metadata:
  tags: viral, clips, tiktok, reels, shorts, remotion, podcast, cuts, captions, karaoke
---

# Viral Clips Skill

Automated viral clip factory: long-form video → ranked viral-moment candidates → rendered 9:16 clips with karaoke captions, hooks, and B-roll.

## When to use

- User provides a long video/podcast/interview and wants short clips
- User asks to "make TikToks from this", "create Shorts", "cut this podcast"
- User wants to repurpose long-form content for social media
- Any "viralize", "cortes virais", "reels automáticos" type request

## Quickstart workflow

Read [./agent_instructions.md](./agent_instructions.md) for the complete 8-step workflow.

TL;DR:
1. Download source (`yt-dlp`) or read local file
2. Transcribe with WhisperX (word timestamps)
3. Detect + rank viral moments (`scripts/detect_moments.py`)
4. Confirm clip selection with user
5. Generate Remotion composition per clip
6. Render 1080×1920 @ 30fps H.264
7. Compress + output

## Rule files (load as needed)

- [rules/01-viral-moment-detection.md](rules/01-viral-moment-detection.md) — How to score and rank clippable moments from a transcript
- [rules/02-hook-formulas.md](rules/02-hook-formulas.md) — 4 hook patterns that maximize 3-second retention
- [rules/03-caption-styles.md](rules/03-caption-styles.md) — Karaoke captions, fonts, colors, safe typography
- [rules/04-pacing-and-cuts.md](rules/04-pacing-and-cuts.md) — Jump cuts, speed ramps, zoom punches, shot length
- [rules/05-broll-integration.md](rules/05-broll-integration.md) — When and how to add B-roll/overlays
- [rules/06-safe-zones.md](rules/06-safe-zones.md) — Platform safe areas (TikTok, Reels, Shorts)
- [rules/07-remotion-components.md](rules/07-remotion-components.md) — Component catalog: VirtualCaption, HookTitle, SpeakerZoom, etc.
- [rules/08-transcript-pipeline.md](rules/08-transcript-pipeline.md) — WhisperX, diarization, word timestamps
- [rules/09-render-and-export.md](rules/09-render-and-export.md) — Render settings per platform

## Scripts

- `scripts/transcribe.py` — WhisperX wrapper with word-level timestamps
- `scripts/detect_moments.py` — Ranks transcript segments by virality heuristics
- `scripts/download.sh` — yt-dlp wrapper for YouTube/Instagram/TikTok URLs

## Output structure

```
clips-project/
├── source/
│   ├── video.mp4
│   ├── audio.mp3
│   └── transcript.json       # WhisperX output with word timestamps
├── moments/
│   └── candidates.json       # Ranked viral moments
├── remotion/
│   └── src/                  # Generated Remotion composition
└── out/
    └── clips/                # Final 1080×1920 H.264 MP4s
```

## Defaults

- **Resolution:** 1080×1920 (9:16)
- **Frame rate:** 30 fps
- **Codec:** H.264, CRF 22, preset medium
- **Audio:** AAC 192 kbps
- **Clip duration:** 20-60s (sweet spot: 25-45s)
- **Caption style:** word-by-word karaoke, active-word green highlight
- **Font:** Impact / Arial Black / TheBoldFont, 70-90px, white fill, 4px black stroke
