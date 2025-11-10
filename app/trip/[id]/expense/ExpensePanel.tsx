'use client';
import { useState, useEffect } from 'react';
import { fetchExpenses, deleteExpense } from './expense';
import ExpenseModal from './ExpenseModal';
import type { Expense } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function ExpensePanel({ tripPlanId }: { tripPlanId: number }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadExpenses = async () => {
    const data = await fetchExpenses(tripPlanId);
    setExpenses(data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const categories = ['美食', '住宿', '交通', '門票', '購物'];
  const grouped = expenses.reduce(
    (acc, e) => {
      const key = e.type || '其他';
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    },
    {} as Record<string, Expense[]>
  );

  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* 🧾 全部支出合計 */}
      <div className="bg-[#fff8e1] border border-[#f5c364] rounded-xl p-5 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">總支出</h2>
        <p className="text-3xl font-bold text-[#f3b640]">
          NT$ {grandTotal.toLocaleString()} 元
        </p>
      </div>

      {/* 各分類卡片 */}
      {categories.map((category) => {
        const records = grouped[category] || [];
        const total = records.reduce((sum, e) => sum + e.amount, 0);

        return (
          <div
            key={category}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-lg font-bold text-gray-700">{category}</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">合計</p>
                <p className="font-bold text-gray-800">NT${total} 元</p>
              </div>
            </div>

            {records.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-3">
                尚無支出資料
              </p>
            ) : (
              records.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center text-sm border-b pb-1"
                >
                  <div>
                    <span>日期：{expense.expenseDate}　</span>
                    <span>地點：{expense.area || '—'}　</span>
                    <span>名稱：{expense.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      金額：{expense.amount}元
                    </span>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={async () => {
                        await deleteExpense(expense.id);
                        loadExpenses();
                      }}
                    />
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-center mt-5">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#F5C364] hover:bg-[#f3b640] text-white font-semibold px-10 py-2 rounded-full transition"
              >
                新 增
              </button>
            </div>

            <ExpenseModal
              visible={modalOpen}
              onClose={() => setModalOpen(false)}
              tripPlanId={tripPlanId}
              onRefresh={loadExpenses}
            />
          </div>
        );
      })}
    </div>
  );
}
