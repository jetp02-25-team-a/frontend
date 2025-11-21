// app/trip/[id]/packing/_components/PackingItem.tsx
'use client';

import { useState } from 'react';
import type { PackingItem as PackingItemType } from '../lib/packing-adapter';

interface Props {
  item: PackingItemType;
  onToggleChecked: (id: number, checked: boolean) => void;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export default function PackingItem({
  item,
  onToggleChecked,
  onRename,
  onDelete,
}: Props) {
  const [editingName, setEditingName] = useState(item.name);

  function handleBlur() {
    if (editingName.trim() && editingName !== item.name) {
      onRename(item.id, editingName.trim());
    } else {
      setEditingName(item.name);
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-b-0">
      <label className="flex items-center gap-3 flex-1 cursor-pointer">
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-2 border-amber-400 text-amber-500 focus:ring-2 focus:ring-amber-200 focus:ring-offset-0 cursor-pointer accent-amber-500 checked:bg-amber-500 checked:border-amber-500"
          checked={item.isChecked}
          onChange={(e) => onToggleChecked(item.id, e.target.checked)}
        />
        <input
          type="text"
          className={`bg-transparent text-sm outline-none border-none flex-1 ${
            item.isChecked
              ? 'text-neutral-400 line-through'
              : 'text-neutral-700'
          }`}
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onBlur={handleBlur}
          onClick={(e) => e.stopPropagation()}
        />
      </label>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="text-red-500 hover:text-red-700 text-lg font-semibold px-2 transition-colors"
        aria-label="刪除"
      >
        ✕
      </button>
    </div>
  );
}
