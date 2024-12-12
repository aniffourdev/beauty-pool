// types.ts
export interface Article {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  featured_image: string;
  slug: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  services?: { name: string; price: number }[];
}