// app/trip/[id]/expense/_components/ExpenseGroup.tsx
'use client';

import { useState } from 'react';
import type { ExpenseItem } from '../lib/expense-adapter';
import ExpenseItemRow from './ExpenseItem';

interface Props {
  title: string;
  items: ExpenseItem[];
  onAdd: (title: string, amount: number) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseGroup({ title, items, onAdd, onDelete }: Props) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);

  function handleAdd() {
    const t = newTitle.trim();
    const a = Number(newAmount);
    if (!t || !a || a <= 0) return;
    onAdd(t, a);
    setNewTitle('');
    setNewAmount('');
    setAdding(false);
  }

  return (
    <section className="border-b border-neutral-200 py-4">
      <header
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="text-sm font-medium text-neutral-800">{title}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-700">小計 NT$ {subtotal}</span>
          <span className="text-xs text-neutral-400">{open ? '▲' : '▼'}</span>
        </div>
      </header>

      {open && (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <ExpenseItemRow key={item.id} item={item} onDelete={onDelete} />
          ))}

          {adding ? (
            <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-2 items-center">
              <input
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                placeholder="項目名稱"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 w-28"
                placeholder="金額"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-amber-400 text-white px-3 py-1.5 text-xs hover:bg-amber-500"
                  onClick={handleAdd}
                >
                  新增
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 text-neutral-500 px-3 py-1.5 text-xs hover:bg-neutral-50"
                  onClick={() => {
                    setAdding(false);
                    setNewAmount('');
                    setNewTitle('');
                  }}
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="mt-2 text-xs text-amber-600 hover:text-amber-700"
              onClick={() => setAdding(true)}
            >
              ＋ 新增
            </button>
          )}
        </div>
      )}
    </section>
  );
}
