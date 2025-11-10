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

export type SearchResponse = {
  data: AccDataCard[];
  meta: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
};
