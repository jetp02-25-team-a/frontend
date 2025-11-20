// app/trip/[id]/packing/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PACKING_TEMPLATE_NAME,
  PackingItem,
  fetchPackingList,
  updatePackingItem,
  deletePackingItem,
  createPackingItem,
} from './lib/packing-adapter';

interface PackingGroupModel {
  templateId: number | null;
  title: string;
  items: PackingItem[];
}

import PackingGroup from './_components/PackingGroup';

export default function TripPackingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tripId = Number(params.id);

  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchPackingList(tripId);
        setItems(list);
      } catch (err: any) {
        console.error(err);
        setError(err.message || '載入失敗');
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const groups = useMemo<PackingGroupModel[]>(() => {
    const map = new Map<string, PackingGroupModel>();

    for (const item of items) {
      const tid = item.templateId;
      const key = String(tid ?? 'null');

      if (!map.has(key)) {
        const title =
          tid && PACKING_TEMPLATE_NAME[tid]
            ? PACKING_TEMPLATE_NAME[tid]
            : '未分類';

        map.set(key, {
          templateId: tid ?? null,
          title,
          items: [],
        });
      }
      map.get(key)!.items.push(item);
    }

    return Array.from(map.values()).sort((a, b) => {
      const av = a.templateId ?? 999;
      const bv = b.templateId ?? 999;
      return av - bv;
    });
  }, [items]);

  async function handleToggleChecked(id: number, checked: boolean) {
    const target = items.find((i) => i.id === id);
    if (!target) return;

    const optimistic = items.map((i) =>
      i.id === id ? { ...i, isChecked: checked } : i
    );
    setItems(optimistic);

    try {
      await updatePackingItem({ ...target, isChecked: checked });
    } catch (err) {
      console.error(err);
      alert('更新失敗，請稍後再試');
      // revert
      setItems(items);
    }
  }

  async function handleRename(id: number, name: string) {
    const target = items.find((i) => i.id === id);
    if (!target || target.name === name) return;

    const optimistic = items.map((i) => (i.id === id ? { ...i, name } : i));
    setItems(optimistic);

    try {
      await updatePackingItem({ ...target, name });
    } catch (err) {
      console.error(err);
      alert('更新失敗，請稍後再試');
      setItems(items);
    }
  }

  async function handleDelete(id: number) {
    const confirmDel = window.confirm('確定要刪除此項目嗎？');
    if (!confirmDel) return;

    const prev = items;
    setItems((list) => list.filter((i) => i.id !== id));
    try {
      await deletePackingItem(id);
    } catch (err) {
      console.error(err);
      alert('刪除失敗，請稍後再試');
      setItems(prev);
    }
  }

  async function handleAddItem(templateId: number | null, name: string) {
    const tempId = Math.random() * -100000; // 先產生暫時 id
    const optimisticItem: PackingItem = {
      id: tempId,
      TripPlanId: tripId,
      templateId,
      name,
      isChecked: false,
    };

    setItems((list) => [...list, optimisticItem]);

    try {
      const result = await createPackingItem({ tripId, templateId, name });

      // 如果後端有回傳真實 id，就把暫時的換掉
      const real = (result && (result.data || result)) ?? null;

      if (real && typeof real.id === 'number') {
        setItems((list) =>
          list.map((i) => (i.id === tempId ? { ...real } : i))
        );
      }
    } catch (err) {
      console.error(err);
      alert('新增失敗，請稍後再試');
      setItems((list) => list.filter((i) => i.id !== tempId));
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
                className="block rounded-full px-4 py-2 bg-amber-100 text-amber-700 font-medium"
              >
                行李清單
              </Link>
              <Link
                href={`/trip/${tripId}/expense`}
                className="block rounded-full px-4 py-2 text-neutral-600 hover:bg-neutral-100"
              >
                記帳
              </Link>
            </nav>
          </div>
        </aside>

        {/* 右側內容 */}
        <section className="col-span-12 md:col-span-9 space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-neutral-800">行李清單</h1>
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
            <div className="space-y-4">
              {groups.map((g) => (
                <PackingGroup
                  key={`${g.templateId ?? 'null'}`}
                  title={g.title}
                  templateId={g.templateId}
                  items={g.items}
                  onToggleChecked={handleToggleChecked}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  onAddItem={handleAddItem}
                />
              ))}

              {groups.length === 0 && (
                <p className="text-sm text-neutral-500">
                  目前尚未有行李項目，先新增幾個吧！
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
