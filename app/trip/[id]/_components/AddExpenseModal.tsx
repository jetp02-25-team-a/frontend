'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ExpenseType {
  id: number;
  name: string;
}

interface AddExpenseModalProps {
  tripId: number;
  types: ExpenseType[];
  onClose: () => void;
  onSaved: () => void;
}

export default function AddExpenseModal({
  tripId,
  types,
  onClose,
  onSaved,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [area, setArea] = useState('');
  const [typeId, setTypeId] = useState<number | ''>('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function handleSubmit() {
    if (!title || !amount || !typeId) {
      alert('請完整填寫欄位');
      return;
    }

    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

    const res = await fetch(`${BASE}/api/m2/expense/${tripId}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripPlanId: tripId,
        userId: 1,
        title,
        amount,
        typeId,
        area,
        expenseDate: date,
      }),
    });

    const json = await res.json();
    if (json.success) {
      onSaved();
      onClose();
    } else {
      alert('新增失敗');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[520px] bg-white rounded-2xl p-6 shadow-xl relative">
        {/* Close */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">💰 新增記帳</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="項目名稱"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            placeholder="金額"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="地點"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          {/* 類別 */}
          <select
            value={typeId}
            onChange={(e) => setTypeId(Number(e.target.value))}
            className="w-full border rounded-lg p-3"
          >
            <option value="">選擇分類</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* 日期 */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"
        >
          新 增
        </button>
      </div>
    </div>
  );
}
