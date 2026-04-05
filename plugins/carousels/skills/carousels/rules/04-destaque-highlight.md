# Destaque (Highlight Word)

Every slide MUST have a `destaque` field. It's the word(s) that appear in the brand's highlight color (typically purple/accent) in the final render.

## Rules

1. **Required on EVERY slide.** Never empty string, never missing.
2. **Must be EXACT substring** of `titulo` OR `texto` (case-sensitive match).
3. **1-3 words only.** Longer = bad design.
4. **Prioritize in order:**
   1. **Numbers** (22%, US$ 850mi, 3x, 500)
   2. **Company/brand/product names** (Databricks, Oracle, iPhone)
   3. **People names** (Elon Musk, Lula, Gavin Newsom)
   4. **Place names** (São Paulo, Brasília, Silicon Valley)
   5. **Key concept terms** (the phrase that carries the slide's tension)

## Examples

Good:
- titulo: "Oracle investiu **US\$ 850 milhões** na aquisição" → destaque: `"US$ 850 milhões"`
- texto: "A Databricks comprou a Oracle em 22% de participação" → destaque: `"Databricks"`
- titulo: "O **erro humano** ainda decide batalhas" → destaque: `"erro humano"`
- titulo: "Entramos em uma **corrida silenciosa**" → destaque: `"corrida silenciosa"`

Bad:
- destaque: `""` — empty
- destaque: `"é"` — too short, meaningless
- destaque: `"a nova era da inteligência artificial nos negócios"` — too long
- destaque: `"revolucionário"` — banned empty adjective (see rule 02)
- destaque: `"Oracle investiu"` — not a substring match (no "Oracle investiu" together in source)

## Validation

Before output, verify for each slide:
```
assert destaque != ""
assert destaque in (titulo + " " + texto)
assert 1 <= word_count(destaque) <= 3
```
