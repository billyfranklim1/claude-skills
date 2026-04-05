# Typography Fit

Word counts per slide type. Over-length text = overflow = ugly render. Enforce BEFORE output.

## Per-style word counts

### Editorial (10 slides)

| Slide | Role | Título (words) | Texto (words) |
|---|---|---|---|
| 1 | Capa (THESIS) | 6-10 CAPS | 15-20 subtitle |
| 2 | Quebra | 12-18 | 30-45 |
| 3 | Reenquadramento | 12-18 | 30-45 |
| 4 | Nomeação do fenômeno | 8-15 | 30-45 |
| 5 | Cena concreta | 12-18 | 30-45 |
| 6 | Expansão | 12-18 | 30-45 |
| 7 | Generalização | 12-18 | 30-45 |
| 8 | Consequência estrutural (impact) | — (ignored) | 50-70 |
| 9 | Custo | 12-18 | 30-45 |
| 10 | Encerramento CTA | 6-10 CAPS | 15-25 |

### List (N+2 slides: cover + N items + outro)

| Slide | Role | Título | Texto |
|---|---|---|---|
| 1 | Cover | 4-8 words | 10-15 subtitle |
| 2-(N+1) | Item | 3-7 words | 20-35 |
| N+2 | Outro/CTA | 4-8 words | 15-25 |

### Quote (1-3 slides)

| Slide | Role | Quote | Attribution |
|---|---|---|---|
| 1 | Main quote | 8-25 words | 2-6 words |
| 2 (optional) | Context | — | 20-40 words |
| 3 (optional) | CTA | 5-10 words | — |

## Line break rules

- Título should split into 1-2 lines max
- Texto paragraph should split into 2-5 lines max
- If text exceeds max → summarize, don't truncate

## Auto-shrink fallback

The renderer supports auto-shrinking:
- If text overflows bounding box → font shrinks from base size down to 85% minimum
- Below 85% → renderer logs warning, user should rewrite slide
- NEVER rely on auto-shrink in production; enforce counts in JSON generation

## Counting tip

Count by spaces + 1 (simple Portuguese/English approximation):
```
"Entramos em uma corrida silenciosa por controle de dados" → 8 words ✓
```

For CAPS titles, count the same — capitalization doesn't change word count.
