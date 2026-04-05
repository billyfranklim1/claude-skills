/**
 * Quote / BIG-TEXT — giant centered quote, small attribution
 */
import { renderWithHighlight } from '../../editorial/variants/A.jsx';

export default function QuoteBigText({ slide, brand }) {
  const { colors, fonts, dimensions } = brand;
  const { quote, attribution, context, destaque, titulo, texto, role } = slide;

  const children = [];

  if (role === 'quote') {
    children.push(
      <div key="mark" style={{
        fontSize: 200,
        fontFamily: fonts.heading.family,
        fontWeight: 900,
        color: colors.primary,
        lineHeight: 0.7,
        marginBottom: -40,
        display: 'flex',
      }}>"</div>
    );
    children.push(
      <div key="quote" style={{
        fontSize: 72,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.15,
        display: 'flex',
      }}>
        {renderWithHighlight(quote, destaque, colors.highlight)}
      </div>
    );
    children.push(
      <div key="attr" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginTop: 24,
      }}>
        <div style={{
          fontSize: 28,
          fontFamily: fonts.accent.family,
          fontWeight: fonts.accent.weight,
          color: colors.accent,
          display: 'flex',
        }}>{`— ${attribution}`}</div>
        {context ? (
          <div style={{
            fontSize: 20,
            opacity: 0.6,
            display: 'flex',
          }}>{context}</div>
        ) : null}
      </div>
    );
  } else {
    children.push(
      <div key="title" style={{
        fontSize: 56,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.15,
        display: 'flex',
      }}>
        {renderWithHighlight(titulo, destaque, colors.highlight)}
      </div>
    );
    children.push(
      <div key="text" style={{
        fontSize: 28,
        lineHeight: 1.5,
        opacity: 0.85,
        display: 'flex',
      }}>{texto}</div>
    );
  }

  // Brand bar
  children.push(
    <div key="bar" style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, height: 8,
      background: colors.primary,
    }} />
  );

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: colors.bg_dark,
      color: colors.text_on_dark,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 72px',
      position: 'relative',
      fontFamily: fonts.body.family,
      gap: 40,
    }}>
      {children}
    </div>
  );
}
