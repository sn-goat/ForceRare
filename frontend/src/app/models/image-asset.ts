/**
 * Mirrors the JSON shape returned by GET /api/images/ and GET /api/images/:id/.
 *
 * Every field is a primitive coming straight from the backend serialiser.
 * If we later need richer objects (e.g. Date instead of string for created_at),
 * add a mapper function in ImageService rather than changing this contract.
 */
export interface ImageAsset {
  id: number;
  title: string;
  alt_text: string;
  display_order: number;
  url: string;
  created_at: string;
}
