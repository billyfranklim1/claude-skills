/**
 * Render engine — JSON + brand → PNG per slide
 */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { loadBrand } from './lib/brand-loader.mjs';
import { loadVariant } from './lib/style-loader.mjs';

/** Download a font from Google Fonts CDN (cached locally) */
async function loadFont(family, weight, cacheDir) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const cacheKey = `${family.replace(/\s+/g, '_')}_${weight}.ttf`;
  const cachePath = path.join(cacheDir, cacheKey);

  if (fs.existsSync(cachePath)) {
    return fs.readFileSync(cachePath);
  }

  // Google Fonts API: resolve latest TTF for family+weight
  // We use an unofficial CDN that returns raw TTF: gwfh.mranftl.com
  const url = `https://gwfh.mranftl.com/api/fonts/${family.toLowerCase().replace(/\s+/g, '-')}?download=zip&subsets=latin,latin-ext&variants=${weight}&formats=ttf`;

  // Fallback: use fonts.bunny.net (faster, no-track Google Fonts mirror)
  const bunnyUrl = `https://fonts.bunny.net/css?family=${family.replace(/\s+/g, '+').toLowerCase()}:${weight}&display=swap`;

  // Simpler approach: try downloading from @fontsource CDN
  const fsourceUrl = `https://cdn.jsdelivr.net/fontsource/fonts/${family.toLowerCase().replace(/\s+/g, '-')}@latest/latin-${weight}-normal.ttf`;

  try {
    const buf = await downloadFile(fsourceUrl);
    fs.writeFileSync(cachePath, buf);
    return buf;
  } catch (e) {
    console.warn(`[font] Failed to load ${family} ${weight} from CDN: ${e.message}`);
    // Return a fallback from system if possible
    throw new Error(`Cannot load font ${family} ${weight}. Try a system font or pre-download to ${cachePath}`);
  }
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'carousels-renderer' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/** Render a single slide element → PNG buffer */
export async function renderSlide({ element, width, height, fonts }) {
  const svg = await satori(element, { width, height, fonts });
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

/** Render an entire carousel JSON to PNGs */
export async function renderCarousel(carouselJson, { outDir, brandName, projectRoot = process.cwd(), verbose = false } = {}) {
  const brand = loadBrand(brandName || carouselJson.meta?.brand, { projectRoot });
  const style = carouselJson.meta.style;
  const { width, height } = brand.dimensions;

  fs.mkdirSync(outDir, { recursive: true });

  // Load fonts needed
  const cacheDir = path.join(projectRoot, '.carousels', 'cache', 'fonts');
  const fontFamilies = [
    { name: brand.fonts.heading.family, weight: brand.fonts.heading.weight, style: 'normal' },
    { name: brand.fonts.body.family, weight: brand.fonts.body.weight, style: 'normal' },
    { name: brand.fonts.accent.family, weight: brand.fonts.accent.weight, style: 'normal' },
  ];
  // Dedupe
  const unique = Array.from(new Map(fontFamilies.map(f => [`${f.name}-${f.weight}`, f])).values());

  const fonts = [];
  for (const f of unique) {
    try {
      const data = await loadFont(f.name, f.weight, cacheDir);
      fonts.push({ name: f.name, data, weight: f.weight, style: f.style });
    } catch (e) {
      console.warn(`[font] Skipping ${f.name}:${f.weight} — ${e.message}`);
    }
  }

  if (fonts.length === 0) {
    throw new Error('No fonts loaded. Cannot render. Download fonts manually to .carousels/cache/fonts/');
  }

  const outputs = [];
  for (const slide of carouselJson.slides) {
    const VariantComp = await loadVariant(style, slide.variant);

    // Resolve image: prefer local_image (downloaded), fall back to image_url_original
    let image;
    if (slide.local_image && fs.existsSync(slide.local_image)) {
      // Read as base64 data URI so Satori can embed it
      const buf = fs.readFileSync(slide.local_image);
      const ext = path.extname(slide.local_image).slice(1).toLowerCase();
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      image = `data:${mime};base64,${buf.toString('base64')}`;
    } else if (slide.image_url_original) {
      image = slide.image_url_original;
    }

    const element = VariantComp({ slide, brand, meta: carouselJson.meta, image });

    if (verbose) console.log(`[render] slide ${slide.index} (${style}/${slide.variant})`);
    const png = await renderSlide({ element, width, height, fonts });
    const fname = `slide_${String(slide.index).padStart(2, '0')}.png`;
    const fpath = path.join(outDir, fname);
    fs.writeFileSync(fpath, png);
    outputs.push(fpath);
  }

  return outputs;
}
