'use client';

import { useEffect, useState } from 'react';
import { fetchExpenses } from './expense';
import ExpenseForm from './ExpenseForm';
import ExpenseCard from './ExpenseCard';
import type { Expense } from './types';

export default function ExpensePage() {
  const tripPlanId = 3; // 可改為動態取得
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadExpenses = async () => {
    const data = await fetchExpenses(tripPlanId);
    setExpenses(data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ExpenseForm tripPlanId={tripPlanId} />
      <hr />
      <h3 className="text-lg font-bold">支出列表</h3>
      <div className="space-y-3">
        {expenses.map((e) => (
          <ExpenseCard key={e.id} expense={e} onRefresh={loadExpenses} />
        ))}
      </div>
    </div>
  );
}
