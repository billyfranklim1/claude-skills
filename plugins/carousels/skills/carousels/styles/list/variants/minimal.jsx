/**
 * List / MINIMAL — big number + title, solid bg
 */
import { renderWithHighlight } from '../../editorial/variants/A.jsx';

export default function ListMinimal({ slide, brand, meta }) {
  const { colors, fonts, dimensions } = brand;
  const { titulo, texto, destaque, number, role } = slide;

  const children = [];

  if (role === 'cover') {
    children.push(
      <div key="label" style={{
        fontSize: 24,
        fontFamily: fonts.accent.family,
        fontWeight: fonts.accent.weight,
        color: colors.accent,
        letterSpacing: 6,
        textTransform: 'uppercase',
        display: 'flex',
      }}>{`Top ${meta.count}`}</div>
    );
    children.push(
      <div key="title" style={{
        fontSize: 96,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.05,
        display: 'flex',
      }}>
        {renderWithHighlight(titulo, destaque, colors.highlight)}
      </div>
    );
    children.push(
      <div key="sub" style={{
        fontSize: 30,
        lineHeight: 1.4,
        opacity: 0.8,
        display: 'flex',
      }}>{texto}</div>
    );
  } else if (role === 'item') {
    children.push(
      <div key="num" style={{
        fontSize: 240,
        fontFamily: fonts.heading.family,
        fontWeight: 900,
        color: colors.primary,
        lineHeight: 0.9,
        display: 'flex',
      }}>{String(number).padStart(2, '0')}</div>
    );
    children.push(
      <div key="title" style={{
        fontSize: 64,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.1,
        display: 'flex',
      }}>
        {renderWithHighlight(titulo, destaque, colors.highlight)}
      </div>
    );
    children.push(
      <div key="text" style={{
        fontSize: 30,
        lineHeight: 1.5,
        opacity: 0.85,
        display: 'flex',
      }}>
        {renderWithHighlight(texto, destaque, colors.highlight)}
      </div>
    );
  } else if (role === 'outro') {
    children.push(
      <div key="title" style={{
        fontSize: 72,
        fontFamily: fonts.heading.family,
        fontWeight: fonts.heading.weight,
        lineHeight: 1.1,
        display: 'flex',
      }}>
        {renderWithHighlight(titulo, destaque, colors.accent)}
      </div>
    );
    children.push(
      <div key="text" style={{
        fontSize: 32,
        lineHeight: 1.5,
        opacity: 0.85,
        display: 'flex',
      }}>{texto}</div>
    );
  }

  children.push(
    <div key="bar" style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, height: 8,
      background: colors.primary,
    }} />
  );

  const isCoverOrOutro = role === 'cover' || role === 'outro';

  return (
    <div style={{
      width: dimensions.width,
      height: dimensions.height,
      background: isCoverOrOutro ? colors.bg_dark : colors.bg_light,
      color: isCoverOrOutro ? colors.text_on_dark : colors.text_on_light,
      display: 'flex',
      flexDirection: 'column',
      padding: '80px 72px',
      position: 'relative',
      fontFamily: fonts.body.family,
      justifyContent: 'center',
      gap: 32,
    }}>
      {children}
    </div>
  );
}
