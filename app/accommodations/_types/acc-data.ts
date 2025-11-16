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

export interface AccommodationListDTO {
  id: number;
  name: string;
  city: string;
  mainImage: string;
  averageRating: number | null;
  latitude: number | null;
  longitude: number | null;
  countFavorite: number;
}

export type SearchResponse = {
  data: AccommodationListDTO[];
  meta: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};

export interface ContactDTO {
  id: number;
  type: string;
  value: string;
  description: string | null;
}

export interface ImageDTO {
  id: number;
  url: string;
  caption: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface AmenityDTO {
  id: number;
  name: string;
  type: string;
}

export interface RoomTypeDTO {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  maxCapacity: number;
  totalRooms: number;
  bedType: string;
  amenities: AmenityDTO[];
}

export interface UserDTO {
  id: number;
  fullName: string;
  nickname: string;
  avatar: string;
}

export interface ReviewDTO {
  id: number;
  ratingScore: number;
  comment: string;
  reviewDate: string; // ISO string
  user: UserDTO;
}

export interface ReviewSummaryDTO {
  averageRating: number | null;
  reviewCount: number;
}

export interface AccommodationDTO {
  id: number;
  name: string;
  address: string;
  description: string | null;

  latitude: number | null;
  longitude: number | null;

  checkInTime: string | null;
  checkOutTime: string | null;

  city: string;
  type: string;

  contacts: ContactDTO[];
  images: ImageDTO[];
  amenities: AmenityDTO[];
  roomTypes: RoomTypeDTO[];
  reviews: ReviewDTO[];

  reviewSummary: ReviewSummaryDTO;
}
