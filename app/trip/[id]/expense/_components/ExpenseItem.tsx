// app/trip/[id]/expense/_components/ExpenseItem.tsx
'use client';

import type { ExpenseItem } from '../lib/expense-adapter';

interface Props {
  item: ExpenseItem;
  onDelete: (id: number) => void;
}

export default function ExpenseItemRow({ item, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
      <div className="text-sm text-neutral-700">{item.title}</div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-neutral-800 font-medium">NT$ {item.amount}</div>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-red-500 hover:text-red-700 text-lg font-semibold px-2 transition-colors"
          aria-label="刪除"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
