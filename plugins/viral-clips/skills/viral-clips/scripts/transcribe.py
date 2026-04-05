#!/usr/bin/env python3
"""
Whisper wrapper — transcribes audio with word-level timestamps.

Usage:
    python3 transcribe.py input.mp3 [--model small] [--language pt] [--output_dir .]
"""

import argparse
import subprocess
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="audio/video file")
    parser.add_argument("--model", default="small", choices=["tiny", "base", "small", "medium", "large", "large-v3"])
    parser.add_argument("--language", default="pt", help="language code or 'auto'")
    parser.add_argument("--output_dir", default=".")
    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"ERROR: {args.input} not found", file=sys.stderr)
        sys.exit(1)

    cmd = [
        "whisper", str(input_path),
        "--model", args.model,
        "--output_format", "json",
        "--word_timestamps", "True",
        "--output_dir", args.output_dir,
    ]
    if args.language and args.language != "auto":
        cmd += ["--language", args.language]

    print(f"Running: {' '.join(cmd)}", file=sys.stderr)
    result = subprocess.run(cmd)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
