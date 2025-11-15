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

// 住宿詳細資訊的頂層數據結構
export interface AccommodationDetail {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  checkInTime: string;
  checkOutTime: string;
  city: string;
  type: string;
  contacts: Array<{
    id: number;
    type: string;
    value: string;
    description: string | null;
  }>;
  images: Array<{
    id: number;
    url: string;
    caption: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  amenities: Array<{ id: number; name: string; type: string }>;
  roomTypes: Array<RoomTypeDetail>;
  reviews: Array<Review>;
}

// 房間類型詳細資訊 (用於 RoomTypesArea)
export interface RoomTypeDetail {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  maxCapacity: number;
  totalRooms: number;
  bedType: string;
  amenities: Array<{ id: number; name: string; type: string }>;
}

// 評論結構
export interface Review {
  id: number;
  ratingScore: number;
  comment: string;
  reviewDate: string;
  user: {
    id: number;
    fullName: string;
    nickname: string;
    avatar: string;
  };
}
