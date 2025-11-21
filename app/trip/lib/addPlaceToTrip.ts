import { API_URL } from '@/config/api-path';

export async function addPlaceToTrip(tripId: number, placeId: number) {
  // 從 localStorage 取得 token
  const userInfo = localStorage.getItem('BackpackUserInfo');
  const token = userInfo ? JSON.parse(userInfo).token : '';
  
  const r = await fetch(`${API_URL}/api/m2/trip/${tripId}/place`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ placeId }),
  });

  const text = await r.text();
  if (!r.ok) throw new Error(text);

  const result = JSON.parse(text);
  return result.data || result; // 回傳 tripPlanPlace
}
