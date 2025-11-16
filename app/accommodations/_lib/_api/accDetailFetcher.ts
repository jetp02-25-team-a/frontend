import { apiFetch } from './apiFetch';
import type { AccommodationDTO } from '../../_types';

export async function getAccommodationDetail(
  id: number
): Promise<AccommodationDTO> {
  const endpoint = `/accommodations/${id}`;

  const options: RequestInit = {
    next: { revalidate: 3600 },
  };

  const data = await apiFetch<AccommodationDTO>(endpoint, options);

  return data;
}
