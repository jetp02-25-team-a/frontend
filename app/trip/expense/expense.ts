import { ExpenseFormData } from './types';

export const fetchExpenses = async (tripPlanId: number) => {
  const res = await fetch(`/api/expenses?tripPlanId=${tripPlanId}`);
  const json = await res.json();
  return json.success ? json.data : [];
};

export const createExpense = async (data: ExpenseFormData) => {
  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};
