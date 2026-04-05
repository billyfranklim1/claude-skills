#!/bin/bash
# Download video from URL (YouTube, Instagram, TikTok, X, etc.)
# Usage: ./download.sh URL [output_dir]

set -e

URL="$1"
OUT_DIR="${2:-source}"

if [ -z "$URL" ]; then
  echo "Usage: $0 URL [output_dir]"
  exit 1
fi

mkdir -p "$OUT_DIR"

# Download best quality up to 1080p
yt-dlp \
  -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080]" \
  -o "$OUT_DIR/video.%(ext)s" \
  "$URL"

# Extract audio for transcription
ffmpeg -i "$OUT_DIR/video.mp4" -vn -acodec mp3 -ab 128k "$OUT_DIR/audio.mp3" -y 2>/dev/null

echo ""
echo "✓ Downloaded: $OUT_DIR/video.mp4"
echo "✓ Audio: $OUT_DIR/audio.mp3"
ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$OUT_DIR/video.mp4" | xargs -I {} echo "  Duration: {}s"
