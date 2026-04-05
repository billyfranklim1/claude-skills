/**
 * List / GRADIENT — gradient bg, number as mega text
 */
import { renderWithHighlight } from '../../editorial/variants/A.jsx';

export default function ListGradient({ slide, brand, meta }) {
  const { colors, fonts, dimensions } = brand;
  const { titulo, texto, destaque, number, role } = slide;
  const isCover = role === 'cover';
  const isOutro = role === 'outro';
  const isItem = role === 'item';

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.bg_impact} 100%)`,
      color: colors.text_on_dark,
      display: 'flex',
      flexDirection: 'column',
      padding: '72px 64px',
      position: 'relative',
      fontFamily: fonts.body.family,
      justifyContent: 'flex-end',
      gap: 24,
    }}>
      {/* Huge number as background text */}
      {isItem && (
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          fontSize: 520,
          fontFamily: fonts.heading.family,
          fontWeight: 900,
          color: colors.accent,
          opacity: 0.18,
          lineHeight: 0.8,
          pointerEvents: 'none',
        }}>{number}</div>
      )}

      {isCover && (
        <div style={{
          fontSize: 24,
          fontFamily: fonts.accent.family,
          fontWeight: fonts.accent.weight,
          color: colors.accent,
          letterSpacing: 6,
          textTransform: 'uppercase',
        }}>Top {meta.count}</div>
      )}

      <h1 style={{
        fontSize: isCover ? 88 : 64,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.1,
        margin: 0,
        zIndex: 2,
      }}>
        {renderWithHighlight(titulo, destaque, colors.accent)}
      </h1>

      <p style={{
        fontSize: 28,
        lineHeight: 1.5,
        margin: 0,
        opacity: 0.9,
        zIndex: 2,
      }}>
        {renderWithHighlight(texto, destaque, colors.accent)}
      </p>
    </div>
  );
}
