// GET /m3/favorite 的 data 部分
export interface GetFavoritesResponseData {
  favoriteIds: number[];
  count: number;
}

// POST /m3/favorite/:id/toggle 的 data 部分
export interface ToggleFavoriteResponseData {
  message: string;
  isFavorite: boolean;
}
