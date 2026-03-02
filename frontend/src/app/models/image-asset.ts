/**
 * Mirrors the JSON shape returned by GET /api/images/ and GET /api/images/:id/.
 *
 * Every field is a primitive coming straight from the backend serialiser.
 * If we later need richer objects (e.g. Date instead of string for created_at),
 * add a mapper function in ImageService rather than changing this contract.
 */
export type ImageCategory = 'hero' | 'founder' | 'partner' | 'about' | 'event' | 'general';

export interface ImageAsset {
  id: number;
  title: string;
  alt_text: string;
  category: ImageCategory;
  display_order: number;
  /** Absolute URL to the media file. */
  url: string;
  /** ISO-8601 timestamp. */
  created_at: string;
}
