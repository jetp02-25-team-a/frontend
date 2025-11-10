'use client';

import { useEffect, useState } from 'react';
import type { ExpenseFormData, ExpenseType } from './types';
import { createExpense, fetchExpenseTypes } from './expense';

export default function ExpenseForm({ tripPlanId }: { tripPlanId: number }) {
  const [form, setForm] = useState<ExpenseFormData>({
    title: '',
    amount: 0,
    typeId: undefined,
    area: '',
    expenseDate: '',
    tripPlanId,
  });

  const [types, setTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchExpenseTypes().then(setTypes);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'amount'
          ? parseFloat(value)
          : name === 'typeId'
            ? value === ''
              ? undefined
              : parseInt(value, 10)
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const result = await createExpense(form);
      if (result?.success) {
        setSuccess(true);
        setForm({
          title: '',
          amount: 0,
          typeId: undefined,
          area: '',
          expenseDate: '',
          tripPlanId,
        });
      }
    } catch (error) {
      console.error('送出失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow"
    >
      <h3 className="text-lg font-bold">新增支出</h3>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="支出項目"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="金額"
        required
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="typeId"
        value={form.typeId ?? ''}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
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
        placeholder="地區（選填）"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="expenseDate"
        type="date"
        value={form.expenseDate}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:opacity-90 transition"
      >
        {loading ? '送出中...' : '新增支出'}
      </button>

      {success && <p className="text-green-600 text-sm mt-2">✅ 新增成功！</p>}
    </form>
  );
}
