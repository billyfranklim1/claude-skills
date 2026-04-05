# Image Strategy

3 modes + fallback chain. Pick based on style, topic, and user preference.

## Agentic image selection (for modes `real` and `auto`)

**Claude is the validator — NO external Vision API.**

Provider chain downloads candidates; Claude reads each image and picks the best fit.

### Provider chain

```
DuckDuckGo → Pexels → Unsplash → Apify Google → AI-gen (OpenRouter)
```

Override via env var:
```bash
export CAROUSELS_IMAGE_CHAIN="ddg,ai-gen"
```

Status (2026-04):
- ✅ `ddg` — fully implemented (ported from hubnews DuckDuckGoImageService)
- ⚠️ `pexels`, `unsplash`, `apify-google`, `ai-gen` — stubs (TODO)

### Workflow (agent-in-the-loop)

```bash
# 1. Download top 5 candidates per slide
node renderer/cli.mjs images-prep carousel.json --count 5
# → saves carousel.candidates.json with paths to all candidate images
```

Then Claude (agent):
1. Reads `carousel.candidates.json`
2. For each slide's candidates, uses `Read` tool to VIEW each image
3. Decides which candidate best fits the slide's context (query + titulo + texto + topic)
4. Rejection criteria: low-res, text-heavy screenshot, diagram/chart, stock-watermark, meme, off-topic, PDF page, logo
5. Accepts the best one:
   ```bash
   node renderer/cli.mjs images-accept carousel.json --slide 5 --path <chosen-image>
   ```
6. If NO candidate works for a slide, fetches more:
   ```bash
   node renderer/cli.mjs images-prep carousel.json --slide 5 --count 5 --skip 5
   # (next 5 candidates for slide 5)
   ```
7. Repeats until all slides have accepted images OR provider chain exhausted

### When to reject a candidate (Claude's checklist)

Reject if the image:
- ❌ Is not a real photograph (screenshot, diagram, chart, logo, infographic)
- ❌ Has visible watermark (Shutterstock, Getty, etc.)
- ❌ Is text-heavy (meme template, quote card, PDF page)
- ❌ Doesn't match the slide's actual subject (generic when specific was asked)
- ❌ Is low quality or clearly compressed
- ❌ Is a thumbnail/preview (too small even if upscaled)
- ❌ Shows wrong person/place when a specific entity was queried

Accept if the image:
- ✅ Shows the real subject of the query (specific person/place/scene)
- ✅ Is a clear photograph, not a composite/diagram
- ✅ Has editorial quality (sharp, well-lit, no watermark)
- ✅ Matches the tone of the slide (if slide is about crisis, don't pick happy-celebration)


## Mode `none` — solid color + typography

**Default for:** list, quote, tutorial (abstract/educational topics).

- No image_query needed
- Renderer uses variant background only
- Fastest, cheapest, zero copyright risk

When to choose:
- Topic is abstract (mental models, concepts, frameworks)
- Style is quote or list or educational
- User wants fast turnaround

## Mode `ai` — AI-generated via OpenRouter

**Default for:** editorial when tensão is high.

- Requires `OPENROUTER_API_KEY` environment variable
- Uses `openai/gpt-5-image-mini` (~$0.04 per image)
- Image is 1:1 or 4:5, matching slide dimensions
- Generated prompt must respect image_query rules below

When to choose:
- Topic is visual/scene-driven (a launch event, a specific product moment)
- Stock search won't find relevant imagery
- User wants unique images (no one else has them)

## Mode `real` — Pexels API

**Default for:** news, lifestyle, people-focused content.

- Requires `PEXELS_API_KEY` environment variable
- Free tier: 200 requests/hour
- Returns actual photographs

When to choose:
- Topic references known people/places/events (Elon, São Paulo, Oracle HQ)
- Stock photo feel is desired
- Editorial piece about real-world happenings

## image_query rules (applies to `ai` AND `real`)

**Golden rule:** Search/prompt for **WHO/WHAT** appears, not a description.

### Good (searches for real entity)
- `"Databricks CEO Ali Ghodsi keynote"` → real CEO photo
- `"Oracle headquarters Redwood City"` → real HQ photo
- `"California governor Gavin Newsom signing bill"` → real governor photo
- `"IPTU prefeitura São Paulo atendimento"` → real service counter photo
- `"cartório registro empresa Brasil"` → real notary photo

### Bad (generic description)
- ❌ `"commercial zoning business district office buildings"` → random building
- ❌ `"property tax assessment residential commercial"` → nothing useful
- ❌ `"business executives meeting conference room"` → generic stock

### Rules
- ALWAYS in **English** (except Brazilian terms with no translation)
- ALWAYS include at least **1 proper noun** (company, person, place, product)
- Law → search by politician or agency name
- Place → search by real place name
- Concept → search by a famous person who exemplifies it
- No real name possible → "person + concrete action" (e.g., "entrepreneur signing contract notary")
- FORBIDDEN: 5+ adjectives/descriptors with no proper noun

### Slides with no photo (variants C/D/E)
Use placeholder: `"technology people"` or leave empty — renderer will use solid background.
