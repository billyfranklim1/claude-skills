# Visual Variants & Alternation

Each style has its own set of variants. When generating, enforce alternation rules to prevent visual monotony.

## Editorial style variants

| Variant | Background | Content |
|---|---|---|
| **A** | Light (`bg_light`) | + photo |
| **B** | Dark (`bg_dark`) | + photo |
| **C** | Light (`bg_light`) | text-only |
| **D** | Dark (`bg_dark`) | text-only |
| **E** | Impact (`bg_impact`) | text-only, slide 8 ONLY |

### Alternation rules (editorial)

- **Slide 1 (cover)** and **slide 10 (CTA)** are ALWAYS DARK. They do NOT count in alternation sequences.
- **NEVER 3+ consecutive slides** with the same background tone (light or dark).
- **Slide 8** is ALWAYS variant E (impact).
- Slides 3 and 4 complement: C + D OR D + C (text-only pair, opposite backgrounds).
- Slides 5 and 6 complement: A + B OR B + A (photo pair, opposite backgrounds).

### Valid editorial sequence (example)

```
1:DARK-CTA, 2:A, 3:C, 4:D, 5:A, 6:B, 7:D, 8:E, 9:A, 10:DARK-CTA
                     ^light ^dark       ^dark  ^impact  ^light
```

## List style variants

| Variant | Layout |
|---|---|
| **minimal** | Big number + title, solid background |
| **card** | Number in rounded card + title below |
| **gradient** | Gradient background with number as mega-text |

### Alternation (list)

- Use **one variant consistently** across all item slides (slide 2 through N+1)
- Cover (slide 1) and outro (slide N+2) can use any variant
- Mixing variants within a single list breaks visual rhythm

## Quote style variants

| Variant | Layout |
|---|---|
| **big-text** | Giant centered quote, small attribution below |
| **with-photo** | Quote overlaid on author photo (dark gradient) |
| **minimal** | Quote + attribution, no decoration |

### Selection rule

- If author has recognizable photo → `with-photo`
- If quote is a "killer line" (short, punchy) → `big-text`
- If context matters more than author → `minimal`

## Generation guidance

When generating the JSON, include `variant` on every slide:
```json
{ "index": 2, "variant": "A", "titulo": "...", ... }
```

The renderer uses this to pick the right JSX template file from `styles/<style>/variants/<variant>.jsx`.
