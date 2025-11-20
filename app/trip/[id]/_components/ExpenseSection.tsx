'use client';

import { useState, useEffect } from 'react';
import {
  getExpenseList,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../expense_api';

export default function ExpenseSection({ tripId }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getExpenseList(tripId).then(setList);
  }, [tripId]);

  async function addExpense() {
    if (!name || !amount) return;

    const newItem = await createExpense({
      tripId,
      name,
      amount: Number(amount),
    });

    setList([...list, newItem]);
    setName('');
    setAmount('');
  }

  return (
    <div className="space-y-4">
      {/* 新增表單 */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="項目"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="金額"
          className="w-24 border rounded-lg px-3 py-2"
        />
        <button
          onClick={addExpense}
          className="px-4 py-2 bg-amber-400 text-white rounded-lg"
        >
          新增
        </button>
      </div>

      {/* 列表 */}
      <ul className="space-y-2">
        {list.map((e) => (
          <li
            key={e.id}
            className="flex justify-between items-center bg-white p-3 rounded-xl shadow"
          >
            <span>{e.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-amber-600">${e.amount}</span>
              <button
                onClick={() =>
                  deleteExpense(e.id).then(() =>
                    setList(list.filter((x) => x.id !== e.id))
                  )
                }
                className="text-red-500"
              >
                刪除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
