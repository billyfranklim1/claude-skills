#!/usr/bin/env python3
"""
Viral Moment Detector
Reads a whisper JSON transcript and outputs ranked candidates for viral clips.

Usage:
    python3 detect_moments.py transcript.json [--top N] [--min-dur 20] [--max-dur 60]
"""

import argparse
import json
import re
import sys
from typing import Dict, List, Tuple

# ═══════════════════════════════════════════════════════════════
# Scoring keywords (PT-BR + EN)
# ═══════════════════════════════════════════════════════════════

HOOK_KEYWORDS = {
    # EN
    "actually", "truth is", "nobody tells", "turns out", "secret", "mistake",
    "most people", "did you know", "here's why", "watch this", "the real",
    # PT-BR
    "na verdade", "ninguém fala", "a real é", "olha só", "sabia que",
    "o segredo", "erro", "a maioria", "verdade sobre", "fica ligado",
    "presta atenção", "atenção", "o que ninguém",
}

CONTROVERSY_KEYWORDS = {
    # EN
    "unpopular opinion", "controversial", "wrong", "lying", "bullshit",
    "cringe", "hate", "disagree", "sucks", "overrated",
    # PT-BR
    "opinião impopular", "tá errado", "mentira", "cringe", "odeio",
    "discordo", "absurdo", "ridículo", "péssimo", "superestimado",
    "não presta", "horrível",
}

STORY_KEYWORDS = {
    # EN
    "craziest", "you won't believe", "listen to this", "this happened",
    # PT-BR
    "mais louco", "aconteceu comigo", "não vai acreditar", "escuta essa",
    "pira", "surreal", "inacreditável", "imagina", "cara, olha",
}

EMOTIONAL_MARKERS = {
    # EN
    "oh my god", "omg", "crazy", "insane", "amazing", "terrible", "i cried",
    "awful", "beautiful", "wow",
    # PT-BR
    "meu deus", "nossa", "louco", "insano", "surreal", "chorei", "doido",
    "foda", "caralho", "incrível", "impressionante", "espetacular",
    "choquei", "caraca", "porra",
}

RELATABLE_KEYWORDS = {
    "you know when", "have you ever", "we all",
    "quem nunca", "todo mundo já", "tu já", "você sabe quando", "já passou por",
}

LISTICLE_PATTERNS = [
    r"\btrês\s+(coisas|motivos|razões|dicas)",
    r"\b3\s+(coisas|motivos|razões|dicas)",
    r"\bcinco\s+(coisas|motivos|razões|dicas)",
    r"\b5\s+(coisas|motivos|razões|dicas)",
    r"\bprimeiro\b.*\bsegundo\b",
    r"\b(three|five|seven)\s+(things|reasons|tips)",
]

FILLER_WORDS = {
    # EN
    "um", "uh", "like", "you know", "sort of", "kind of", "basically",
    # PT-BR
    "né", "tipo", "aí", "então", "pô", "cara", "meio que", "tipo assim",
}

LAUGHTER_MARKERS = {"[risos]", "(risos)", "haha", "kkkk", "kkk", "rs", "lol", "rsrs"}


# ═══════════════════════════════════════════════════════════════
# Scoring
# ═══════════════════════════════════════════════════════════════

def count_keyword_hits(text: str, keywords: set) -> int:
    text_lower = text.lower()
    hits = 0
    for kw in keywords:
        hits += text_lower.count(kw)
    return hits


def count_numbers(text: str) -> int:
    # Standalone numbers (10+)
    numbers = re.findall(r"\b\d{2,}\b", text)
    # Money
    money = re.findall(r"R\$\s*\d+|US?\$\s*\d+", text)
    # Percentages
    pct = re.findall(r"\d+%", text)
    return len(numbers) + len(money) * 2 + len(pct)


def count_questions(text: str) -> int:
    return text.count("?")


def count_fillers(text: str) -> int:
    text_lower = text.lower()
    hits = 0
    for filler in FILLER_WORDS:
        hits += text_lower.count(f" {filler} ")
        hits += 1 if text_lower.startswith(f"{filler} ") else 0
    return hits


def has_listicle_structure(text: str) -> bool:
    return any(re.search(p, text, re.IGNORECASE) for p in LISTICLE_PATTERNS)


def score_text(text: str) -> Dict:
    signals = {
        "hook": count_keyword_hits(text, HOOK_KEYWORDS) * 3,
        "controversy": count_keyword_hits(text, CONTROVERSY_KEYWORDS) * 4,
        "story": count_keyword_hits(text, STORY_KEYWORDS) * 3,
        "emotional": count_keyword_hits(text, EMOTIONAL_MARKERS) * 3,
        "relatable": count_keyword_hits(text, RELATABLE_KEYWORDS) * 3,
        "numbers": count_numbers(text) * 2,
        "question": count_questions(text) * 2,
        "laughter": count_keyword_hits(text, LAUGHTER_MARKERS) * 4,
        "listicle": 5 if has_listicle_structure(text) else 0,
        "fillers": -min(count_fillers(text) * 0.5, 5),
    }
    total = sum(signals.values())
    return {"score": total, "signals": signals}


