export interface CardData {
  id: number;
  imageUrl: string;
  imageAlt: string;
  rating: number;
  name: string;
  location: string;
  isFavorite: boolean;
}

export interface DetailData {
  id: number;
}

export interface AccDataCard {
  id: number;
  name: string;
  city: string;
  mainImage: string;
  averageRating: number | null;
  latitude: number;
  longitude: number;
  countFavorite: number;
}
