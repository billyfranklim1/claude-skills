/**
 * List / CARD — number in rounded card, title below
 */
import { renderWithHighlight } from '../../editorial/variants/A.jsx';

export default function ListCard({ slide, brand, meta }) {
  const { colors, fonts, dimensions } = brand;
  const { titulo, texto, destaque, number, role } = slide;
  const isCover = role === 'cover';
  const isOutro = role === 'outro';
  const isItem = role === 'item';

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: colors.bg_light,
      color: colors.text_on_light,
      display: 'flex',
      flexDirection: 'column',
      padding: '72px 64px',
      position: 'relative',
      fontFamily: fonts.body.family,
      justifyContent: 'center',
      gap: 28,
    }}>
      {/* Number card */}
      {isItem && (
        <div style={{
          background: colors.primary,
          color: colors.text_on_dark,
          padding: '28px 48px',
          borderRadius: 24,
          fontSize: 96,
          fontFamily: fonts.heading.family,
          fontWeight: 900,
          alignSelf: 'flex-start',
          display: 'flex',
          lineHeight: 1,
        }}>{number}</div>
      )}

      {isCover && (
        <div style={{
          fontSize: 22,
          fontFamily: fonts.accent.family,
          fontWeight: fonts.accent.weight,
          color: colors.primary,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}>Lista</div>
      )}

      <h1 style={{
        fontSize: isCover ? 88 : 60,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.1,
        margin: 0,
      }}>
        {renderWithHighlight(titulo, destaque, colors.highlight)}
      </h1>

      <p style={{
        fontSize: 28,
        lineHeight: 1.5,
        margin: 0,
        opacity: 0.85,
      }}>
        {renderWithHighlight(texto, destaque, colors.highlight)}
      </p>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 8,
        background: colors.primary,
      }} />
    </div>
  );
}
