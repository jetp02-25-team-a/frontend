// app/trip/[id]/expense/_components/ExpenseItem.tsx
'use client';

import type { ExpenseItem } from '../lib/expense-adapter';

interface Props {
  item: ExpenseItem;
  onDelete: (id: number) => void;
}

export default function ExpenseItemRow({ item, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="text-sm text-neutral-700">{item.title}</div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-neutral-800">NT$ {item.amount}</div>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-xs text-neutral-400 hover:text-red-500 px-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
