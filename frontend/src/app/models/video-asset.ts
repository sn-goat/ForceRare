export type VideoCategory = 'hero' | 'campaign' | 'testimonial' | 'event' | 'general';

export interface VideoAsset {
  id: number;
  title: string;
  description: string;
  category: VideoCategory;
  display_order: number;
  /** Absolute URL to the video file. */
  url: string;
  /** Absolute URL to the thumbnail image, or null. */
  thumbnail_url: string | null;
  /** ISO-8601 timestamp. */
  created_at: string;
}
