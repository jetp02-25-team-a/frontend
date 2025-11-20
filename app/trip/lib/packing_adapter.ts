// app/trip/lib/packing_adapter.ts
'use client';

import { API_URL } from '@/config/api-path';
import type { PackingItem } from '../_components/types';

// 取得行李清單
export async function getPackingList(tripId: number): Promise<PackingItem[]> {
  const res = await fetch(`${API_URL}/api/m2/packing/${tripId}`, {
    cache: 'no-store',
  });

  const text = await res.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('PackingList parse error:', text);
    throw new Error('後端不是合法 JSON 回應');
  }

  if (!res.ok) {
    throw new Error(json?.message || '取得行李清單失敗');
  }

  return Array.isArray(json) ? json : (json?.data ?? []);
}

// 新增行李項目
export async function createPackingItem(
  tripId: number,
  name: string
): Promise<PackingItem> {
  const res = await fetch(`${API_URL}/api/m2/packing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TripPlanId: tripId,
      name,
    }),
  });

  const text = await res.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('CreatePacking parse error:', text);
    throw new Error('後端不是合法 JSON 回應');
  }

  if (!res.ok) {
    throw new Error(json?.message || '新增失敗');
  }

  return json as PackingItem;
}

// 更新 / 勾選
export async function updatePackingItem(
  id: number,
  patch: Partial<PackingItem>
): Promise<PackingItem> {
  const res = await fetch(`${API_URL}/api/m2/packing/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });

  const text = await res.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('UpdatePacking parse error:', text);
    throw new Error('後端不是合法 JSON 回應');
  }

  if (!res.ok) {
    throw new Error(json?.message || '更新失敗');
  }

  return json as PackingItem;
}

// 刪除
export async function deletePackingItem(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/m2/packing/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      /* ignore */
    }
    throw new Error(json?.message || '刪除失敗');
  }
}
