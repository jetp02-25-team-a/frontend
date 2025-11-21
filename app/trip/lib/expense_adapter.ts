// app/trip/lib/expense_adapter.ts
'use client';

import { API_URL } from '@/config/api-path';
import type { ExpenseItem } from '../_components/types';

// 取得某 Trip 的所有記帳
export async function getExpenseList(tripId: number): Promise<ExpenseItem[]> {
  const res = await fetch(`${API_URL}/api/m2/expense/trip/${tripId}`, {
    cache: 'no-store',
  });

  const text = await res.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('ExpenseList parse error:', text);
    throw new Error('後端不是合法 JSON 回應');
  }

  if (!res.ok) throw new Error(json?.message || '取得記帳失敗');

  const data = Array.isArray(json) ? json : (json?.data ?? []);

  return data as ExpenseItem[];
}

// 新增記帳
export async function createExpense(payload: {
  tripId: number;
  typeId: number;
  title: string;
  amount: number;
  date: string;
  place?: string;
  note?: string;
}): Promise<ExpenseItem> {
  const res = await fetch(`${API_URL}/api/m2/expense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('CreateExpense parse error:', text);
    throw new Error('後端不是合法 JSON 回應');
  }

  if (!res.ok) throw new Error(json?.message || '新增記帳失敗');

  return json as ExpenseItem;
}

// 刪除記帳
export async function deleteExpense(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/m2/expense/${id}`, {
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
    throw new Error(json?.message || '刪除記帳失敗');
  }
}
