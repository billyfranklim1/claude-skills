/**
 * AI-Generated Images via OpenRouter — TODO
 *
 * Requires: OPENROUTER_API_KEY env var
 * Model: openai/gpt-5-image-mini (~$0.04/image, 1024x1024 or 9:16)
 * Endpoint: https://openrouter.ai/api/v1/chat/completions
 *
 * Implementation outline:
 *   1. Build prompt: "Generate this image exactly as described. No text/watermarks: <query>"
 *   2. POST to chat completions with model=openai/gpt-5-image-mini
 *   3. Parse message.images[0].image_url (data:image/png;base64,...)
 *   4. Decode base64, save to cache
 *
 * Pros: perfect relevance, no copyright risk, unique
 * Cons: costs ~$0.04/image, slower (~10-20s), can look "AI-ish"
 *
 * See brasil_com_s project (regenerar_imagens.py) for reference implementation.
 */

export async function generateImage(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.warn('[ai-gen] OPENROUTER_API_KEY not set — skipping');
    return '';
  }
  // TODO: implement (returns a local file path after saving PNG)
  console.warn('[ai-gen] not implemented yet');
  return '';
}

// Alias for chain compatibility
export { generateImage as searchImage };
