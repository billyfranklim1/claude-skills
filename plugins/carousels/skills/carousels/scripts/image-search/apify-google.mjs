/**
 * Google Images via Apify — TODO
 *
 * Requires: APIFY_TOKEN env var
 * Actor: apify/google-images-scraper (pay-per-result ~$0.50/1k)
 * Endpoint: https://api.apify.com/v2/acts/apify~google-images-scraper/run-sync-get-dataset-items
 *
 * Implementation outline:
 *   1. POST to actor with input: { queries: [query], resultsPerPage: 15 }
 *   2. Parse returned dataset items
 *   3. Apply same ranking as ddg.mjs (aspect ratio, resolution, blocked domains, trusted sources)
 *   4. Verify accessibility with HEAD request
 *
 * Pros: most comprehensive image search available, catches what DDG misses
 * Cons: paid (~$0.50/1k), slower (~3-8s per run)
 */

export async function searchImage(query) {
  const apiKey = process.env.APIFY_TOKEN;
  if (!apiKey) {
    console.warn('[apify-google] APIFY_TOKEN not set — skipping');
    return '';
  }
  // TODO: implement
  console.warn('[apify-google] not implemented yet');
  return '';
}
