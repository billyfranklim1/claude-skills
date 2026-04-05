/**
 * Variant D — DARK background, TEXT ONLY (no photo)
 * Use for: slides 3, 4, 7 (alternating with C)
 */
import { renderWithHighlight } from './A.jsx';

export default function VariantD({ slide, brand }) {
  const { colors, fonts, dimensions } = brand;
  const { titulo, texto, destaque } = slide;

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: colors.bg_dark,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '96px 72px',
      position: 'relative',
      fontFamily: fonts.body.family,
      gap: 32,
    }}>
      {/* Large quote mark */}
      <div style={{
        fontSize: 120,
        fontFamily: fonts.heading.family,
        fontWeight: 900,
        color: colors.primary,
        lineHeight: 0.8,
        marginBottom: -24,
      }}>"</div>

      <h1 style={{
        fontSize: 64,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        color: colors.text_on_dark,
        lineHeight: 1.1,
        margin: 0,
      }}>
        {renderWithHighlight(titulo, destaque, colors.highlight)}
      </h1>

      <p style={{
        fontSize: 30,
        fontFamily: fonts.body.family,
        fontWeight: fonts.body.weight,
        color: colors.text_on_dark,
        lineHeight: 1.5,
        margin: 0,
        opacity: 0.85,
      }}>
        {renderWithHighlight(texto, destaque, colors.highlight)}
      </p>

      {/* Brand bar at top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 8,
        background: colors.primary,
      }} />
    </div>
  );
}
