'use client';
import { useState, useEffect } from 'react';
import { createExpense, fetchExpenseTypes } from './expense';
import type { ExpenseFormData, ExpenseType } from './types';

export default function ExpenseModal({
  visible,
  onClose,
  tripPlanId,
  onRefresh,
}: any) {
  const [types, setTypes] = useState<ExpenseType[]>([]);
  const [form, setForm] = useState<ExpenseFormData>({
    title: '',
    amount: 0,
    typeId: undefined,
    area: '',
    expenseDate: '',
    tripPlanId,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenseTypes().then(setTypes);
  }, []);

  if (!visible) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'amount'
          ? parseFloat(value)
          : name === 'typeId'
            ? parseInt(value, 10)
            : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await createExpense(form);
    await onRefresh();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-md w-[400px] space-y-4"
      >
        <h2 className="text-lg font-bold text-center">新增支出</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="支出項目"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="金額"
          className="w-full border rounded px-3 py-2"
          required
        />

        <select
          name="typeId"
          value={form.typeId ?? ''}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">選擇分類</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          name="area"
          value={form.area}
          onChange={handleChange}
          placeholder="地點（選填）"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="expenseDate"
          type="date"
          value={form.expenseDate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#F5C364] hover:bg-[#f3b640] text-white font-semibold w-full py-2 rounded-full transition"
        >
          {loading ? '送出中...' : '送出'}
        </button>

        <p
          onClick={onClose}
          className="text-center text-gray-400 cursor-pointer text-sm hover:underline"
        >
          取消
        </p>
      </form>
    </div>
  );
}
