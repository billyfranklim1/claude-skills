# Quote Style Prompt

Single powerful quote with attribution. 1-3 slides.

## Structure

- **Slide 1** — Main quote (required)
- **Slide 2** — Context (optional)
- **Slide 3** — CTA/reflection (optional)

## Slide-by-slide

### Slide 1 — MAIN QUOTE
- **quote**: the actual quote, **8-25 words**. Exact transcription.
- **attribution**: who said it, **2-6 words** (name + optional role).
- **context** (optional): where/when, **< 10 words**.
- **variant**: `big-text`, `with-photo`, or `minimal` (see selection rule below).
- **destaque**: most powerful 1-3 words from the quote.

### Slide 2 — CONTEXT (optional)
- **titulo**: framing question or lead-in, **5-10 words**.
- **texto**: why this quote matters now, **20-40 words**.
- **variant**: same as slide 1.
- **destaque**: key term.

### Slide 3 — CTA (optional)
- **titulo**: provocation or question, **5-10 words**.
- **texto**: closing thought or ask, **15-25 words**.
- **variant**: same as slide 1.
- **destaque**: key word.

## Variant selection

- `with-photo` → author has a well-known image OR it's a contemporary figure
- `big-text` → quote is short/punchy and stands alone
- `minimal` → historical/philosophical quote, contemplative mood

## Rules

- NEVER invent a quote. Only use real, attributable quotes.
- If user provides a loose "vibe" quote, mark it as `anonymous` attribution.
- NO embellishment of the quote itself.
- Apply anti-AI-clichés ONLY to the context/CTA slides, NOT the quote itself.

## Output

Valid JSON matching `styles/quote/schema.json`. 1-3 slides based on user needs.
