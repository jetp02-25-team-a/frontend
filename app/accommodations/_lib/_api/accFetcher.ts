import { apiFetch } from './apiFetch';
import type { AccommodationListDTO } from '../../_types';

// 熱門列表
export async function fetchPopularAccommodations(): Promise<
  AccommodationListDTO[]
> {
  return apiFetch<AccommodationListDTO[]>('/m3/accommodations/popular');
}

// 高星列表
export async function fetchHighRatedAccommodations(): Promise<
  AccommodationListDTO[]
> {
  return apiFetch<AccommodationListDTO[]>('/m3/accommodations/highRated');
}
