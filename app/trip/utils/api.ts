'use client';

/* ============================================
   🔧 API Base 設定
============================================ */
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
export const API_BASE = `${BASE}/api/m2`;

/* ============================================
   🔧 統一 API 請求方法
============================================ */
async function request<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: any
): Promise<T> {
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };

  if (data && method !== 'GET' && method !== 'DELETE') {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  let json = {};

  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error((json as any).message || 'API Error');
  }

  return json as T;
}

/* ============================================
   🟦 Trip API
============================================ */
export const TripAPI = {
  getAll: () => request('GET', `/trip`),

  getById: (id: number) => request('GET', `/trip/${id}`),

  create: (data: any) => request('POST', `/trip`, data),

  update: (id: number, data: any) => request('PUT', `/trip/${id}`, data),

  remove: (id: number) => request('DELETE', `/trip/${id}`),
};

/* ============================================
   🟫 Destination API
============================================ */
export const DestinationAPI = {
  getAll: () => request('GET', `/destination`),
};

/* ============================================
   🟧 Expense API
============================================ */
export const ExpenseAPI = {
  getByTrip: (tripId: number) => request('GET', `/expense/${tripId}/expenses`),

  create: (tripId: number, data: any) =>
    request('POST', `/expense/${tripId}/expenses`, data),

  delete: (id: number) => request('DELETE', `/expense/expenses/${id}`),
};

/* ============================================
   🟩 Packing API
============================================ */
export const PackingAPI = {
  getByTrip: (tripId: number) => request('GET', `/packing/${tripId}/packing`),

  add: (tripId: number, data: any) =>
    request('POST', `/packing/${tripId}/packing`, data),

  toggle: (id: number) => request('PATCH', `/packing/packing/${id}`),

  delete: (id: number) => request('DELETE', `/packing/packing/${id}`),
};

/* ============================================
   🟦 Trip Plan Detail API  
   (新增 / 編輯 / 刪除 / 依日期查詢)
============================================ */
export const TripPlanDetailAPI = {
  /** GET: 取得特定日期的行程 */
  getByTripDay: (tripId: number, day: string) =>
    request('GET', `/plan/${tripId}/detail?day=${day}`),

  /** POST: 新增一筆行程 detail */
  create: (tripId: number, data: any) =>
    request('POST', `/plan/${tripId}/detail`, data),

  /** PUT: 編輯行程 detail */
  update: (id: number, data: any) => request('PUT', `/plan/detail/${id}`, data),

  /** DELETE: 刪除行程 detail */
  delete: (id: number) => request('DELETE', `/plan/detail/${id}`),
};
