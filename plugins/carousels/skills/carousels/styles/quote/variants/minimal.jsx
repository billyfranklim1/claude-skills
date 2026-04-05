/**
 * Quote / MINIMAL — quote + attribution, no decoration, contemplative
 */
import { renderWithHighlight } from '../../editorial/variants/A.jsx';

export default function QuoteMinimal({ slide, brand }) {
  const { colors, fonts, dimensions } = brand;
  const { quote, attribution, context, destaque, titulo, texto, role } = slide;

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: colors.bg_light,
      color: colors.text_on_light,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '120px 96px',
      fontFamily: fonts.body.family,
      gap: 48,
    }}>
      {role === 'quote' ? (
        <>
          <p style={{
            fontSize: 52,
            fontFamily: fonts.body.family,
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.35,
            margin: 0,
          }}>
            {renderWithHighlight(quote, destaque, colors.primary)}
          </p>
          <div style={{
            width: 80,
            height: 2,
            background: colors.primary,
          }} />
          <div style={{
            fontSize: 24,
            fontFamily: fonts.accent.family,
            fontWeight: fonts.accent.weight,
            color: colors.primary,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>{attribution}</div>
        </>
      ) : (
        <>
          <h1 style={{
            fontSize: 52,
            fontFamily: fonts.heading.family,
            fontWeight: fonts.heading.weight,
            lineHeight: 1.2,
            margin: 0,
          }}>
            {renderWithHighlight(titulo, destaque, colors.primary)}
          </h1>
          <p style={{
            fontSize: 26,
            lineHeight: 1.55,
            margin: 0,
            opacity: 0.75,
          }}>{texto}</p>
        </>
      )}
    </div>
  );
}
