# Choosing a Style

Decision tree for picking which style to generate.

## Decision tree

```
Is the user asking about controversy/culture/power/systemic change?
  ├─ YES → EDITORIAL (10 slides)
  └─ NO ↓

Is the user asking for "Top N", "X reasons", numbered list?
  ├─ YES → LIST (N+2 slides: cover + N items + outro)
  └─ NO ↓

Is it a single powerful quote or frase?
  ├─ YES → QUOTE (1-3 slides)
  └─ NO ↓

Is it "how to" / step-by-step / tutorial?
  ├─ YES → TUTORIAL (coming soon; fall back to LIST)
  └─ NO ↓

Unclear → ASK the user with 2-3 options.
```

## Style × topic examples

| User request | Style | Why |
|---|---|---|
| "carrossel sobre IA tomando empregos" | editorial | Cultural tension (human vs system) |
| "top 10 livros de negócios" | list | Explicit numbered list |
| "frase do Nietzsche sobre caos" | quote | Single quote |
| "como fazer deploy no Vercel" | tutorial (→list) | How-to |
| "análise da Americanas" | editorial | Corporate/power analysis |
| "5 sinais que você precisa mudar de emprego" | list | Numbered advice |
| "lançamento do novo iPhone" | editorial | Cultural event with tension |
| "o que Kahneman diz sobre loss aversion" | editorial OR quote | Depends: lesson → editorial, famous line → quote |

## When in doubt, ask

```
"Posso fazer em 3 formatos:
  1. Editorial (10 slides, análise interpretativa)
  2. Lista (5-10 slides, formato Top N)
  3. Quote (1-3 slides, frase grande)
Qual você prefere?"
```

## Never mix styles

- Don't make "editorial-but-also-list". Pick one.
- If topic fits multiple, ask user.
- Consistent structure = recognizable brand = repeat engagement.
