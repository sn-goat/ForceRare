export interface EventImage {
  id: number;
  url: string;
  alt_text: string;
  display_order: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  images: EventImage[];
}
