/**
 * Quote / WITH-PHOTO — quote overlaid on author photo (dark gradient)
 */
import { renderWithHighlight } from '../../editorial/variants/A.jsx';

export default function QuoteWithPhoto({ slide, brand, image }) {
  const { colors, fonts, dimensions } = brand;
  const { quote, attribution, context, destaque, titulo, texto, role } = slide;

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      fontFamily: fonts.body.family,
      background: colors.bg_dark,
    }}>
      {/* Photo fullbleed */}
      {image && (
        <img src={image} style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.45) saturate(1.1)',
        }} />
      )}

      {/* Gradient from bottom */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)`,
      }} />

      {/* Content bottom */}
      <div style={{
        position: 'relative',
        marginTop: 'auto',
        padding: '80px 72px 72px',
        color: colors.text_on_dark,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}>
        {role === 'quote' ? (
          <>
            <p style={{
              fontSize: 60,
              fontFamily: fonts.heading.family,
              fontWeight: fonts.heading.weight,
              lineHeight: 1.2,
              margin: 0,
            }}>
              "{renderWithHighlight(quote, destaque, colors.accent)}"
            </p>
            <div style={{
              fontSize: 28,
              fontFamily: fonts.accent.family,
              fontWeight: fonts.accent.weight,
              color: colors.accent,
            }}>— {attribution}</div>
          </>
        ) : (
          <>
            <h1 style={{
              fontSize: 52,
              fontFamily: fonts.heading.family,
              fontWeight: fonts.heading.weight,
              lineHeight: 1.15,
              margin: 0,
            }}>
              {renderWithHighlight(titulo, destaque, colors.accent)}
            </h1>
            <p style={{
              fontSize: 26,
              lineHeight: 1.5,
              margin: 0,
              opacity: 0.9,
            }}>{texto}</p>
          </>
        )}
      </div>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 8,
        background: colors.primary,
      }} />
    </div>
  );
}
