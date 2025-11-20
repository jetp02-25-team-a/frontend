'use client';

import { useEffect, useState, useMemo } from 'react';
import { API_URL } from '@/config/api-path';
import Toast from '@/app/place/_components/Toast';

// 分類名稱對應
const PACKING_TEMPLATE_NAME: Record<number, string> = {
  1: '重要證件',
  2: '衣物類',
  3: '3C物品',
  4: '日常盥洗用品',
  5: '其他物品',
};

interface PackingItem {
  id: number;
  TripPlanId: number;
  templateId: number | null;
  name: string;
  isChecked: boolean;
}

interface PackingGroup {
  templateId: number | null;
  title: string;
  items: PackingItem[];
}

export default function PackingPanel({ tripId }: { tripId: number }) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 將項目分組
  const groups = useMemo<PackingGroup[]>(() => {
    const map = new Map<string, PackingGroup>();

    // 先初始化所有分類
    const allTemplateIds = [1, 2, 3, 4, 5];
    for (const tid of allTemplateIds) {
      const key = String(tid);
      const title = PACKING_TEMPLATE_NAME[tid] || '未分類';
      map.set(key, {
        templateId: tid,
        title,
        items: [],
      });
    }

    // 將項目分配到對應的分類
    for (const item of items) {
      const tid = item.templateId;
      if (tid) {
        const key = String(tid);
        if (map.has(key)) {
          map.get(key)!.items.push(item);
        } else {
          const nullKey = 'null';
          if (!map.has(nullKey)) {
            map.set(nullKey, {
              templateId: null,
              title: '未分類',
              items: [],
            });
          }
          map.get(nullKey)!.items.push(item);
        }
      } else {
        const nullKey = 'null';
        if (!map.has(nullKey)) {
          map.set(nullKey, {
            templateId: null,
            title: '未分類',
            items: [],
          });
        }
        map.get(nullKey)!.items.push(item);
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const av = a.templateId ?? 999;
      const bv = b.templateId ?? 999;
      return av - bv;
    });
  }, [items]);

  async function loadPacking() {
    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/api/m2/packing/${tripId}`);
      const j = await r.json();
      setItems(Array.isArray(j) ? j : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleCheck(id: number, isChecked: boolean) {
    await fetch(`${API_URL}/api/m2/packing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isChecked }),
    });
    await loadPacking();
  }

  async function deleteItem(id: number) {
    await fetch(`${API_URL}/api/m2/packing/${id}`, { method: 'DELETE' });
    await loadPacking();
  }

  async function addItem(templateId: number | null, name: string) {
    await fetch(`${API_URL}/api/m2/packing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TripPlanId: tripId,
        templateId,
        name,
        isChecked: false,
      }),
    });
    await loadPacking();
  }

  useEffect(() => {
    loadPacking();
  }, [tripId]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow space-y-4">
      <h2 className="text-lg font-semibold">行李清單</h2>

      {loading ? (
        <div className="text-sm text-neutral-500">載入中...</div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <PackingGroupCard
              key={group.templateId ?? 'null'}
              group={group}
              onToggleCheck={toggleCheck}
              onDelete={deleteItem}
              onAddItem={addItem}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PackingGroupCard({
  group,
  onToggleCheck,
  onDelete,
  onAddItem,
}: {
  group: PackingGroup;
  onToggleCheck: (id: number, checked: boolean) => void;
  onDelete: (id: number) => void;
  onAddItem: (templateId: number | null, name: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const total = group.items.length;
  const checked = group.items.filter((i) => i.isChecked).length;

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    onAddItem(group.templateId, name);
    setNewName('');
    setAdding(false);
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
      <header
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-neutral-100 rounded-t-2xl hover:bg-neutral-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="font-medium text-base text-neutral-800">
          {group.title} ({checked}/{total})
        </div>
        <span className="text-neutral-400 text-sm">{open ? '▲' : '▼'}</span>
      </header>

      {open && (
        <div className="px-5 pb-4 bg-white rounded-b-2xl">
          <div className="space-y-0">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
              >
                <label className="flex items-center gap-3 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-2 border-amber-400 text-amber-500 focus:ring-2 focus:ring-amber-200 focus:ring-offset-0 cursor-pointer accent-amber-500 checked:bg-amber-500 checked:border-amber-500"
                    checked={item.isChecked}
                    onChange={(e) => onToggleCheck(item.id, e.target.checked)}
                  />
                  <span
                    className={`text-sm flex-1 ${
                      item.isChecked
                        ? 'text-neutral-400 line-through'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.name}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-red-500 hover:text-red-700 text-lg font-semibold px-2 transition-colors"
                  aria-label="刪除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* 新增項目 */}
          {adding ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                placeholder="輸入項目名稱"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                type="button"
                className="text-sm px-3 py-1.5 rounded-lg bg-amber-400 text-white hover:bg-amber-500"
                onClick={handleAdd}
              >
                新增
              </button>
              <button
                type="button"
                className="text-xs text-neutral-500 px-2"
                onClick={() => {
                  setAdding(false);
                  setNewName('');
                }}
              >
                取消
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="mt-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              onClick={() => setAdding(true)}
            >
              ＋ 新增項目
            </button>
          )}
        </div>
      )}
    </div>
  );
}
