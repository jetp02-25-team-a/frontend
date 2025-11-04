import type { Expense, ExpenseFormData } from './types';

export const fetchExpenses = async (tripPlanId: number): Promise<Expense[]> => {
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

export const updateExpense = async (
  id: number,
  data: Partial<ExpenseFormData>
) => {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const deleteExpense = async (id: number) => {
  const res = await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
