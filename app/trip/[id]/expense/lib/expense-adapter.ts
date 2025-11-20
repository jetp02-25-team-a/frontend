// app/trip/[id]/expense/lib/expense-adapter.ts
'use client';

import { API_URL } from '@/config/api-path';

export interface ExpenseItem {
  id: number;
  tripId: number;
  typeId: number;
  title: string;
  amount: number;
}

export const EXPENSE_TYPE_NAME: Record<number, string> = {
  5: '美食',
  3: '住宿',
  1: '交通',
  2: '門票',
  4: '購物',
};

function parseJsonSafe(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeExpense(raw: any): ExpenseItem | null {
  if (!raw) return null;
  const id = raw.id;
  const tripId =
    raw.tripId ?? raw.TripPlanId ?? raw.trip_plan_id ?? raw.trip_planId;
  const typeId =
    raw.typeId ??
    raw.expenseTypeId ??
    raw.ExpenseTypeId ??
    raw.expense_type_id ??
    raw.type_id ??
    raw.type;
  const title = raw.title ?? raw.name ?? '';
  const amount = Number(raw.amount ?? 0);

  if (!id || !tripId || !typeId) return null;

  return { id, tripId, typeId, title, amount };
}

// 取得該行程所有記帳
export async function fetchExpenseList(tripId: number): Promise<ExpenseItem[]> {
  const res = await fetch(`${API_URL}/api/m2/expense/trip/${tripId}`, {
    cache: 'no-store',
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || '取得記帳失敗');

  const json = parseJsonSafe(text);

  const arr = Array.isArray(json)
    ? json
    : Array.isArray(json.data)
      ? json.data
      : [];

  return arr
    .map((r) => normalizeExpense(r))
    .filter((x): x is ExpenseItem => !!x);
}

// 新增記帳
export async function createExpense(params: {
  tripId: number;
  typeId: number;
  title: string;
  amount: number;
}) {
  const body = {
    tripId: params.tripId,
    typeId: params.typeId,
    title: params.title,
    amount: params.amount,
  };

  const res = await fetch(`${API_URL}/api/m2/expense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || '新增記帳失敗');

  return parseJsonSafe(text);
}

// 刪除
export async function deleteExpense(id: number) {
  const res = await fetch(`${API_URL}/api/m2/expense/${id}`, {
    method: 'DELETE',
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || '刪除記帳失敗');

  return parseJsonSafe(text);
}
