# Pacing & Cuts

Viral clips feel **faster** than reality. The perceived pace comes from tight edits, visual variety, and audio punctuation.

## Shot length targets

- **Average shot length (ASL):** 1.2-2.5s for viral clips
- **Maximum single shot:** 4-5s (beyond this, add a cut or overlay)
- **Minimum shot:** 0.4s (below this feels chaotic)

Rule: if the camera hasn't moved in 3 seconds, **force a cut or zoom change**.

## Editing techniques

### Jump cuts (filler removal)
Remove "um", "uh", "tipo", "né", breathing pauses, repeated words.

Detection: find segments where whisper shows:
- filler words (see rule 01)
- gaps > 0.5s with no speech
- words repeated 2+ times in sequence

Implementation: render audio waveform with `visualizeAudio`, auto-cut on silence.

```bash
# Detect silence with ffmpeg
ffmpeg -i audio.mp3 -af silencedetect=noise=-30dB:d=0.5 -f null - 2>&1 | grep silence
```

### Speed ramps
Accelerate setup → decelerate at punchline. Creates anticipation.

```tsx
<OffthreadVideo 
  src={src} 
  playbackRate={rampRate(frame)}
/>

function rampRate(frame: number): number {
  // Frames 0-30: 1.5x (speed through setup)
  // Frames 30-45: decel 1.5 → 1.0
  // Frames 45+: 1.0x (normal at punchline)
  if (frame < 30) return 1.5;
  if (frame < 45) return interpolate(frame, [30, 45], [1.5, 1.0]);
  return 1.0;
}
```

### Zoom punches
Scale 1.0 → 1.08 on emphasis words. Snap back.

```tsx
const punch = isEmphasisWord
  ? interpolate(frame - wordStart, [0, 3, 8], [1.0, 1.08, 1.0], { extrapolate: 'clamp' })
  : 1.0;
```

Emphasis word detection:
- ALL CAPS in transcript
- Preceded by dramatic pause
- Numbers/money terms
- Power words ("nunca", "sempre", "único")

### Speaker zoom (face-tracking crop)
Zoom into the speaker's face on emotional peaks.

Manual: specify bbox per time range.
```tsx
<SpeakerZoom 
  scale={1.3} 
  focusX={540}  // center of face in source coords
  focusY={400}
  startFrame={60}
  endFrame={120}
/>
```

Auto: run face detection (OpenCV/Mediapipe) on video, export bbox timeline.

## Sound design

### SFX on cuts (essential)
- **Whoosh** on jump cuts: 0.2-0.4s whoosh SFX at cut point
- **Ding/pop** on reveals: short pluck on zoom punches
- **Glitch/static** on hard transitions
- **Sub-bass drop** on dramatic reveals

Free SFX sources: freesound.org, Pixabay, YouTube Audio Library.

Place SFX 1-2 frames BEFORE the visual cut (audio leads picture).

### Beat sync (when using music)
Detect BPM:
```bash
ffmpeg -i music.mp3 -af "ebur128=peak=true" -f null - 2>&1
```
Or use `@remotion/media-utils` `getAudioDurationInSeconds` + BPM detection library.

Cut on beats (every 0.5s at 120 BPM, etc.)

## Punchline treatment

The last 2-3 seconds of any joke/reveal deserve:
1. **Hold** — no cuts, let it land
2. **Text emphasis** — bold text appears OR caption pops larger
3. **Sound punctuation** — ding, rimshot, or silence
4. **Speed-down** — 0.85x playback for last word

## Progress bar (viral convention)

Thin bar at the very top showing clip progress — creates subconscious "I'm almost done, might as well finish" feeling.

```tsx
<div style={{
  position: 'absolute',
  top: 0, left: 0,
  height: 4,
  width: `${(frame / durationInFrames) * 100}%`,
  background: 'white',
  zIndex: 100,
}} />
```

## Transition catalog

| Transition | When to use |
|---|---|
| **Hard cut** (no transition) | Default — 90% of cuts |
| **Whip pan + blur** | Between topics |
| **Glitch/RGB split** | Reveals, hot takes |
| **Zoom blur** | Emphasis, climax |
| **White flash** | Surprise/reveal |
| **Fade to black** | End of clip only |

From `@remotion/transitions`:
```tsx
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
```

## Anti-patterns

- ❌ Cross-fades longer than 10 frames (feels amateur)
- ❌ Zoom in + zoom in + zoom in (no rhythm)
- ❌ Same shot for 8+ seconds without overlay
- ❌ Music that doesn't match energy (lofi on hot-take clip)
- ❌ SFX on every cut (overkill — 1 per 3-5 cuts)
