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
    <div className="flex items-center justify-between py-1.5">
      <label className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-amber-300 text-amber-500"
          checked={item.isChecked}
          onChange={(e) => onToggleChecked(item.id, e.target.checked)}
        />
        <input
          className={`bg-transparent text-sm outline-none border-b border-transparent focus:border-amber-300 flex-1 ${
            item.isChecked
              ? 'text-neutral-400 line-through'
              : 'text-neutral-700'
          }`}
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          onBlur={handleBlur}
        />
      </label>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="text-xs text-neutral-400 hover:text-red-500 px-2"
      >
        ✕
      </button>
    </div>
  );
}
