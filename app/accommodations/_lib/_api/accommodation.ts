import { apiFetch } from './api-client';

export type SortType = 'popular' | 'highRated';

export async function fetchAccommodations(sort?: SortType) {
  return apiFetch(`/m3/accommodations?sort=${sort}`);
}

export async function toggleFavoriteAccommodation(accId: number) {
  return apiFetch(`/m3/favorite/${accId}/toggle`, { method: 'POST' }, true);
}

export async function fetchFavorites() {
  return apiFetch(`/m3/favorite`, {}, true);
}

export async function searchAccommodations(query: string) {
  return apiFetch(`/m3/accommodations/search?${query}`);
}
