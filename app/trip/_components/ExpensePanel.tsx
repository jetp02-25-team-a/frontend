'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/config/api-path';
import Toast from '@/app/place/_components/Toast';

export default function ExpensePanel({ tripId }: { tripId: number }) {
  const [expenses, setExpenses] = useState([]);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState(null);

  async function loadExpense() {
    const r = await fetch(`${API_URL}/api/m2/expense/trip/${tripId}`);
    const j = await r.json();
    setExpenses(j);
  }

  async function addExpense() {
    if (!price) return;

    await fetch(`${API_URL}/api/m2/expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TripPlanId: tripId,
        price,
        note,
      }),
    });

    setPrice('');
    setNote('');
    await loadExpense();
    setToast({ message: '已新增記帳', type: 'success' });
  }

  async function deleteExpense(id) {
    await fetch(`${API_URL}/api/m2/expense/${id}`, { method: 'DELETE' });
    await loadExpense();
    setToast({ message: '已刪除', type: 'success' });
  }

  useEffect(() => {
    loadExpense();
  }, []);

  return (
    <section className="rounded-3xl bg-white p-6 shadow space-y-4">
      <h2 className="text-lg font-semibold">記帳</h2>

      <div className="grid grid-cols-3 gap-2">
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="金額"
          className="border rounded-xl px-3 py-2"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="備註"
          className="border rounded-xl px-3 py-2 col-span-2"
        />
      </div>

      <button
        onClick={addExpense}
        className="bg-amber-400 text-white px-4 py-2 rounded-full"
      >
        新增
      </button>

      <div className="space-y-2">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="flex justify-between items-center border p-3 rounded-xl"
          >
            <div>
              <div className="font-semibold text-amber-600">NT$ {e.price}</div>
              <div className="text-neutral-500 text-sm">{e.note}</div>
            </div>

            <button
              className="text-red-500 text-sm"
              onClick={() => deleteExpense(e.id)}
            >
              刪除
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
