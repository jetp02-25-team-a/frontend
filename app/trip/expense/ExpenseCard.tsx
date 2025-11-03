import type { Expense } from './types';

export default function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold text-lg">{expense.title}</h3>
      <p className="text-sm text-gray-600">金額：${expense.amount}</p>
      <p className="text-sm text-gray-500">分類：{expense.type || '未分類'}</p>
      <p className="text-sm text-gray-400">地區：{expense.area || '未填寫'}</p>
    </div>
  );
}
