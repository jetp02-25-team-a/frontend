import type { Expense, ExpenseFormData, ExpenseType } from './types';

let mockExpenses: Expense[] = [
  {
    id: 1,
    title: '蜜餞',
    amount: 300,
    type: '美食',
    area: '安平老街',
    expenseDate: '2025-11-10',
    isChecked: false,
  },
  {
    id: 2,
    title: '牛肉湯',
    amount: 500,
    type: '美食',
    area: '台南',
    expenseDate: '2025-11-09',
    isChecked: false,
  },
];

export const fetchExpenseTypes = async (): Promise<ExpenseType[]> => [
  { id: 1, name: '美食' },
  { id: 2, name: '住宿' },
  { id: 3, name: '交通' },
  { id: 4, name: '門票' },
  { id: 5, name: '購物' },
];

export const fetchExpenses = async (tripPlanId: number): Promise<Expense[]> =>
  new Promise((resolve) => setTimeout(() => resolve(mockExpenses), 300));

export const createExpense = async (data: ExpenseFormData) => {
  const newItem: Expense = {
    id: Date.now(),
    title: data.title,
    amount: data.amount,
    type: ['美食', '住宿', '交通', '門票', '購物'][data.typeId! - 1],
    area: data.area,
    expenseDate: data.expenseDate || new Date().toISOString().split('T')[0],
    isChecked: false,
  };
  mockExpenses.push(newItem);
  return { success: true, data: newItem };
};

export const deleteExpense = async (id: number) => {
  mockExpenses = mockExpenses.filter((e) => e.id !== id);
  return { success: true };
};
