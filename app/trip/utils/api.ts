// app/trip/utils/api.ts
const API_BASE = 'http://localhost:3005/api';

// 取得所有行程
export async function getTrips(userId?: number) {
  const url = userId
    ? `${API_BASE}/trips?userId=${userId}`
    : `${API_BASE}/trips`;
  const res = await fetch(url);
  const json = await res.json();
  return json.success ? json.data : [];
}

// 取得單一行程
export async function getTripById(id: string | number) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

    const res = await fetch(`${API_URL}/api/trips/${id}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('取得行程失敗:', err);
    return { success: false, message: '伺服器錯誤' };
  }
}

// 建立新行程
export async function createTrip(tripData: any) {
  const res = await fetch(`${API_BASE}/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  return await res.json();
}

// 取得所有支出
export async function getExpenses(tripPlanId: number) {
  const res = await fetch(`${API_BASE}/expenses?tripPlanId=${tripPlanId}`);
  const json = await res.json();
  return json.success ? json.data : [];
}

// 取得支出分類
export async function getExpenseTypes() {
  const res = await fetch(`${API_BASE}/expense-types`);
  const json = await res.json();
  return json.success ? json.data : [];
}

// 新增支出
export async function createExpense(data: any) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// 刪除支出
export async function deleteExpense(id: number) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
  return await res.json();
}
