# Remotion Component Catalog

Ready-to-paste components for viral clip composition. Copy into your project's `src/components/`.

## VerticalVideo (wrapper)

Crops horizontal video to 9:16 with blurred background fill.

```tsx
import { AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig } from 'remotion';

export const VerticalVideo: React.FC<{
  src: string;
  startFrom?: number;
  endAt?: number;
  mode?: 'cover' | 'contain-blur';
}> = ({ src, startFrom, endAt, mode = 'cover' }) => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#000' }}>
      {mode === 'contain-blur' && (
        <OffthreadVideo
          src={src} startFrom={startFrom} endAt={endAt} muted
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'blur(40px) brightness(0.5)', transform: 'scale(1.2)',
          }}
        />
      )}
      <OffthreadVideo
        src={src} startFrom={startFrom} endAt={endAt}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          height: '100%', width: 'auto', minWidth: '100%',
          transform: 'translate(-50%, -50%) scale(1.15)',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};
```

## VirtualCaption (karaoke, per-word highlight)

```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export interface Word { start: number; end: number; word: string; }

export const VirtualCaption: React.FC<{
  words: Word[];
  clipStartTime: number;
  lineStartTime: number;
  durationFrames: number;
  activeColor?: string;
  activeStroke?: string;
}> = ({ words, clipStartTime, lineStartTime, durationFrames, activeColor = '#39FF14', activeStroke = '#158B08' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = lineStartTime + frame / fps;

  const pop = spring({ frame, fps, config: { damping: 16, stiffness: 220 } });
  const scale = interpolate(pop, [0, 1], [0.85, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const fadeOut = interpolate(frame, [durationFrames - 5, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 200 }}>
      <div style={{
        opacity: opacity * fadeOut, transform: `scale(${scale})`,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10,
        padding: '16px 28px', maxWidth: '90%', textAlign: 'center',
      }}>
        {words.map((w, i) => {
          const isActive = currentTime >= w.start && currentTime < w.end;
          const isPast = currentTime >= w.end;
          let wScale = 1;
          if (isActive) {
            const wf = (currentTime - w.start) * fps;
            const ws = spring({ frame: wf, fps, config: { damping: 10, stiffness: 320 } });
            wScale = interpolate(ws, [0, 1], [1.2, 1.05]);
          }
          return (
            <span key={i} style={{
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              fontSize: 80, fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: 1, lineHeight: 1.15, transform: `scale(${wScale})`,
              color: isActive ? activeColor : isPast ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
              textShadow: isActive
                ? `-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 0 24px ${activeColor}cc, 0 0 48px ${activeColor}66`
                : '-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 0 0 14px rgba(0,0,0,0.95)',
              WebkitTextStroke: isActive ? `3px ${activeStroke}` : '3px #000',
            }}>{w.word.trim()}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

## HookTitle (first 3 seconds overlay)

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const HookTitle: React.FC<{ text: string; durationFrames?: number }> = ({ text, durationFrames = 90 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame > durationFrames) return null;
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const y = interpolate(pop, [0, 1], [-30, 0]);
  const fadeOut = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center', paddingTop: 280 }}>
      <div style={{
        opacity: opacity * fadeOut, transform: `translateY(${y}px)`,
        background: 'linear-gradient(90deg, #FF6B00 0%, #FFD700 100%)',
        padding: '18px 32px', borderRadius: 50, maxWidth: '88%', textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}>
        <span style={{
          fontFamily: "'Impact', 'Arial Black', sans-serif",
          fontSize: 48, fontWeight: 900, color: '#000',
          textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.1,
        }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
```

## SpeakerZoom (crop+scale animation)

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const SpeakerZoom: React.FC<{
  children: React.ReactNode;
  zoomStart: number; zoomEnd: number;
  fromScale?: number; toScale?: number;
  focusX?: number; focusY?: number;
}> = ({ children, zoomStart, zoomEnd, fromScale = 1.15, toScale = 1.35, focusX = 540, focusY = 540 }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [zoomStart, zoomEnd], [fromScale, toScale], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{
      transformOrigin: `${focusX}px ${focusY}px`, transform: `scale(${scale})`, overflow: 'hidden',
    }}>{children}</AbsoluteFill>
  );
};
```

## BRollOverlay (PiP or fullscreen cutaway)

```tsx
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from 'remotion';

export const BRollOverlay: React.FC<{
  src: string;
  mode: 'pip' | 'fullscreen';
  position?: 'top-right' | 'top-left' | 'center-right' | 'center-left';
  durationFrames: number;
  isVideo?: boolean;
}> = ({ src, mode, position = 'top-right', durationFrames, isVideo = false }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, durationFrames - 6, durationFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const positions = {
    'top-right': { top: 280, right: 40 }, 'top-left': { top: 280, left: 40 },
    'center-right': { top: 700, right: 40 }, 'center-left': { top: 700, left: 40 },
  };
  if (mode === 'fullscreen') {
    return (
      <AbsoluteFill style={{ opacity }}>
        {isVideo ? <OffthreadVideo src={staticFile(src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 : <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </AbsoluteFill>
    );
  }
  return (
    <div style={{
      position: 'absolute', ...positions[position], width: 280, height: 280,
      borderRadius: 20, overflow: 'hidden', border: '4px solid white',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)', opacity,
    }}>
      {isVideo ? <OffthreadVideo src={staticFile(src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               : <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
    </div>
  );
};
```

## ProgressBar (top bar)

```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, height: 4,
      width: `${(frame / durationInFrames) * 100}%`,
      background: '#FFFFFF', zIndex: 100,
    }} />
  );
};
```

## Complete clip composition template

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import { VerticalVideo } from './components/VerticalVideo';
import { VirtualCaption } from './components/VirtualCaption';
import { HookTitle } from './components/HookTitle';
import { ProgressBar } from './components/ProgressBar';

export const ClipComposition: React.FC<{
  videoSrc: string;
  clipStart: number;
  clipEnd: number;
  hook: string;
  lines: Array<{ words: Word[]; start: number; end: number }>;
}> = ({ videoSrc, clipStart, clipEnd, hook, lines }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <VerticalVideo src={videoSrc}
        startFrom={Math.round(clipStart * fps)}
        endAt={Math.round(clipEnd * fps)} />
      <HookTitle text={hook} durationFrames={90} />
      {lines.map((line, i) => {
        const relStart = line.start - clipStart;
        const startFrame = Math.round(relStart * fps);
        const dur = Math.round((line.end - line.start) * fps) + 8;
        return (
          <Sequence key={i} from={startFrame} durationInFrames={dur}>
            <VirtualCaption words={line.words} clipStartTime={clipStart}
              lineStartTime={line.start} durationFrames={dur} />
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};
```
