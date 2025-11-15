import { apiFetch } from './apiFetch';
import type { AccommodationDetail, Review, RoomTypeDetail } from '../../_types';

export async function getAccommodationDetail(
  id: number
): Promise<AccommodationDetail> {
  const endpoint = `/accommodations/${id}`;

  const options: RequestInit = {
    next: { revalidate: 3600 },
  };

  const data = await apiFetch<AccommodationDetail>(endpoint, options);

  return data;
}
