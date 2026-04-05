/**
 * Unsplash Image Search — TODO
 *
 * Requires: UNSPLASH_ACCESS_KEY env var (demo: 50 req/hour, prod: 5000/hour)
 * Endpoint: https://api.unsplash.com/search/photos?query=X&orientation=portrait
 *
 * Implementation outline:
 *   1. GET https://api.unsplash.com/search/photos with Authorization: Client-ID <key>
 *   2. Parse results[] array
 *   3. Rank by: likes, downloads, orientation match
 *   4. Return photo.urls.regular (1080px) or photo.urls.full
 *   5. Track download: GET photo.links.download_location (required by Unsplash ToS)
 *
 * Pros: highest quality photos, artistic, free licensed
 * Cons: often too "stock artistic", needs attribution in production
 */

export async function searchImage(query) {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!apiKey) {
    console.warn('[unsplash] UNSPLASH_ACCESS_KEY not set — skipping');
    return '';
  }
  // TODO: implement
  console.warn('[unsplash] not implemented yet');
  return '';
}
