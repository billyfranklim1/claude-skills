/**
 * Image Search Chain — orchestrates providers and prepares candidates
 * for the Claude agent to review visually.
 *
 * Architecture: the CLAUDE AGENT is the validator.
 *   1. This script downloads N candidates per slide from each provider
 *   2. Outputs a manifest of paths
 *   3. Agent reads each candidate image (via Read tool), decides which fits
 *   4. Agent updates the carousel JSON with chosen `local_image` path
 *   5. If none of the candidates work, agent runs `images-prep --more` to
 *      fetch the next batch
 *
 * No external Vision API. No extra keys. No cost.
 *
 * Default chain: DDG → Pexels → Unsplash → Apify → AI-gen
 * Override: CAROUSELS_IMAGE_CHAIN="ddg,pexels,ai-gen"
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as ddg from './ddg.mjs';
import * as pexels from './pexels.mjs';
import * as unsplash from './unsplash.mjs';
import * as apifyGoogle from './apify-google.mjs';
import * as aiGen from './ai-gen.mjs';

const PROVIDERS = {
  ddg,
  pexels,
  unsplash,
  'apify-google': apifyGoogle,
  'ai-gen': aiGen,
};

const DEFAULT_CHAIN = ['ddg', 'pexels', 'unsplash', 'apify-google', 'ai-gen'];

export function getChain() {
  const envChain = process.env.CAROUSELS_IMAGE_CHAIN;
  if (envChain) {
    return envChain.split(',').map(s => s.trim()).filter(s => s in PROVIDERS);
  }
  return DEFAULT_CHAIN;
}

/**
 * Download image with magic-byte validation. JPG/PNG only (Satori constraint).
 */
export async function downloadImage(url, cacheDir) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 12);

  // Return existing cache hit if present
  for (const ext of ['jpg', 'png']) {
    const existing = path.join(cacheDir, `${hash}.${ext}`);
    if (fs.existsSync(existing)) return existing;
  }

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'image/jpeg,image/png,image/*;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
  if (!(isJpeg || isPng)) {
    const isWebp = buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
    throw new Error(`unsupported format (${isWebp ? 'WebP' : 'unknown'})`);
  }

  const actualExt = isJpeg ? 'jpg' : 'png';
  const finalPath = path.join(cacheDir, `${hash}.${actualExt}`);
  fs.writeFileSync(finalPath, buf);
  return finalPath;
}

/**
 * Fetch candidates for a single slide query.
 * Downloads up to `count` valid (JPG/PNG) images from the chain.
 * @returns {Promise<Array<{path, url, provider, index}>>}
 */
export async function fetchCandidates(query, cacheDir, { count = 5, skip = 0 } = {}) {
  const chain = getChain();
  const results = [];
  let skipped = 0;

  for (const providerName of chain) {
    const provider = PROVIDERS[providerName];
    if (!provider) continue;

    let urls = [];
    try {
      if (typeof provider.searchCandidates === 'function') {
        urls = await provider.searchCandidates(query);
      } else if (typeof provider.searchImage === 'function') {
        const single = await provider.searchImage(query);
        urls = single ? [single] : [];
      }
    } catch (e) {
      console.warn(`[${providerName}] search error: ${e.message}`);
      continue;
    }

    for (const url of urls) {
      if (results.length >= count) return results;
      if (skipped < skip) {
        skipped++;
        continue;
      }
      try {
        const localPath = await downloadImage(url, cacheDir);
        results.push({
          path: localPath,
          url,
          provider: providerName,
          index: results.length + 1 + skip,
        });
      } catch (e) {
        // Invalid format / download failed — skip silently
      }
    }
  }

  return results;
}

/**
 * Prepare candidates for ALL slides in a carousel.
 * Returns a manifest Claude can read to review images.
 *
 * Slides that already have `local_image` set are SKIPPED (agent accepted them).
 *
 * @param {object} carouselJson
 * @param {string} projectRoot
 * @param {object} opts { count, onlySlide, skip }
 * @returns {Promise<object>} manifest { slides: [{index, query, candidates: [...]}], cacheDir }
 */
export async function prepareCandidates(carouselJson, projectRoot, opts = {}) {
  const { count = 5, onlySlide = null, skip = 0 } = opts;
  const cacheDir = path.join(projectRoot, '.carousels', 'cache', 'images');
  const manifest = { cacheDir, slides: [] };

  for (const slide of carouselJson.slides) {
    if (onlySlide && slide.index !== onlySlide) continue;
    if (!slide.image_query || slide.image_strategy === 'none') continue;
    if (slide.local_image && fs.existsSync(slide.local_image) && !onlySlide) continue;

    console.log(`\n[slide ${slide.index}] query: "${slide.image_query}"`);
    const candidates = await fetchCandidates(slide.image_query, cacheDir, { count, skip });

    if (candidates.length === 0) {
      console.log(`  ⚠️  No candidates found.`);
    } else {
      candidates.forEach((c, i) => {
        console.log(`  #${c.index} [${c.provider}] ${c.path}`);
      });
    }

    manifest.slides.push({
      index: slide.index,
      query: slide.image_query,
      titulo: slide.titulo || slide.quote || '',
      candidates,
    });
  }

  return manifest;
}
