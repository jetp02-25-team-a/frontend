'use client';

import { useEffect, useState, useMemo } from 'react';
import { API_URL } from '@/config/api-path';
import Toast from '@/app/place/_components/Toast';

// 分類名稱對應
const EXPENSE_TYPE_NAME: Record<number, string> = {
  5: '美食',
  2: '住宿',
  1: '交通',
  3: '門票',
  4: '購物',
};

interface ExpenseItem {
  id: number;
  tripId: number;
  typeId: number;
  title: string;
  amount: number;
  expenseDate?: string; // 日期欄位
}

interface ExpenseGroup {
  typeId: number;
  title: string;
  items: ExpenseItem[];
}

export default function ExpensePanel({ tripId }: { tripId: number }) {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 將項目分組
  const groups = useMemo<ExpenseGroup[]>(() => {
    const map = new Map<number, ExpenseGroup>();

    // 先初始化所有分類
    const allTypeIds = [5, 2, 1, 3, 4]; // 美食、住宿、交通、門票、購物
    for (const typeId of allTypeIds) {
      map.set(typeId, {
        typeId,
        title: EXPENSE_TYPE_NAME[typeId] || `類別 ${typeId}`,
        items: [],
      });
    }

    // 將項目分配到對應的分類
    for (const item of items) {
      if (map.has(item.typeId)) {
        map.get(item.typeId)!.items.push(item);
      }
    }

    return allTypeIds.map((typeId) => map.get(typeId)!);
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.amount, 0),
    [items]
  );

  async function loadExpense() {
    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/api/m2/expense/trip/${tripId}`);
      
      if (!r.ok) {
        throw new Error('載入記帳資料失敗');
      }
      
      const text = await r.text();
      const j = text ? JSON.parse(text) : null;
      
      // 轉換資料格式
      const normalized = Array.isArray(j) ? j : (j?.data || j?.success ? (j.data || []) : []);
      const expenseItems: ExpenseItem[] = normalized.map((e: any) => {
        // 處理日期：可能是 DateTime 物件或字串
        let expenseDateStr: string | undefined;
        if (e.expenseDate) {
          if (typeof e.expenseDate === 'string') {
            expenseDateStr = e.expenseDate.split('T')[0];
          } else if (e.expenseDate instanceof Date) {
            expenseDateStr = e.expenseDate.toISOString().split('T')[0];
          } else if (e.expense_date) {
            // 處理後端可能回傳的 expense_date
            expenseDateStr = typeof e.expense_date === 'string' 
              ? e.expense_date.split('T')[0]
              : new Date(e.expense_date).toISOString().split('T')[0];
          }
        } else if (e.date) {
          expenseDateStr = typeof e.date === 'string' 
            ? e.date.split('T')[0]
            : new Date(e.date).toISOString().split('T')[0];
        }
        
        return {
          id: e.id,
          tripId: e.tripId || e.TripPlanId || tripId,
          typeId: e.typeId || e.expenseTypeId || e.ExpenseTypeId || 5, // 預設為美食
          title: e.title || e.note || e.name || '',
          amount: Number(e.amount || e.price || 0),
          expenseDate: expenseDateStr || new Date().toISOString().split('T')[0], // 日期欄位
        };
      });
      
      setItems(expenseItems);
    } catch (err) {
      console.error('載入記帳資料失敗:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(typeId: number, title: string, amount: number, expenseDate?: string) {
    // 從 localStorage 取得 userId
    const userInfo = localStorage.getItem('BackpackUserInfo');
    const userId = userInfo ? JSON.parse(userInfo).user?.id || JSON.parse(userInfo).id : null;
    
    if (!userId) {
      alert('請先登入');
      return;
    }

    const userInfoStr = localStorage.getItem('BackpackUserInfo');
    const token = userInfoStr ? JSON.parse(userInfoStr).token : '';

    try {
      const res = await fetch(`${API_URL}/api/m2/expense`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tripPlanId: tripId,
          userId: userId,
          typeId,
          title,
          amount,
          expenseDate: expenseDate || new Date().toISOString().split('T')[0], // 預設為今天
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || '新增記帳項目失敗');
      }

      // 重新載入資料
      await loadExpense();
    } catch (err: any) {
      console.error('新增記帳項目失敗:', err);
      alert('新增記帳項目失敗：' + (err.message || '未知錯誤'));
    }
  }

  async function deleteItem(id: number) {
    await fetch(`${API_URL}/api/m2/expense/${id}`, { method: 'DELETE' });
    await loadExpense();
  }

  useEffect(() => {
    if (tripId) {
      loadExpense();
    }
  }, [tripId]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">記帳</h2>
        <div className="text-sm text-neutral-800">
          合計：<span className="font-semibold text-amber-500">NT$ {total}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-500">載入中...</div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <ExpenseGroupCard
              key={group.typeId}
              group={group}
              onAdd={addItem}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ExpenseGroupCard({
  group,
  onAdd,
  onDelete,
}: {
  group: ExpenseGroup;
  onAdd: (typeId: number, title: string, amount: number, expenseDate?: string) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]); // 日期欄位
  const subtotal = group.items.reduce((sum, i) => sum + i.amount, 0);

  function handleAdd() {
    const t = newTitle.trim();
    const a = Number(newAmount);
    if (!t || !a || a <= 0) return;
    onAdd(group.typeId, t, a, newDate);
    setNewTitle('');
    setNewAmount('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setAdding(false);
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
      <header
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-neutral-100 rounded-t-2xl hover:bg-neutral-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="font-medium text-base text-neutral-800">{group.title}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-700">小計 NT$ {subtotal}</span>
          <span className="text-neutral-400 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </header>

      {open && (
        <div className="px-5 pb-4 bg-white rounded-b-2xl">
          <div className="space-y-0">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="text-sm text-neutral-700">{item.title}</div>
                  {item.expenseDate && (
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {typeof item.expenseDate === 'string' 
                        ? item.expenseDate.split('T')[0].replace(/-/g, '/')
                        : new Date(item.expenseDate).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-neutral-800 font-medium">NT$ {item.amount}</div>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 text-lg font-semibold px-2 transition-colors"
                    aria-label="刪除"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {adding ? (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                <input
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                  placeholder="項目名稱"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <input
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 w-28"
                  placeholder="金額"
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-[auto_auto] gap-2 items-center">
                <input
                  type="date"
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-amber-400 text-white px-3 py-1.5 text-xs hover:bg-amber-500"
                    onClick={handleAdd}
                  >
                    新增
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-neutral-300 text-neutral-500 px-3 py-1.5 text-xs hover:bg-neutral-50"
                    onClick={() => {
                      setAdding(false);
                      setNewAmount('');
                      setNewTitle('');
                      setNewDate(new Date().toISOString().split('T')[0]);
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="mt-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              onClick={() => setAdding(true)}
            >
              ＋ 新增
            </button>
          )}
        </div>
      )}
    </div>
  );
}
