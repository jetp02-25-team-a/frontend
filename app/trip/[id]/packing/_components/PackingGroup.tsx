// app/trip/[id]/packing/_components/PackingGroup.tsx
'use client';

import { useState } from 'react';
import type { PackingItem } from '../lib/packing-adapter';
import PackingItemRow from './PackingItem';

interface Props {
  title: string;
  templateId: number | null;
  items: PackingItem[];
  onToggleChecked: (id: number, checked: boolean) => void;
  onRename: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  onAddItem: (templateId: number | null, name: string) => void;
}

export default function PackingGroup({
  title,
  templateId,
  items,
  onToggleChecked,
  onRename,
  onDelete,
  onAddItem,
}: Props) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const total = items.length;
  const checked = items.filter((i) => i.isChecked).length;

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    onAddItem(templateId, name);
    setNewName('');
    setAdding(false);
  }

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-neutral-200 overflow-hidden">
      <header
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-neutral-100 rounded-t-2xl hover:bg-neutral-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="font-medium text-base text-neutral-800">
          {title} ({checked}/{total})
        </div>
        <span className="text-neutral-400 text-sm">{open ? '▲' : '▼'}</span>
      </header>

      {open && (
        <div className="px-5 pb-4 bg-white rounded-b-2xl">
          <div className="space-y-0">
            {items.map((item) => (
              <PackingItemRow
                key={item.id}
                item={item}
                onToggleChecked={onToggleChecked}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* 新增項目 */}
          {adding ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                placeholder="輸入項目名稱"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button
                type="button"
                className="text-sm px-3 py-1.5 rounded-lg bg-amber-400 text-white hover:bg-amber-500"
                onClick={handleAdd}
              >
                新增
              </button>
              <button
                type="button"
                className="text-xs text-neutral-500 px-2"
                onClick={() => {
                  setAdding(false);
                  setNewName('');
                }}
              >
                取消
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="mt-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              onClick={() => setAdding(true)}
            >
              ＋ 新增項目
            </button>
          )}
        </div>
      )}
    </section>
  );
}
