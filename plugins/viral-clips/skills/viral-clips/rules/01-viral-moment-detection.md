# Viral Moment Detection

Scoring heuristics to rank transcript segments by viral potential.

## Scoring formula

```
score = hook_keyword_weight
      + controversy_weight
      + number_bonus
      + sentiment_peak
      + audio_energy_peak
      + question_bonus
      + laughter_marker
      + listicle_structure_bonus
      - filler_penalty
```

## Keyword signals (PT-BR + EN)

### Hook / curiosity triggers (+3 each)
**EN:** "actually", "truth is", "nobody tells you", "turns out", "here's why", "watch this", "secret", "mistake", "most people", "the real", "did you know"
**PT-BR:** "na verdade", "ninguém fala", "a real é", "olha só", "sabia que", "o segredo", "erro", "a maioria", "fica ligado", "verdade sobre"

### Controversy / hot takes (+4 each)
**EN:** "unpopular opinion", "controversial", "wrong", "lying", "bullshit", "cringe", "hate", "disagree"
**PT-BR:** "opinião impopular", "tá errado", "mentira", "cringe", "odeio", "discordo", "absurdo", "ridículo"

### Story hooks (+3 each)
**EN:** "craziest thing", "this happened", "you won't believe", "listen to this"
**PT-BR:** "mais louco", "aconteceu comigo", "não vai acreditar", "escuta essa", "pira", "surreal"

### Emotional markers (+3 each)
**EN:** "oh my god", "crazy", "insane", "amazing", "terrible", "I cried"
**PT-BR:** "meu deus", "louco", "insano", "surreal", "chorei", "doido", "foda", "caralho"

### Numbers / listicles (+2 per number)
- Regex: `\b(1[0-9]|[2-9][0-9]|\d{3,})\b` — any standalone number
- Dollar amounts: `R\$\s*\d+`, `\$\d+`
- Percentages: `\d+%`
- Rankings: "número um", "top 3", "primeiro lugar"

### Question bonus (+2)
- Ends with "?" or starts with "por que", "como", "what", "why", "how"

### Laughter markers (+4)
Whisper outputs "[risos]", "(risos)", "haha", "kkkk", "rs", "lol" — huge signal.

## Penalties

### Filler words (-0.5 each, max -5)
**EN:** "um", "uh", "like", "you know", "sort of", "kind of", "basically"
**PT-BR:** "né", "tipo", "tipo assim", "aí", "então", "pô", "cara"

Density threshold: if >30% of words are fillers, skip segment.

## Audio-level signals (optional, requires librosa/ffmpeg)

- **Energy peak**: RMS spike > 1.5× baseline = +3
- **Pitch variance**: high stdev in pitch = emotional peak = +2
- **Silence before**: >1.5s silence before segment = dramatic pause = +3

```bash
# Extract RMS per second
ffmpeg -i audio.mp3 -af "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level" -f null - 2>&1
```

## Segment building

Don't score individual sentences — build 20-60s **windows**:

```python
def build_windows(segments, min_dur=20, max_dur=60):
    windows = []
    i = 0
    while i < len(segments):
        start = segments[i]['start']
        j = i
        while j < len(segments) and segments[j]['end'] - start < max_dur:
            j += 1
        if segments[j-1]['end'] - start >= min_dur:
            windows.append({
                'start': start,
                'end': segments[j-1]['end'],
                'text': ' '.join(s['text'] for s in segments[i:j]),
                'segments': segments[i:j]
            })
        i += 1  # slide forward 1 segment, overlap for better candidates
    return windows
```

**Snap to sentence boundaries** — don't cut mid-word. Prefer ending on `.`, `!`, `?`.

## Labels (auto-classify each clip)

Use the dominant signal to assign a label:
- `hot-take` — controversy ≥ 4
- `story` — story hook keywords
- `listicle` — 2+ numbers in sequence
- `emotional` — emotional markers ≥ 4
- `how-to` — imperative verbs + "step", "primeiro", "segundo"
- `relatable` — "you know when", "todo mundo já", "quem nunca"
- `question` — starts with question word, ends with "?"

## Deduplication

Candidates overlap in time — dedupe by:
1. Sort by score descending
2. Keep top candidate
3. Discard any candidate overlapping >50% with kept ones
4. Repeat until top-N reached

## Output schema

```json
{
  "candidates": [
    {
      "id": "clip-01",
      "start": 142.3,
      "end": 178.9,
      "duration": 36.6,
      "score": 24,
      "label": "hot-take",
      "hook": "Na verdade a maioria tá errado sobre isso",
      "text": "... full transcript of the window ...",
      "signals": {
        "controversy": 8,
        "numbers": 4,
        "emotional": 6,
        "fillers": -2
      }
    }
  ]
}
```

## Present to user

Show top 7-10 with this format:
```
#1 [hot-take] score:24 (00:02:22 → 00:02:58, 36s)
   HOOK: "Na verdade a maioria tá errado sobre isso"
   
#2 [story] score:19 (00:05:12 → 00:05:48, 36s)
   HOOK: "A coisa mais louca que aconteceu comigo..."
```
