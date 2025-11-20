// app/trip/[id]/expense/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ExpenseItem,
  EXPENSE_TYPE_NAME,
  fetchExpenseList,
  createExpense,
  deleteExpense,
} from './lib/expense-adapter';
import ExpenseGroup from './_components/ExpenseGroup';

interface ExpenseGroupModel {
  typeId: number;
  title: string;
  items: ExpenseItem[];
}

export default function TripExpensePage() {
  const params = useParams<{ id: string }>();
  const tripId = Number(params.id);

  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchExpenseList(tripId);
        setItems(list);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '載入失敗');
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.amount, 0),
    [items]
  );

  const groups = useMemo<ExpenseGroupModel[]>(() => {
    const map = new Map<number, ExpenseGroupModel>();

    for (const item of items) {
      if (!map.has(item.typeId)) {
        map.set(item.typeId, {
          typeId: item.typeId,
          title: EXPENSE_TYPE_NAME[item.typeId] || `類別 ${item.typeId}`,
          items: [],
        });
      }
      map.get(item.typeId)!.items.push(item);
    }

    // 固定順序顯示
    const order = [5, 3, 1, 2, 4];
    return Array.from(map.values()).sort(
      (a, b) => order.indexOf(a.typeId) - order.indexOf(b.typeId)
    );
  }, [items]);

  async function handleAdd(typeId: number, title: string, amount: number) {
    const tempId = Math.random() * -100000;
    const optimistic: ExpenseItem = {
      id: tempId,
      tripId,
      typeId,
      title,
      amount,
    };

    setItems((list) => [...list, optimistic]);

    try {
      const result = await createExpense({ tripId, typeId, title, amount });
      const real = (result && (result.data || result)) ?? null;
      if (real && typeof real.id === 'number') {
        setItems((list) =>
          list.map((i) => (i.id === tempId ? { ...i, id: real.id } : i))
        );
      }
    } catch (err) {
      console.error(err);
      alert('新增失敗，請稍後再試');
      setItems((list) => list.filter((i) => i.id !== tempId));
    }
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('確定要刪除此筆記帳嗎？');
    if (!ok) return;

    const prev = items;
    setItems((list) => list.filter((i) => i.id !== id));

    try {
      await deleteExpense(id);
    } catch (err) {
      console.error(err);
      alert('刪除失敗，請稍後再試');
      setItems(prev);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFDF7]">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-12 gap-8">
        {/* 左側側邊欄 */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-3xl bg-white shadow-sm border border-neutral-100 p-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-sm">
                🙂
              </div>
              <div>
                <div className="text-sm font-semibold">我的行程</div>
                <div className="text-xs text-neutral-500">
                  Trip ID：{tripId}
                </div>
              </div>
            </div>

            <nav className="space-y-2 text-sm">
              <Link
                href={`/trip/${tripId}`}
                className="block rounded-full px-4 py-2 text-neutral-600 hover:bg-neutral-100"
              >
                行程資訊
              </Link>
              <Link
                href={`/trip/${tripId}/packing`}
                className="block rounded-full px-4 py-2 text-neutral-600 hover:bg-neutral-100"
              >
                行李清單
              </Link>
              <Link
                href={`/trip/${tripId}/expense`}
                className="block rounded-full px-4 py-2 bg-amber-100 text-amber-700 font-medium"
              >
                記帳
              </Link>
            </nav>
          </div>
        </aside>

        {/* 右側內容 */}
        <section className="col-span-12 md:col-span-9">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-neutral-800">記帳</h1>
            <div className="text-sm text-neutral-800">
              合計：<span className="font-semibold">NT$ {total}</span>
            </div>
          </header>

          {loading ? (
            <div className="rounded-2xl bg-white shadow-sm p-6 text-sm text-neutral-500">
              載入中...
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="rounded-3xl bg-white shadow-sm border border-neutral-100 px-6 py-4">
              {groups.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  目前尚未有任何記帳，先新增一筆吧！
                </p>
              ) : (
                groups.map((g) => (
                  <ExpenseGroup
                    key={g.typeId}
                    title={g.title}
                    items={g.items}
                    onAdd={(title, amount) =>
                      handleAdd(g.typeId, title, amount)
                    }
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
