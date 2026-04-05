# Render & Export

## Remotion render command

```bash
npx remotion render <compositionId> out/clips/<name>.mp4 --codec h264
```

### Useful flags

- `--codec h264` (default, widest compat)
- `--crf 18` (highest quality, larger files; use 22-23 for smaller)
- `--concurrency 4` (parallel frame rendering, default = CPU cores)
- `--props='{"key":"val"}'` (pass runtime props to composition)
- `--frames=0-60` (render only a range, for testing)
- `--overwrite` (replace existing output)

### Parallel rendering

Render 3 clips simultaneously (watch RAM):
```bash
npx remotion render clip1 out/clip1.mp4 --codec h264 &
npx remotion render clip2 out/clip2.mp4 --codec h264 &
npx remotion render clip3 out/clip3.mp4 --codec h264 &
wait
```

**Don't run more than 3 in parallel** unless you have 32GB+ RAM.

## Post-render compression (ffmpeg)

Remotion's output is large (H.264 with high bitrate). Always compress for upload:

```bash
ffmpeg -i out/clip1.mp4 \
  -c:v libx264 -crf 22 -preset medium \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  out/clips-final/clip1.mp4 -y
```

`-movflags +faststart` moves metadata to the start → platforms can play before fully downloading.

## Platform specifications

### TikTok
- **Resolution:** 1080×1920 (9:16)
- **Frame rate:** 30fps (60fps supported but 30 is universal)
- **Codec:** H.264 High Profile
- **Max duration:** 10 minutes (but 15-60s performs best)
- **Max file size:** 287MB
- **Audio:** AAC, 128kbps+, stereo
- **Bitrate:** 5-10 Mbps recommended

### Instagram Reels
- **Resolution:** 1080×1920 (9:16)
- **Frame rate:** 30fps
- **Codec:** H.264
- **Max duration:** 90 seconds
- **Max file size:** 4GB
- **Audio:** AAC, 48kHz

### YouTube Shorts
- **Resolution:** 1080×1920 (9:16) minimum, 2160×3840 supported
- **Frame rate:** 24/30/60
- **Codec:** H.264
- **Max duration:** 60 seconds
- **Max file size:** 256GB (obviously no)

## Universal export settings

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -profile:v high -level 4.2 \
  -pix_fmt yuv420p \
  -crf 22 -preset medium \
  -maxrate 10M -bufsize 20M \
  -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart \
  output.mp4 -y
```

`yuv420p` is crucial — `yuv444p` won't play on some platforms.

## Quality checks before upload

```bash
# Verify resolution, fps, codec
ffprobe -v quiet -show_streams -of json output.mp4 | \
  jq '.streams[] | {codec: .codec_name, w: .width, h: .height, fps: .r_frame_rate}'
```

Checklist:
- ✅ 1080×1920
- ✅ 30fps (or 60)
- ✅ H.264 high profile
- ✅ yuv420p pixel format
- ✅ AAC audio at 48kHz
- ✅ moov atom at start (`+faststart`)
- ✅ Duration matches intended clip length

## Batch render + compress script

```bash
#!/bin/bash
# render-all.sh
set -e
mkdir -p out/clips out/clips-final

CLIP_IDS=("pod1-vinicius" "pod2-restaurante" "pod3-ferrari")

# Render in pairs
for ((i=0; i<${#CLIP_IDS[@]}; i+=2)); do
  id1=${CLIP_IDS[i]}
  id2=${CLIP_IDS[i+1]}
  npx remotion render "$id1" "out/clips/$id1.mp4" --codec h264 &
  [ -n "$id2" ] && npx remotion render "$id2" "out/clips/$id2.mp4" --codec h264 &
  wait
done

# Compress all
for f in out/clips/*.mp4; do
  name=$(basename "$f" .mp4)
  ffmpeg -i "$f" -c:v libx264 -crf 22 -preset medium \
    -c:a aac -b:a 192k -movflags +faststart \
    "out/clips-final/$name.mp4" -y 2>/dev/null
  echo "✓ $name"
done
ls -lh out/clips-final/
```
