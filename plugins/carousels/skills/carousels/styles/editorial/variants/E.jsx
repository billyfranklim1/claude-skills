/**
 * Variant E — IMPACT (bg_impact purple) text-only
 * Use for: slide 8 ONLY (consequência estrutural)
 * The texto is the PRIMARY content (titulo ignored).
 */
import { renderWithHighlight } from './A.jsx';

export default function VariantE({ slide, brand }) {
  const { colors, fonts, dimensions } = brand;
  const { texto, destaque } = slide;

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: colors.bg_impact,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 72px',
      position: 'relative',
      fontFamily: fonts.body.family,
    }}>
      {/* Impact label */}
      <div style={{
        fontSize: 20,
        fontFamily: fonts.accent.family,
        fontWeight: fonts.accent.weight,
        color: colors.accent,
        letterSpacing: 6,
        textTransform: 'uppercase',
        marginBottom: 32,
      }}>Consequência Estrutural</div>

      <p style={{
        fontSize: 48,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        color: colors.text_on_dark,
        lineHeight: 1.25,
        margin: 0,
      }}>
        {renderWithHighlight(texto, destaque, colors.accent)}
      </p>

      {/* Accent bars — top and bottom */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 12,
        background: colors.accent,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: 12,
        background: colors.accent,
      }} />
    </div>
  );
}
