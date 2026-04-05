# Image Strategy

3 modes. Pick based on style, topic, and user preference.

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
