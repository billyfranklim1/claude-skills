/**
 * Style loader — dynamically imports a variant JSX module.
 * Transpiles JSX on the fly via @babel/core.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import babel from '@babel/core';
import presetReact from '@babel/preset-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const TMP_DIR = path.join(SKILL_ROOT, 'renderer', '.tmp-transpiled');

fs.mkdirSync(TMP_DIR, { recursive: true });

/** Transpile a .jsx file to .mjs via babel, cache in .tmp-transpiled/ */
function transpileJsx(jsxPath) {
  const relFromSkill = path.relative(SKILL_ROOT, jsxPath).replace(/[\/\\]/g, '_');
  const outPath = path.join(TMP_DIR, relFromSkill.replace(/\.jsx$/, '.mjs'));

  // Check if cached (up to date)
  if (fs.existsSync(outPath)) {
    const inMtime = fs.statSync(jsxPath).mtimeMs;
    const outMtime = fs.statSync(outPath).mtimeMs;
    if (outMtime >= inMtime) return outPath;
  }

  const src = fs.readFileSync(jsxPath, 'utf-8');
  const { code } = babel.transformSync(src, {
    presets: [[presetReact, { runtime: 'automatic', importSource: 'react-satori-shim' }]],
    filename: jsxPath,
    babelrc: false,
    configFile: false,
  });

  // Replace ANY import from react-satori-shim/jsx-runtime with inline factories.
  // Babel may output imports in various orders/combinations, so match generically.
  const jsxRuntimeShim = `const _jsx = (type, props) => ({ type, props: props || {}, key: null });
const _jsxs = _jsx;
const _Fragment = Symbol.for("react.fragment");
`;
  const finalCode = code.replace(
    /import\s*\{[^}]*\}\s*from\s*["']react-satori-shim\/jsx-runtime["'];?/g,
    jsxRuntimeShim
  );

  // Resolve relative imports to the original location
  const withResolvedImports = finalCode.replace(
    /from\s+["']([^"']+)["']/g,
    (match, importPath) => {
      if (importPath.startsWith('.')) {
        const abs = path.resolve(path.dirname(jsxPath), importPath);
        const transpiled = transpileJsx(abs.endsWith('.jsx') ? abs : `${abs}.jsx`);
        return `from "${pathToFileURL(transpiled).href}"`;
      }
      return match;
    }
  );

  fs.writeFileSync(outPath, withResolvedImports, 'utf-8');
  return outPath;
}

/** Load a variant component by style + variant name */
export async function loadVariant(styleName, variantName) {
  const jsxPath = path.join(SKILL_ROOT, 'styles', styleName, 'variants', `${variantName}.jsx`);
  if (!fs.existsSync(jsxPath)) {
    throw new Error(`Variant not found: ${styleName}/${variantName} (looked at ${jsxPath})`);
  }
  const transpiled = transpileJsx(jsxPath);
  const mod = await import(pathToFileURL(transpiled).href);
  return mod.default;
}

/** List available styles (folders under styles/) */
export function listStyles() {
  const dir = path.join(SKILL_ROOT, 'styles');
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

/** List variants for a style */
export function listVariants(styleName) {
  const dir = path.join(SKILL_ROOT, 'styles', styleName, 'variants');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.jsx'))
    .map(f => f.replace('.jsx', ''));
}
