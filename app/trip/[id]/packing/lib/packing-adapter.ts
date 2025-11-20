// app/trip/[id]/packing/lib/packing-adapter.ts
'use client';

import { API_URL } from '@/config/api-path';

export interface PackingItem {
  id: number;
  TripPlanId: number;
  userId?: number | null;
  templateId: number | null;
  name: string;
  isChecked: boolean;
}

// 從 templateId 對應類別名稱（對照你給的 DB 截圖）
export const PACKING_TEMPLATE_NAME: Record<number, string> = {
  1: '重要證件',
  2: '衣物類',
  3: '3C物品',
  4: '日常盥洗用品',
  5: '其他物品',
};

function parseJsonSafe(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// 取得指定行程的所有行李項目
export async function fetchPackingList(tripId: number): Promise<PackingItem[]> {
  const res = await fetch(`${API_URL}/api/m2/packing/${tripId}`, {
    cache: 'no-store',
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || '取得行李清單失敗');
  }

  const json = parseJsonSafe(text);

  // API 可能是純陣列，也可能是 { data: [...] }
  if (Array.isArray(json)) return json as PackingItem[];
  if (Array.isArray(json.data)) return json.data as PackingItem[];

  return [];
}

// 新增行李項目
export async function createPackingItem(params: {
  tripId: number;
  name: string;
  templateId: number | null;
}) {
  const body = {
    TripPlanId: params.tripId,
    templateId: params.templateId,
    name: params.name,
    isChecked: false,
  };

  const res = await fetch(`${API_URL}/api/m2/packing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || '新增行李項目失敗');
  }

  return parseJsonSafe(text);
}

// 更新（勾選 / 改名稱）
export async function updatePackingItem(item: PackingItem) {
  const res = await fetch(`${API_URL}/api/m2/packing/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || '更新行李項目失敗');
  }

  return parseJsonSafe(text);
}

// 刪除
export async function deletePackingItem(id: number) {
  const res = await fetch(`${API_URL}/api/m2/packing/${id}`, {
    method: 'DELETE',
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || '刪除行李項目失敗');
  }

  return parseJsonSafe(text);
}
