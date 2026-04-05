/**
 * Variant B — DARK background + photo
 * Use for: slides 2, 5, 9 (alternating with A)
 */
import { renderWithHighlight } from './A.jsx';

export default function VariantB({ slide, brand, image }) {
  const { colors, fonts, dimensions } = brand;
  const { titulo, texto, destaque } = slide;

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: colors.bg_dark,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: fonts.body.family,
    }}>
      {/* Photo area with dark overlay — top 55% */}
      {image && (
        <div style={{
          width: '100%',
          height: '55%',
          display: 'flex',
          position: 'relative',
        }}>
          <img src={image} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0, height: '40%',
            background: `linear-gradient(to top, ${colors.bg_dark}, transparent)`,
          }} />
        </div>
      )}

      {/* Text area — bottom 45% */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '48px 64px 64px 64px',
        justifyContent: 'flex-start',
        gap: 24,
      }}>
        <h1 style={{
          fontSize: 56,
          fontFamily: fonts.heading.family,
          fontWeight: fonts.heading.weight,
          color: colors.text_on_dark,
          lineHeight: 1.15,
          margin: 0,
        }}>
          {renderWithHighlight(titulo, destaque, colors.highlight)}
        </h1>
        <p style={{
          fontSize: 28,
          fontFamily: fonts.body.family,
          fontWeight: fonts.body.weight,
          color: colors.text_on_dark,
          lineHeight: 1.5,
          margin: 0,
          opacity: 0.85,
        }}>
          {renderWithHighlight(texto, destaque, colors.highlight)}
        </p>
      </div>

      {/* Brand bar at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 8,
        background: colors.primary,
      }} />
    </div>
  );
}
