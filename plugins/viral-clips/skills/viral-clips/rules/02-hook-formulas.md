# Hook Formulas (First 3 Seconds)

**Videos holding >65% retention at 3s get 4-7× more impressions.** The first 3 seconds are everything.

## The 4 winning patterns

### 1. Bold Statement
Make an assertion that creates conflict with the viewer's assumptions.

**Templates:**
- "Most [audience] are killing their [outcome] with [mistake]"
- "The #1 reason you can't [desired outcome] is [unexpected cause]"
- "[Famous person] was wrong about [topic]"

**PT-BR:**
- "A maioria dos [público] tá [fazendo errado]"
- "O motivo número 1 que você não [resultado]"
- "[Pessoa famosa] mentiu sobre [tópico]"

**Example:** "A maioria dos empreendedores tá destruindo o próprio negócio com UMA decisão"

### 2. Question / Curiosity Gap
Open a loop the brain must close.

**Templates:**
- "Why do some [X] while others [opposite]?"
- "What if I told you [surprising claim]?"
- "Have you ever wondered why [common thing]?"

**PT-BR:**
- "Por que alguns [X] e outros não?"
- "E se eu te disser que [afirmação surpreendente]?"
- "Você já parou pra pensar por que [coisa comum]?"

**Example:** "Por que 90% dos atletas desistem ANTES de virar profissional?"

### 3. Pattern Interrupt
Break the scroll with unexpected movement/sound.

**Visual techniques:**
- Sudden prop reveal (pull object into frame)
- Zoom punch on frame 1 (scale 1.2 → 1.0)
- Hard whoosh SFX + text flash
- Jump-cut mid-action (start in motion)
- Surprised-face freeze frame

**Example:** Video opens mid-laugh, then freezes with red "WAIT" text overlay

### 4. Proof-First
Lead with the receipt/result.

**Templates:**
- "I [achieved X] in [timeframe]. Here's how."
- "This made me $[amount] in [days]"
- "[Number] people did [thing] — only [small number] succeeded"

**PT-BR:**
- "Fiz [X] em [tempo]. Vou te mostrar como"
- "Isso me rendeu R$[valor] em [dias]"
- "De [número] pessoas, só [poucos] conseguiram"

**Example:** "Ganhei 30 mil inscritos em UM DIA. Sem anúncio. Vou te contar"

## Placement in the clip

```
[0.0s - 3.0s]  HOOK (verbal + visual text overlay)
[3.0s - 6.0s]  CONTEXT / SETUP
[6.0s - end]   PAYOFF / DELIVERY
[last 2s]      CTA (if applicable)
```

## Visual hook title overlay

Always display the hook as **on-screen text** — 85% of viewers start with sound off.

**Style:**
- Font: Impact / TheBoldFont / Komika Axis (heavy, condensed)
- Size: 48-64px (not caption size — bigger, upper-third)
- Color: Yellow (#FFD700) or white with red accent
- Background: semi-transparent black pill OR no background with heavy stroke
- Position: y ≈ 250-450px (upper-third, above center)
- Duration: visible entire first 3 seconds, then fade out
- Animation: spring-in from top or scale-in (0.8 → 1.0)

```tsx
<HookTitle 
  text="A MAIORIA TÁ ERRADO SOBRE ISSO"
  durationFrames={90}  // 3s @ 30fps
  position="upper-third"
/>
```

## Hook generation from transcript

Given a selected viral moment, generate the hook title:

1. **Extract the thesis** — the single most surprising/contentious claim in the clip
2. **Simplify to 4-8 words** — must fit on 2 lines max in 9:16
3. **Remove filler** — no "tipo", "né", "então"
4. **Add caps + punctuation** for emphasis
5. **If the clip IS a listicle** — lead with the number: "3 COISAS QUE NINGUÉM TE CONTA"

### Good vs Bad
❌ "então tipo, eu acho que na verdade a maioria dos empreendedores comete esse erro"
✅ "O ERRO QUE 90% DOS EMPREENDEDORES COMETEM"

❌ "cinco coisas importantes para você saber"
✅ "5 VERDADES QUE NINGUÉM FALA"

## Anti-patterns (do NOT do)

- ❌ "Hi guys, today I'm gonna talk about..."
- ❌ "Olá pessoal, bem-vindos ao canal"
- ❌ "Before I start, please like and subscribe"
- ❌ Slow intros > 2 seconds
- ❌ Logo/branding in the first 3 seconds
- ❌ Fading-in from black
