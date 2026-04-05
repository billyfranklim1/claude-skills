# Caption Styles (The #1 Viral Lever)

Captions are the single biggest viral multiplier. 85% of short-form video is watched muted.

## Core principles

- **Word-by-word karaoke reveal** synced to audio = baseline standard (+15% engagement)
- **Active-word highlight** — keep line visible, colorize/scale the currently-spoken word
- **3-5 words per line max**, 2 lines max
- **Middle-third placement** (NOT bottom — UI covers it)
- **Heavy fonts + thick stroke** — visible on any background

## The 4 caption styles (CapCut taxonomy)

### 1. Karaoke (DEFAULT — use this)
Active word highlighted in contrast color, rest of line stays visible in white.

```tsx
color: isActive ? '#39FF14' : isPast ? '#FFFFFF' : 'rgba(255,255,255,0.55)'
```

### 2. Flash
Words appear one at a time, previous word disappears. Feels urgent/aggressive.

### 3. Build
Words accumulate one at a time (like typing). Good for suspense/reveals.

### 4. Pop
Each word scales in with spring animation, stays on screen. Best for high-energy clips.

## Fonts (ranked by viral performance)

1. **TheBoldFont** — the TikTok classic, download from fonts.google.com mirrors
2. **Montserrat Black** (900 weight) — clean, modern, readable
3. **Impact** — aggressive, universal (installed by default on macOS)
4. **Komika Axis** — comic-book style, fun clips
5. **Proxima Nova Black** — premium feel
6. **Arial Black** — safe fallback

**Fallback stack:** `"TheBoldFont", "Montserrat", "Impact", "Arial Black", sans-serif`

## Sizing

- **Font size:** 70-90px (never below 60, never above 100)
- **Line height:** 1.1-1.2
- **Letter spacing:** 1-2px (tight for Impact, wider for Montserrat)
- **Max width:** 900px (leave 90px gutter each side of 1080 frame)

## Stroke + shadow (the "pop out" effect)

```tsx
{
  color: '#FFFFFF',
  WebkitTextStroke: '4px #000',  // the key to visibility
  textShadow: `
    -4px -4px 0 #000,
     4px -4px 0 #000,
    -4px  4px 0 #000,
     4px  4px 0 #000,
     0    0  14px rgba(0,0,0,0.95)
  `,
}
```

For active word, ADD a colored glow:
```tsx
textShadow: `/* black stroke above PLUS */
  0 0 24px rgba(57,255,20,0.8),
  0 0 48px rgba(57,255,20,0.4)
`
```

## Color schemes

### Default (Green karaoke)
- Active: `#39FF14` (neon green) / stroke `#158B08`
- Past: `#FFFFFF`
- Future: `rgba(255,255,255,0.55)`

### Yellow (Brasil com S style)
- Active: `#FFD700` / stroke `#B8860B`
- Past: `#FFFFFF`

### Red (Urgent/hot-take)
- Active: `#FF3333` / stroke `#8B0000`
- Past: `#FFFFFF`

### Pink (Lifestyle/entertainment)
- Active: `#FF1493` / stroke `#8B0A50`

## Color keywords (Submagic's signature)

Automatically colorize specific word types throughout the caption:
- **Numbers:** always yellow (`#FFD700`)
- **Money terms** ("R$10 mil", "$100k"): green (`#39FF14`)
- **Negative words** ("não", "nunca", "errado"): red (`#FF3333`)
- **Emphatic words** ("NUNCA", "SEMPRE", "TODO"): orange (`#FF6B00`)

```tsx
function getWordColor(word: string): string | null {
  if (/^\d+/.test(word)) return '#FFD700';
  if (/^(R\$|\$)/.test(word)) return '#39FF14';
  if (/^(não|nunca|errado|mentira)$/i.test(word)) return '#FF3333';
  return null;
}
```

## Animation patterns

### Pop-in (entry)
```tsx
const pop = spring({ frame, fps, config: { damping: 16, stiffness: 220 } });
const scale = interpolate(pop, [0, 1], [0.85, 1]);
const opacity = interpolate(pop, [0, 1], [0, 1]);
```

### Active-word bounce
```tsx
if (isActive) {
  const wordFrame = (currentTime - word.start) * fps;
  const wordSpring = spring({ frame: wordFrame, fps, config: { damping: 10, stiffness: 320 } });
  wordScale = interpolate(wordSpring, [0, 1], [1.2, 1.05]);
}
```

### Fade-out (exit)
```tsx
const fadeOut = interpolate(frame, [duration - 5, duration], [1, 0], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp'
});
```

## Auto-emoji insertion (advanced)

Contextual emojis after keywords (Submagic signature):
- "fire" / "top" / "melhor" → 🔥
- "dinheiro" / "money" / "R$" → 💰
- "amor" / "coração" → ❤️
- "louco" / "crazy" / "insano" → 🤯
- "risada" / "haha" / "kkk" → 😂
- "raiva" / "ódio" → 😤

Add the emoji as its own "word" after the trigger, animated like a word but slightly larger.

## Complete Remotion caption component

See `rules/07-remotion-components.md` for the full `<VirtualCaption>` component.
