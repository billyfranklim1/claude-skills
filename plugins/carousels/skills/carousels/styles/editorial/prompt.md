# Editorial Style Prompt

Apply this in conjunction with `rules/01-editorial-framework.md` and `rules/02-anti-ai-cliches.md`.

## Output: 10 slides, structured JSON

Each slide has a specific role. Every slide pushes the next. If a slide can be removed without losing anything, it shouldn't exist.

## Slide-by-slide structure

### Slide 1 — THESIS (Cover)
- **titulo**: interpretive headline, ALL CAPS, **6-10 words**. Must provoke "how so?". Don't describe — interpret.
- **texto**: context subtitle, **15-20 words**, sentence case.
- **variant**: `A` (ignored on cover — always dark treatment)
- **image_query**: impactful photo of a REAL PERSON related to the topic.

### Slide 2 — BREAK
Shows something strange/unexpected happened. Presents the event or data that contradicts expectation.
- **titulo**: editorial statement, **12-18 words**, sentence case.
- **texto**: concrete data, **30-45 words**.
- **variant**: `A` or `B` (photo variant).

### Slide 3 — REFRAMING
"This is not about [surface]. It is about [depth]." Changes the lens.
- **titulo**: reframing sentence, **12-18 words**.
- **texto**: explanation of new lens, **30-45 words**.
- **variant**: `C` or `D` (text-only — power is in the words).

### Slide 4 — NAMING THE PHENOMENON
Gives a name to what's happening. Turns diffuse perception into a clear concept.
- **titulo**: the name/concept, **8-15 words**.
- **texto**: definition and context, **30-45 words**.
- **variant**: `D` or `C` (text-only, opposite of slide 3).

### Slide 5 — CONCRETE SCENE
Shows it in the real world. Real people doing real things.
- **titulo**: scene description, **12-18 words**.
- **texto**: concrete details, **30-45 words**.
- **variant**: `A` or `B` (with photo of the scene).

### Slide 6 — EXPANSION
Amplifies the impact. "And this changes X, Y, and Z..."
- **titulo**: the expanded consequence, **12-18 words**.
- **texto**: connections and implications, **30-45 words**.
- **variant**: `B` or `A` (with photo, opposite of slide 5).

### Slide 7 — GENERALIZATION
Turns the case into a pattern. "This is not isolated. It's happening in..."
- **titulo**: the identified pattern, **12-18 words**.
- **texto**: parallel examples, **30-45 words**.
- **variant**: `C` or `D` (text-only).

### Slide 8 — STRUCTURAL CONSEQUENCE (IMPACT)
The system affected. Cause → effect clear. IMPACT SLIDE.
- **titulo**: ignored (variant E uses text as main).
- **texto**: impact declaration, **50-70 words**. Editorial and powerful.
- **variant**: `E` (impact background, always slide 8).

### Slide 9 — COST
Who loses. Without romanticizing, without softening.
- **titulo**: the concrete loss, **12-18 words**.
- **texto**: cost details, **30-45 words**.
- **variant**: `A` or `B` (with photo).

### Slide 10 — CTA (Closing)
Thesis reaffirmed with weight. No generic CTA — close with impact.
- **titulo**: thesis reaffirmed, ALL CAPS, **6-10 words**.
- **texto**: provocative question or closing phrase, **15-25 words**.
- **variant**: `A` (ignored — always dark treatment).
- **image_query**: photo that reinforces the thesis.

## Caption (post body)

- Editorial diagnosis in 2-3 paragraphs
- Complements without repeating slides
- End with provocative question
- Maximum 2 strategic emojis
- NO hashtags, NO links

## Hashtags

Always include: `tecnologia`, `marca`, `ia` (or swap for your niche's core 3).
Mix of 8-12 between niche + trending. Without the `#` symbol.

## Output format

Respond with ONLY valid JSON matching `styles/editorial/schema.json`. Never refuse. Always generate exactly 10 slides.