def classify_label(signals: Dict) -> str:
    if signals["controversy"] >= 4:
        return "hot-take"
    if signals["listicle"] > 0 or signals["numbers"] >= 4:
        return "listicle"
    if signals["story"] >= 3:
        return "story"
    if signals["emotional"] >= 4:
        return "emotional"
    if signals["question"] >= 2:
        return "question"
    if signals["relatable"] >= 3:
        return "relatable"
    if signals["hook"] >= 3:
        return "hook"
    return "general"


# ═══════════════════════════════════════════════════════════════
# Window building
# ═══════════════════════════════════════════════════════════════

def build_windows(segments: List[Dict], min_dur: float, max_dur: float) -> List[Dict]:
    windows = []
    n = len(segments)
    for i in range(n):
        start = segments[i]["start"]
        j = i
        while j < n and segments[j]["end"] - start <= max_dur:
            j += 1
        # j is now the first segment OUT of range
        if j - i < 1:
            continue
        end = segments[j - 1]["end"]
        if end - start < min_dur:
            continue
        text = " ".join(s["text"].strip() for s in segments[i:j])
        windows.append({
            "start": start,
            "end": end,
            "duration": end - start,
            "text": text,
            "segment_indices": list(range(i, j)),
        })
    return windows


def snap_to_sentence_boundary(window: Dict, segments: List[Dict]) -> Dict:
    """Adjust end to end on . ! ?"""
    for idx in reversed(window["segment_indices"]):
        seg_text = segments[idx]["text"].rstrip()
        if seg_text.endswith((".", "!", "?")):
            window = dict(window)
            window["end"] = segments[idx]["end"]
            window["duration"] = window["end"] - window["start"]
            break
    return window


# ═══════════════════════════════════════════════════════════════
# Deduplication
# ═══════════════════════════════════════════════════════════════

def dedupe(candidates: List[Dict], overlap_threshold: float = 0.5) -> List[Dict]:
    candidates = sorted(candidates, key=lambda c: c["score"], reverse=True)
    kept = []
    for cand in candidates:
        overlaps = False
        for k in kept:
            # compute overlap ratio
            overlap_start = max(cand["start"], k["start"])
            overlap_end = min(cand["end"], k["end"])
            overlap = max(0, overlap_end - overlap_start)
            ratio = overlap / min(cand["duration"], k["duration"])
            if ratio > overlap_threshold:
                overlaps = True
                break
        if not overlaps:
            kept.append(cand)
    return kept


# ═══════════════════════════════════════════════════════════════
# Hook extraction
# ═══════════════════════════════════════════════════════════════

def extract_hook(text: str, max_words: int = 10) -> str:
    # First sentence OR first N words
    first_sentence = re.split(r"[.!?]", text.strip(), 1)[0].strip()
    words = first_sentence.split()
    if len(words) > max_words:
        first_sentence = " ".join(words[:max_words])
    # Clean up
    first_sentence = re.sub(r"\s+", " ", first_sentence).strip()
    return first_sentence


# ═══════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════

def detect(transcript_path: str, top_n: int = 10, min_dur: float = 20, max_dur: float = 60) -> List[Dict]:
    with open(transcript_path) as f:
        data = json.load(f)

    segments = data.get("segments", [])
    if not segments:
        print("ERROR: no segments found in transcript", file=sys.stderr)
        return []

    windows = build_windows(segments, min_dur, max_dur)
    candidates = []
    for i, w in enumerate(windows):
        scored = score_text(w["text"])
        w2 = snap_to_sentence_boundary(w, segments)
        candidates.append({
            "id": f"clip-{i:03d}",
            "start": round(w2["start"], 2),
            "end": round(w2["end"], 2),
            "duration": round(w2["duration"], 2),
            "score": round(scored["score"], 2),
            "label": classify_label(scored["signals"]),
            "hook": extract_hook(w2["text"]),
            "text": w2["text"],
            "signals": scored["signals"],
        })

    candidates = [c for c in candidates if c["score"] > 0]
    candidates = dedupe(candidates)
    return candidates[:top_n]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("transcript", help="path to whisper JSON")
    parser.add_argument("--top", type=int, default=10)
    parser.add_argument("--min-dur", type=float, default=20)
    parser.add_argument("--max-dur", type=float, default=60)
    parser.add_argument("--pretty", action="store_true", help="print human-readable")
    args = parser.parse_args()

    results = detect(args.transcript, args.top, args.min_dur, args.max_dur)

    if args.pretty:
        for i, c in enumerate(results, 1):
            mm_start = f"{int(c['start']//60):02d}:{int(c['start']%60):02d}"
            mm_end = f"{int(c['end']//60):02d}:{int(c['end']%60):02d}"
            print(f"\n#{i} [{c['label']}] score:{c['score']} ({mm_start} → {mm_end}, {c['duration']}s)")
            print(f"   HOOK: {c['hook']}")
    else:
        print(json.dumps({"candidates": results}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
