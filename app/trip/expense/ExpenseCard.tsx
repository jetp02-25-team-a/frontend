'use client';

import { useState } from 'react';
import type { Expense } from './types';
import { deleteExpense } from './expense';

export default function ExpenseCard({
  expense,
  onRefresh,
}: {
  expense: Expense;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteExpense(expense.id);
    if (result.success) {
      onRefresh();
    }
    setLoading(false);
  };

  return (
    <div className="border p-3 rounded shadow-sm space-y-1">
      <div className="font-bold">{expense.title}</div>
      <div>金額：${expense.amount}</div>
      <div>分類：{expense.type ?? '未分類'}</div>
      <div>地區：{expense.area ?? '—'}</div>
      <div>日期：{expense.expenseDate}</div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 text-sm mt-2 hover:underline"
      >
        {loading ? '刪除中...' : '刪除'}
      </button>
    </div>
  );
}
