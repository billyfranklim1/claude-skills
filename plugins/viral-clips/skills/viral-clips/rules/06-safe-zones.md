# Platform Safe Zones (1080×1920)

Each platform overlays UI chrome on your video. Content placed under UI is effectively invisible.

## Safe zones per platform

### TikTok
```
┌────────────────┐
│   UI (200px)   │  ← Top: username, search bar
├────────────────┤
│                │
│   CONTENT      │  ← y: 200 → 1436px
│                │
├────────────────┤ y: 1436
│  RIGHT RAIL    │  ← x: 940-1080 (like/comment/share)
│  (from 800px)  │
├────────────────┤ y: 1600
│  BOTTOM UI     │  ← Caption + music + CTA
│  (320px)       │
└────────────────┘
```

### Instagram Reels
```
┌────────────────┐
│   UI (220px)   │  ← @username + views
├────────────────┤
│   CONTENT      │  ← y: 220 → 1500px
├────────────────┤
│  RIGHT RAIL    │  ← x: 940-1080
├────────────────┤ y: 1500
│  BOTTOM UI     │  ← Caption + music (420px)
└────────────────┘
```

### YouTube Shorts
```
┌────────────────┐
│   UI (180px)   │  ← Search + avatar
├────────────────┤
│   CONTENT      │  ← y: 180 → 1650px
├────────────────┤
│  RIGHT RAIL    │  ← x: 960-1080
├────────────────┤ y: 1650
│  BOTTOM UI     │  ← Title + comments (270px)
└────────────────┘
```

## Universal safe zone (works all 3 platforms)

**Central box: 900×1400, centered**
- x: 90-990 (90px gutter each side)
- y: 260-1440 (260px top, 480px bottom)

**Put all captions/titles/key visuals HERE.**

```tsx
const SAFE_ZONE = {
  top: 260,
  bottom: 1440,
  left: 90,
  right: 990,
  width: 900,
  height: 1180,
};
```

## Caption placement

- **Best position:** y ≈ 900-1200 (middle, but below center)
- **Avoid:** y > 1400 (gets covered by caption text on platform)
- **Avoid:** y < 260 (top UI)
- **Max text width:** 900px

```tsx
<AbsoluteFill style={{ 
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 200,  // push captions down from absolute center
}}>
  {/* captions here */}
</AbsoluteFill>
```

## Hook title placement

Upper-third, ABOVE captions:
- y: 280-500
- Must clear platform top UI

## Debug overlay component

Render this during development to visually verify safe zones:

```tsx
export const SafeZoneDebug: React.FC<{ platform?: 'tiktok' | 'reels' | 'shorts' }> = ({ platform = 'tiktok' }) => {
  const zones = {
    tiktok: { top: 200, bottom: 320, right: 140 },
    reels: { top: 220, bottom: 420, right: 140 },
    shorts: { top: 180, bottom: 270, right: 120 },
  }[platform];

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 1000 }}>
      {/* Top UI */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: zones.top, background: 'rgba(255,0,0,0.2)', border: '2px dashed red' }}>
        <span style={{ color: 'white', padding: 10 }}>TOP UI ({zones.top}px)</span>
      </div>
      {/* Bottom UI */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: zones.bottom, background: 'rgba(255,0,0,0.2)', border: '2px dashed red' }}>
        <span style={{ color: 'white', padding: 10 }}>BOTTOM UI ({zones.bottom}px)</span>
      </div>
      {/* Right rail */}
      <div style={{ position: 'absolute', top: zones.top, bottom: zones.bottom, right: 0, width: zones.right, background: 'rgba(255,0,0,0.2)', border: '2px dashed red' }}>
        <span style={{ color: 'white', padding: 10 }}>RAIL</span>
      </div>
    </AbsoluteFill>
  );
};
```

Use in development, remove before final render.

## Safe zone rule-of-thumb

**If a viewer can't read it, it doesn't exist.**

Before rendering, mentally overlay TikTok UI on your composition:
- Is the caption visible?
- Is the hook title above the username?
- Does the speaker's face fit in the center?

If any answer is "no" — reposition.
