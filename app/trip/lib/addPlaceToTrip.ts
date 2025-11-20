import { API_URL } from '@/config/api-path';

export async function addPlaceToTrip(tripId: number, placeId: number) {
  const r = await fetch(`${API_URL}/api/m2/trip/${tripId}/place`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ placeId }),
  });

  const text = await r.text();
  if (!r.ok) throw new Error(text);

  return JSON.parse(text).data; // 回傳 tripPlanPlace
}
