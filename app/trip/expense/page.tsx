'use client';
import { useEffect, useState } from 'react';
import { fetchExpenses } from './expense';
import type { Expense } from './types';
import ExpenseCard from './ExpenseCard';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses(1).then(setExpenses); // TODO: 動態 tripPlanId
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">記帳清單</h2>
      <div className="grid gap-4">
        {expenses.map((e) => (
          <ExpenseCard key={e.id} expense={e} />
        ))}
      </div>
    </div>
  );
}
