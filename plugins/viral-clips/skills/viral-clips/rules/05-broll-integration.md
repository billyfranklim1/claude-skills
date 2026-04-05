# B-Roll Integration

B-roll overlays turn a talking-head into a **visually-layered** clip. Adds every 3-7 seconds.

## When to add B-roll

1. **Named entity mentioned** ("Elon", "Apple", "Neymar") → overlay their photo/logo
2. **Concrete noun** ("Ferrari", "São Paulo", "academia") → overlay stock footage
3. **Number/statistic** → overlay animated counter or chart
4. **Long monologue** (>6s without visual change) → cutaway
5. **Emotional peak** → zoomed speaker face OR reaction GIF

## B-roll modes

### 1. Fullscreen cutaway
Replaces main video for 2-4 seconds.

```tsx
<Sequence from={entityFrame} durationInFrames={90}>
  <OffthreadVideo src={staticFile('broll/ferrari.mp4')} muted />
</Sequence>
```

### 2. Picture-in-Picture (PiP)
Small overlay in corner (top-right typically).

```tsx
<Sequence from={startFrame} durationInFrames={duration}>
  <AbsoluteFill>
    <Img src={staticFile('broll/elon.jpg')} 
      style={{
        position: 'absolute',
        top: 280, right: 40,
        width: 280, height: 280,
        borderRadius: 20,
        border: '4px solid white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    />
  </AbsoluteFill>
</Sequence>
```

### 3. Text overlay (no asset needed)
Large animated number/word over dimmed video.

```tsx
<div style={{
  fontSize: 200,
  fontWeight: 900,
  color: '#FFD700',
  textShadow: '0 0 40px rgba(255,215,0,0.6)',
}}>R$ 30.000</div>
```

### 4. Reaction GIFs/stickers
Small animated image in corner during emotional beats.

## Entity extraction from transcript

Run on each clip's text to find B-roll candidates:

```python
# Use spaCy NER or regex for names/places
import spacy
nlp = spacy.load('pt_core_news_sm')
doc = nlp(clip_text)
entities = [(ent.text, ent.label_, ent.start_char) 
            for ent in doc.ents 
            if ent.label_ in ('PER', 'ORG', 'LOC', 'MISC')]
```

For each entity, find the timestamp of first mention (from word timestamps), then:
1. Search stock library by entity name
2. Or prompt user to provide asset
3. Or generate image with AI (for abstract concepts)

## Stock footage sources (free tier)

- **Pexels Videos API** — `https://api.pexels.com/videos/search?query=X&per_page=1`
- **Pixabay** — `https://pixabay.com/api/videos/?key=KEY&q=X`
- **Coverr** — free HD stock
- **Mixkit** — curated free stock

Prompt user once for API keys, cache in `~/.claude/viral-clips.env`.

## AI-generated B-roll

For abstract concepts without stock footage:
```python
# OpenRouter image gen (from Brasil com S project)
model = 'openai/gpt-5-image-mini'
prompt = f'{entity}, cinematic, vertical 9:16, photorealistic'
```

## Automated B-roll pipeline

```
1. For each clip's transcript, extract entities + keywords
2. For each entity:
   a. Check local cache (public/broll/)
   b. Query Pexels/Pixabay
   c. If nothing found, offer AI generation
   d. Download to public/broll/{entity}.mp4
3. Generate timeline JSON with B-roll placements
4. Render Remotion composition with layered B-roll sequences
```

## B-roll timing rules

- **Start B-roll 0.2-0.5s BEFORE** the word is spoken (anticipation)
- **End B-roll 0.3s AFTER** the word ends (lets viewer process)
- **Don't overlap** two B-roll cutaways in same 2s window
- **Fade in/out** (5-8 frames) for all B-roll
- **Dim speaker audio** (volume 0.8) during PiP? NO — keep full volume

## PiP positioning (avoid UI chrome)

Safe PiP zones in 1080×1920:
- **Top-right**: x=40-360, y=260-580 (avoids TikTok top UI)
- **Center-right**: x=780-1040, y=700-1000
- **Center-left**: x=40-300, y=700-1000 (avoids right-rail)

NEVER place PiP:
- Bottom 400px (platform UI)
- Top 250px (top UI + hook title)
- Right 140px (like/share rail on TikTok)

## Example B-roll timeline JSON

```json
{
  "broll": [
    {
      "type": "pip",
      "asset": "broll/neymar.jpg",
      "startTime": 28.2,
      "endTime": 31.5,
      "position": "top-right"
    },
    {
      "type": "fullscreen",
      "asset": "broll/ferrari_stock.mp4",
      "startTime": 96.8,
      "endTime": 99.2
    },
    {
      "type": "text-overlay",
      "text": "R$ 30.000",
      "startTime": 145.0,
      "endTime": 147.5,
      "style": "big-number-gold"
    }
  ]
}
```
