# List Style Prompt

Numbered list carousel: "Top N", "5 reasons", "10 things". Cover + N items + outro.

## Structure

- **Slide 1** — Cover: catchy hook + "N things/motivos/etc."
- **Slides 2 to (N+1)** — Items: ONE per slide, numbered
- **Slide N+2** — Outro/CTA

## Slide-by-slide

### Slide 1 — COVER
- **titulo**: hook + count, **4-8 words**, ALL CAPS.
- **texto**: subtitle, **10-15 words**, sentence case.
- **count**: N (the number of items).
- **variant**: pick one of `minimal`, `card`, `gradient` (consistent across all items).

### Slides 2 to N+1 — ITEMS
Each slide IS ONE item.
- **number**: position in list (1, 2, 3, ...)
- **titulo**: item title, **3-7 words**, sentence case or Title Case.
- **texto**: explanation/proof, **20-35 words**.
- **variant**: same as cover.

### Slide N+2 — OUTRO/CTA
- **titulo**: closing line or CTA, **4-8 words**.
- **texto**: provocation or ask, **15-25 words**.
- **variant**: same as cover.

## Rules

- **NO tension required.** This format is inherently educational/listicle.
- **Order items by impact.** Best/most surprising item LAST (or FIRST if hook-forward).
- **Each item must stand alone.** Don't reference other items ("as we saw in #3").
- **Apply anti-AI-clichés** (see `rules/02-anti-ai-cliches.md`).
- **destaque on every slide** (see `rules/04-destaque-highlight.md`).

## Caption

- 1-2 paragraphs summarizing the list
- End with a question asking which item resonated most
- Maximum 2 emojis

## Hashtags

Mix of 8-12 relevant tags for the list's topic.

## Output

Valid JSON matching `styles/list/schema.json`. Never refuse. Always N+2 slides total.
