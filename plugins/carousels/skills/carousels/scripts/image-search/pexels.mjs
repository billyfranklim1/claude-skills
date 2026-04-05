/**
 * Pexels Image Search — TODO
 *
 * Requires: PEXELS_API_KEY env var (free tier: 200 req/hour, 20k/month)
 * Endpoint: https://api.pexels.com/v1/search?query=X&orientation=portrait&per_page=15
 *
 * Implementation outline:
 *   1. GET https://api.pexels.com/v1/search with Authorization header
 *   2. Parse photos[] array
 *   3. Rank by: size (prefer large/original), orientation (portrait first)
 *   4. Return photo.src.large (1880x) or photo.src.original
 *
 * Pros: licensed free, high quality, no scraping risk
 * Cons: stock feel (generic), needs API key, rate limited
 */

export async function searchImage(query) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('[pexels] PEXELS_API_KEY not set — skipping');
    return '';
  }
  // TODO: implement
  console.warn('[pexels] not implemented yet');
  return '';
}
