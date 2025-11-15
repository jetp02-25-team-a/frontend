'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Pencil } from 'lucide-react';

import AddExpenseModal from './AddExpenseModal';
import EditExpenseModal from './EditExpenseModal';

interface ExpenseType {
  id: number;
  name: string;
}

interface ExpenseItem {
  id: number;
  title: string;
  amount: number;
  area: string | null;
  expenseDate: string;
  typeId: number | null;
  Type: ExpenseType | null;
}

interface ExpensePanelProps {
  tripId: number;
}

// Figma 分類（照名稱比對）
const CATEGORY_ORDER = ['美食', '住宿', '交通', '購物', '票券'];

export default function ExpensePanel({ tripId }: ExpensePanelProps) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [types, setTypes] = useState<ExpenseType[]>([]);
  const [expanded, setExpanded] = useState<string | null>('美食');

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<ExpenseItem | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  /** ⬇️ 同時取得 支出 + 類別 */
  async function fetchAll() {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
    const res = await fetch(`${BASE}/api/m2/expense/${tripId}/all`);
    const json = await res.json();

    if (json.success) {
      setExpenses(json.expenses);
      setTypes(json.types);
    }
  }

  /** 依類別過濾 */
  function getListByCategory(cat: string) {
    return expenses.filter((e) => e.Type?.name === cat);
  }

  /** 計算每類總額 */
  function getTotal(cat: string) {
    return getListByCategory(cat).reduce((sum, e) => sum + e.amount, 0);
  }

  /** 刪除支出 */
  async function deleteItem(id: number) {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
    await fetch(`${BASE}/api/m2/expense/expenses/${id}`, {
      method: 'DELETE',
    });

    fetchAll();
  }

  return (
    <>
      <div className="space-y-4">
        {CATEGORY_ORDER.map((cat) => {
          const list = getListByCategory(cat);
          const total = getTotal(cat);

          return (
            <div
              key={cat}
              className="bg-white shadow rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex justify-between items-center cursor-pointer bg-gray-100"
                onClick={() => setExpanded(expanded === cat ? null : cat)}
              >
                <span className="font-semibold">{cat}</span>

                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm">
                    NT$ {total.toLocaleString()}
                  </span>
                  {expanded === cat ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>

              {/* Content */}
              {expanded === cat && (
                <div className="p-4 space-y-4">
                  {list.length === 0 && (
                    <div className="text-gray-400 text-sm">尚無資料</div>
                  )}

                  {list.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <div className="text-sm leading-relaxed">
                        <div className="text-gray-700 font-medium">
                          {item.title}
                        </div>
                        <div className="text-gray-500">
                          日期：{item.expenseDate?.slice(0, 10)}
                        </div>
                        <div className="text-gray-500">
                          地點：{item.area || '無'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          NT$ {item.amount.toLocaleString()}
                        </span>

                        <Pencil
                          size={18}
                          className="text-blue-500 cursor-pointer"
                          onClick={() => setEditItem(item)}
                        />

                        <Trash2
                          size={18}
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteItem(item.id)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* 新增按鈕 */}
                  <button
                    className="w-full py-2 bg-yellow-300 rounded-full font-semibold hover:bg-yellow-400"
                    onClick={() => setShowAdd(true)}
                  >
                    新 增
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal：新增 */}
      {showAdd && (
        <AddExpenseModal
          tripId={tripId}
          types={types}
          onClose={() => setShowAdd(false)}
          onSaved={fetchAll}
        />
      )}

      {/* Modal：編輯 */}
      {editItem && (
        <EditExpenseModal
          expense={editItem}
          types={types}
          onClose={() => setEditItem(null)}
          onSaved={fetchAll}
        />
      )}
    </>
  );
}
