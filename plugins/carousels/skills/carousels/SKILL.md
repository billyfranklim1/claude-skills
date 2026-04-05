---
name: carousels
description: Generate editorial-grade multi-slide carousels for Instagram/LinkedIn with pluggable styles (editorial, list, quote, tutorial, etc.) and multi-brand support. Renders locally via Satori+Resvg — no server needed. Use when the user asks to "create a carousel", "gerar carrossel", "fazer slides para Instagram", "criar post editorial", "criar lista Top 10", "carrossel sobre [tema]", or any multi-slide social media post request.
---

# Carousels — Multi-Style Social Deck Generator

Transform topics into structured, brand-aligned multi-slide posts ready for Instagram, LinkedIn, or any visual social platform. Pluggable styles, custom brands, local rendering.

## When to use

- User asks to "criar/gerar carrossel" or "create carousel"
- User wants a "Top 10 list", "tutorial post", "quote card", "editorial breakdown"
- User provides a topic/article/event and wants it turned into slides
- User wants multi-slide Instagram/LinkedIn content

## Workflow (6 steps)

See [agent_instructions.md](agent_instructions.md) for full detail.

1. **Detect style** — editorial, list, quote, tutorial, etc. (see `rules/05-choosing-a-style.md`)
2. **Resolve brand** — look up brand config (see `rules/06-brand-system.md`)
3. **Load style prompt** — read `styles/<style>/prompt.md` + `schema.json`
4. **Generate slides JSON** — apply editorial framework + anti-AI-clichés rules
5. **Suggest image strategy** — none/ai/real (see `rules/03-image-strategy.md`)
6. **Output + offer render** — structured JSON ready for `carousels render`

## Core rules (load as needed)

- [rules/01-editorial-framework.md](rules/01-editorial-framework.md) — 5 disciplines + 6-step pipeline (capture → tension → anchoring → expansion → cost → thesis)
- [rules/02-anti-ai-cliches.md](rules/02-anti-ai-cliches.md) — Forbidden phrases, empty adjectives, AI tells
- [rules/03-image-strategy.md](rules/03-image-strategy.md) — none / ai-generated / real photo modes
- [rules/04-destaque-highlight.md](rules/04-destaque-highlight.md) — Per-slide highlight word rules
- [rules/05-choosing-a-style.md](rules/05-choosing-a-style.md) — Decision tree: editorial vs list vs quote vs tutorial
- [rules/06-brand-system.md](rules/06-brand-system.md) — Multi-brand YAML config, resolution hierarchy
- [rules/07-typography-fit.md](rules/07-typography-fit.md) — Word counts per slide, overflow handling
- [rules/08-variants-alternation.md](rules/08-variants-alternation.md) — When to use which variant layout

## Available styles

- **editorial** — Interpretive cultural diagnosis, 10 slides, 5 variants (A/B/C/D/E) — `styles/editorial/`
- **list** — Numbered listicle "Top N", 3 variants (minimal/card/gradient) — `styles/list/`
- **quote** — Single quote with attribution, 3 variants — `styles/quote/`
- **tutorial** — Step-by-step how-to — *(coming soon)*

See each style's `prompt.md` for its own framework and `schema.json` for output shape.

## Rendering (local, no server)

```bash
cd renderer && npm install   # one-time: satori + resvg (~15MB, no browser)
node cli.mjs render carousel.json                 # generates slide_01.png...slide_N.png
node cli.mjs preview carousel.json                # opens HTML grid preview
```

## Brand management

```bash
node cli.mjs brand new acme                       # scaffold ./.carousels/brands/acme.yaml
node cli.mjs brand list                           # list brands (project + global + default)
node cli.mjs brand use acme                       # set default for project
```

Brand resolution order:
1. `./.carousels/brands/<name>.yaml` (project)
2. `~/.config/carousels/brands/<name>.yaml` (global)
3. `brands/default.yaml` (skill default)

See `rules/06-brand-system.md`.

## Output format

```json
{
  "meta": {
    "style": "editorial",
    "brand": "acme",
    "topic": "IA tomando empregos",
    "generated_at": "2026-04-04T21:30:00Z"
  },
  "caption": "...legenda completa do post...",
  "hashtags": ["ia", "tecnologia", "trabalho", ...],
  "slides": [
    {
      "index": 1,
      "variant": "A",
      "titulo": "SLIDE 1 TITLE",
      "texto": "Slide 1 body text",
      "destaque": "key word",
      "image_query": "real person name context",
      "image_strategy": "ai"
    }
    // ...
  ]
}
```
