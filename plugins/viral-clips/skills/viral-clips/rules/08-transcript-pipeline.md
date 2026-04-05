# Transcript Pipeline

Word-level timestamps are **required** for karaoke captions. Without them, this skill doesn't work.

## Primary tool: Whisper

```bash
whisper source/audio.mp3 \
  --model small \          # base/small/medium/large — trade speed vs accuracy
  --language pt \          # ISO code or omit for auto-detect
  --word_timestamps True \ # CRITICAL — produces per-word timings
  --output_format json \
  --output_dir source/
```

### Model selection

| Model | Size | Speed | Accuracy | Use when |
|---|---|---|---|---|
| `tiny` | 39MB | ⚡⚡⚡⚡ | Poor | Drafts only |
| `base` | 74MB | ⚡⚡⚡ | OK | Short clips <5min |
| `small` | 244MB | ⚡⚡ | Good | **Default** for PT/EN |
| `medium` | 769MB | ⚡ | Better | Noisy audio, dialects |
| `large-v3` | 1.5GB | 🐌 | Best | Mission-critical |

For English-only: append `.en` (e.g., `base.en`) — faster, slightly better.

### Output structure

```json
{
  "text": "full transcript...",
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 4.2,
      "text": " Olha que legal galera.",
      "words": [
        { "word": " Olha", "start": 0.0, "end": 0.48 },
        { "word": " que", "start": 0.48, "end": 0.62 },
        { "word": " legal", "start": 0.62, "end": 1.04 },
        { "word": " galera.", "start": 1.04, "end": 1.52 }
      ]
    }
  ]
}
```

**Note:** whisper prepends a space to each word. Always `.trim()` before display.

## Upgrade: WhisperX (diarization + better alignment)

For multi-speaker content (interviews, podcasts):

```bash
pip install whisperx
whisperx source/audio.mp3 \
  --model large-v3 \
  --language pt \
  --diarize \
  --min_speakers 2 --max_speakers 4 \
  --hf_token HF_TOKEN \
  --output_dir source/
```

Output adds `speaker: "SPEAKER_00"` to each word.

Use for:
- **Speaker-specific captions** (different color per speaker)
- **Filter clips by speaker** (only guest's best moments)
- **SpeakerZoom** triggers on speaker change

## Alternative: AssemblyAI (cloud, paid)

More accurate for PT-BR + built-in sentiment/highlights:

```python
import assemblyai as aai
aai.settings.api_key = "YOUR_KEY"
transcriber = aai.Transcriber()
transcript = transcriber.transcribe("audio.mp3", config=aai.TranscriptionConfig(
    language_code="pt",
    speaker_labels=True,
    auto_highlights=True,       # built-in viral moment detection!
    sentiment_analysis=True,
    entity_detection=True,
))
```

Auto-highlights + sentiment give a head-start on viral moment scoring.

## Post-processing transcript

### Merge whisper's fragmented words
Whisper sometimes splits compound words. Join if gap < 50ms and starts lowercase:

```python
def merge_fragments(words):
    merged = []
    for w in words:
        if merged and (w['start'] - merged[-1]['end']) < 0.05 and not w['word'].strip()[0].isupper():
            merged[-1]['word'] += w['word']
            merged[-1]['end'] = w['end']
        else:
            merged.append(dict(w))
    return merged
```

### Clean up transcription errors
Common whisper PT-BR errors to fix:
- "conheceва" → "conhecê" (Cyrillic leak)
- "viúvo" → "Vini Jr." (context)
- "Toguro" ↔ "Toreto" ↔ "Turoro" (speaker-specific)

Build a per-project `corrections.json`:
```json
{ "conheceва": "conhecê", "Vinny": "Vini Jr.", "jingado": "Vinicius" }
```

## Captions format for Remotion

Convert whisper output to `@remotion/captions` format:

```python
def whisper_to_captions(whisper_json):
    captions = []
    for seg in whisper_json['segments']:
        for w in seg.get('words', []):
            captions.append({
                'text': w['word'],
                'startMs': int(w['start'] * 1000),
                'endMs': int(w['end'] * 1000),
                'timestampMs': None,
                'confidence': None,
            })
    return captions
```

## Line chunking for caption display

Group words into 3-5 word lines (TikTok style):

```python
def chunk_into_lines(words, words_per_line=4):
    lines = []
    for i in range(0, len(words), words_per_line):
        chunk = words[i:i+words_per_line]
        if chunk:
            lines.append({
                'words': chunk,
                'start': chunk[0]['start'],
                'end': chunk[-1]['end'],
            })
    return lines
```

Or chunk on natural boundaries (punctuation, pauses > 0.3s):

```python
def chunk_on_pauses(words, max_pause=0.3, max_words=5):
    lines, current = [], []
    for i, w in enumerate(words):
        current.append(w)
        next_gap = (words[i+1]['start'] - w['end']) if i+1 < len(words) else 1
        if (len(current) >= max_words or next_gap > max_pause 
            or w['word'].rstrip().endswith(('.', '!', '?'))):
            lines.append({'words': current, 'start': current[0]['start'], 'end': current[-1]['end']})
            current = []
    if current:
        lines.append({'words': current, 'start': current[0]['start'], 'end': current[-1]['end']})
    return lines
```
