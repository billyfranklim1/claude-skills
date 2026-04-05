# Carousels — Agent Instructions

## 6-step workflow

### Step 1 — Detect style

Based on user's request, pick ONE style. Read `rules/05-choosing-a-style.md` for decision tree.

Quick heuristic:
- User mentions "editorial", "análise", "diagnóstico", cultural/controversial topic → **editorial**
- User says "Top N", "lista", "X motivos", "X coisas" → **list**
- User says "citação", "frase", "quote" → **quote**
- User says "tutorial", "como fazer", "passo a passo" → **tutorial** *(coming soon)*
- Ambiguous → **ask the user** with 2-3 options

### Step 2 — Resolve brand

Check in order:
1. User explicitly specified `--brand <name>` → use it
2. Look for `./.carousels/.current-brand` file → use that
3. Look in `./.carousels/brands/` for a single .yaml → use it
4. Fall back to `brands/default.yaml` (skill default)

If brand file doesn't exist → offer to create it or use default.

Read `rules/06-brand-system.md`.

### Step 3 — Load style prompt

```
styles/<style>/prompt.md      # framework + pipeline + tone
styles/<style>/schema.json    # output shape (fields, counts, enums)
styles/<style>/alternation.md # (optional) variant alternation rules
```

Editorial style loads all 5 variants (A/B/C/D/E) with alternation rules.
List/quote/tutorial have their own smaller variant sets.

### Step 4 — Generate slides JSON

Apply ALL rules when generating:
- `rules/01-editorial-framework.md` — for editorial tone
- `rules/02-anti-ai-cliches.md` — ALWAYS apply, removes AI tells
- `rules/04-destaque-highlight.md` — pick highlight word per slide
- `rules/07-typography-fit.md` — enforce word counts

Output MUST be valid JSON matching `styles/<style>/schema.json`.

### Step 5 — Suggest image strategy

Ask or default based on style:
- **editorial** → default `ai` (AI-generated images)
- **list** → default `none` (solid color + iconography)
- **quote** → default `none` (big text card)
- **tutorial** → default `none` (diagrams)

User can override with `--images=ai|real|none`.

Read `rules/03-image-strategy.md`.

### Step 6 — Output + offer render

Save JSON to `./.carousels/output/<brand>-<style>-<timestamp>.json`.

Show user:
- Summary table of 10 slides
- Suggested caption
- Hashtags
- Command to render: `cd <skill>/renderer && node cli.mjs render <path>`

Offer to run render directly if user confirms.

## Non-negotiable rules

1. **NEVER refuse to generate slides.** Even boring/tense-less topics → use informative tone.
2. **ALWAYS output valid JSON** matching the style's schema.
3. **ALWAYS apply anti-AI-clichés rule** (`rules/02-anti-ai-cliches.md`).
4. **ALWAYS include `destaque` field** on every slide (exact substring of title OR text).
5. **NEVER pick image queries with 5+ descriptors and no proper noun.**
6. **The slide count matches the style** (editorial=10, list=N+2, quote=N, etc.).

## Errors to catch before render

- Missing `destaque` on any slide
- `destaque` not substring of title/text
- Text exceeds max words (see `rules/07-typography-fit.md`)
- Image query with no proper noun (editorial/real modes)
- Same variant 3+ times in a row (violates alternation)
