export type VideoCategory = 'hero' | 'campaign' | 'testimonial' | 'event' | 'general';

export interface VideoAsset {
  id: number;
  title: string;
  description: string;
  category: VideoCategory;
  display_order: number;
  url: string;
  thumbnail_url: string | null;
  created_at: string;
}
