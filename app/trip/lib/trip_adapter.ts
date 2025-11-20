import { API_URL } from '@/config/api-path';

// Server-safe：不能使用 localStorage
export async function getTripPlanDetail(tripId: number) {
  try {
    const r = await fetch(`${API_URL}/api/m2/plan/${tripId}/detail-all`, {
      cache: 'no-store',
    });

    const text = await r.text();
    const j = text ? JSON.parse(text) : null;

    if (!r.ok || !j?.success) throw new Error(j?.message || 'fetch failed');

    return j.data;
  } catch (err) {
    console.error('getTripPlanDetail error:', err);
    return null;
  }
}
