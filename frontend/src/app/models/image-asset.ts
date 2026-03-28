export type ImageCategory = 'hero' | 'founder' | 'partner' | 'about' | 'general';

export interface ImageAsset {
  id: number;
  title: string;
  alt_text: string;
  category: ImageCategory;
  display_order: number;
  url: string;
  created_at: string;
}
