/**
 * DuckDuckGo Image Search
 * Port of DuckDuckGoImageService.php from carousel-app (hubnews).
 *
 * Flow:
 *   1. GET duckduckgo.com/?q=<query> → scrape vqd token from HTML
 *   2. GET duckduckgo.com/i.js?vqd=<token>&q=<query> → JSON results
 *   3. rank candidates (aspect ratio, resolution, source, format, filter stock)
 *   4. test top 3 with HEAD request, return first accessible URL
 */

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT_MS = 15000;
const MIN_WIDTH = 400;

const BLOCKED_DOMAINS = [
  'dreamstime', 'shutterstock', 'istockphoto', 'gettyimages', 'depositphotos',
  'alamy', '123rf', 'stock.adobe', 'bigstockphoto', 'vecteezy', 'freepik',
  'canva', 'pngtree', 'pikbest', 'rawpixel', 'envato',
];

const DOC_PATTERNS = [
  'sample', 'template', 'format', 'letter', 'form', 'printable',
  'pdf', 'doc', 'certificate', 'invoice', 'scribd', 'slideshare', 'docplayer',
];

const GOOD_SOURCES = [
  'techcrunch', 'reuters', 'bloomberg', 'cnbc', 'wired', 'theverge',
  'forbes', 'nytimes', 'bbc', 'time.com', 'arstechnica',
];

async function fetchWithTimeout(url, opts = {}, timeoutMs = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(tid);
  }
}

/** Fetches DDG home with query, scrapes vqd token from HTML. */
async function getVqdToken(query) {
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return '';
    const html = await res.text();
    // Try quoted form first, then unquoted
    const quoted = html.match(/vqd="([^"]+)"/);
    if (quoted) return quoted[1];
    const unquoted = html.match(/vqd=([^&"]+)/);
    if (unquoted) return unquoted[1];
    return '';
  } catch {
    return '';
  }
}

/** Rank image candidates by scoring heuristics (max ~27 pts). */
function rankImages(results) {
  const candidates = [];
  const top15 = results.slice(0, 15);

  outer: for (const r of top15) {
    const url = r.image || '';
    const width = parseInt(r.width || 0, 10);
    const height = parseInt(r.height || 0, 10);

    if (!url || width < MIN_WIDTH) continue;
    if (url.includes('.svg') || url.includes('data:image') || url.includes('favicon')) continue;

    const lowUrl = url.toLowerCase();
    for (const blocked of BLOCKED_DOMAINS) {
      if (lowUrl.includes(blocked)) continue outer;
    }

    const title = (r.title || '').toLowerCase();
    for (const pattern of DOC_PATTERNS) {
      if (title.includes(pattern) || lowUrl.includes(pattern)) continue outer;
    }

    let score = 0;

    // Aspect ratio (prefer portrait, Instagram 1080x1350)
    const ratio = height > 0 ? width / height : 1;
    if (ratio >= 0.6 && ratio <= 1.2) score += 10;
    else if (ratio > 1.2 && ratio <= 1.8) score += 5;

    // Resolution
    if (width >= 1200) score += 8;
    else if (width >= 800) score += 4;

    // Trusted sources (tech journalism)
    for (const src of GOOD_SOURCES) {
      if (lowUrl.includes(src)) { score += 6; break; }
    }

    // Format
    if (/\.(jpg|jpeg|png)/i.test(url)) score += 3;

    candidates.push({ url, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.map(c => c.url);
}

/**
 * Return a ranked list of image URL candidates (up to 15).
 * No accessibility/validation check — chain.mjs does that on download.
 * @param {string} query Search query (English, with proper nouns)
 * @returns {Promise<string[]>} Ranked list of URLs (may be empty)
 */
export async function searchCandidates(query) {
  const q = (query || '').trim();
  if (!q || q === 'technology people') return [];

  const vqd = await getVqdToken(q);
  if (!vqd) return [];

  const url = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(q)}&vqd=${vqd}&f=,,,,,,&p=1`;
  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Referer': 'https://duckduckgo.com/',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return rankImages(data.results || []);
  } catch {
    return [];
  }
}

/**
 * Convenience wrapper — returns first candidate URL only (no validation).
 * Prefer `searchCandidates` and let chain.mjs handle validation loop.
 */
export async function searchImage(query) {
  const list = await searchCandidates(query);
  return list[0] || '';
}

// CLI mode: `node ddg.mjs "query here"`
if (import.meta.url === `file://${process.argv[1]}`) {
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    console.error('Usage: node ddg.mjs "search query"');
    process.exit(1);
  }
  searchCandidates(query).then(list => {
    if (list.length) list.forEach(u => console.log(u));
    else { console.error('No candidates found.'); process.exit(1); }
  });
}
