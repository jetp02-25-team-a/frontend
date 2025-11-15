'use client';
import { useState } from 'react';

type Category = '重要證件' | '衣物類' | '3C物品' | '日常盥洗用品' | '其他物品';

interface PackingItem {
  id: number;
  name: string;
  packed: boolean;
}

export default function PackingPanel({ tripId }: { tripId: number }) {
  const [open, setOpen] = useState<Record<Category, boolean>>({
    重要證件: true,
    衣物類: true,
    '3C物品': true,
    日常盥洗用品: true,
    其他物品: true,
  });

  const [items, setItems] = useState<Record<Category, PackingItem[]>>({
    重要證件: [
      { id: 1, name: '個人證件', packed: false },
      { id: 2, name: '信用卡', packed: false },
      { id: 3, name: '護照', packed: false },
    ],
    衣物類: [
      { id: 4, name: '上衣', packed: false },
      { id: 5, name: '內衣褲', packed: false },
      { id: 6, name: '外套', packed: false },
    ],
    '3C物品': [
      { id: 7, name: '手機', packed: true },
      { id: 8, name: '充電器', packed: false },
    ],
    日常盥洗用品: [
      { id: 9, name: '牙刷牙膏', packed: false },
      { id: 10, name: '洗面乳', packed: false },
    ],
    其他物品: [
      { id: 11, name: '水瓶', packed: false },
      { id: 12, name: '塑膠袋', packed: false },
    ],
  });

  const togglePacked = (cat: Category, id: number) => {
    setItems((prev) => ({
      ...prev,
      [cat]: prev[cat].map((i) =>
        i.id === id ? { ...i, packed: !i.packed } : i
      ),
    }));
  };

  const handleAdd = (cat: Category) => {
    const name = prompt(`新增「${cat}」項目名稱：`);
    if (!name) return;
    setItems((prev) => ({
      ...prev,
      [cat]: [...prev[cat], { id: Date.now(), name, packed: false }],
    }));
  };

  const handleDelete = (cat: Category, id: number) => {
    setItems((prev) => ({
      ...prev,
      [cat]: prev[cat].filter((i) => i.id !== id),
    }));
  };

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6 text-gray-800">
      <h2 className=" text-gray-800 font-semibold mb-5">行李清單</h2>

      {Object.entries(items).map(([cat, list]) => {
        const category = cat as Category;
        const packedCount = list.filter((d) => d.packed).length;

        return (
          <div
            key={cat}
            className="mb-5 border border-gray-200 rounded-lg p-4 shadow-xs"
          >
            <div
              className="flex justify-between items-center mb-3 cursor-pointer"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [category]: !prev[category] }))
              }
            >
              <h3 className="font-medium text-gray-800">
                {category} ({packedCount}/{list.length})
              </h3>
              <span className="text-gray-500 text-sm">
                {open[category] ? '▾' : '▸'}
              </span>
            </div>

            {open[category] && (
              <ul className="space-y-2 text-sm">
                {list.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center border-b border-gray-100 pb-1"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={() => togglePacked(category, item.id)}
                        className="accent-yellow-500"
                      />
                      <span
                        className={
                          item.packed
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }
                      >
                        {item.name}
                      </span>
                    </label>
                    <button
                      onClick={() => handleDelete(category, item.id)}
                      className="text-red-400 hover:text-red-600 text-xs transition"
                    >
                      ✕
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handleAdd(category)}
                    className="text-yellow-600 hover:text-yellow-700 text-xs mt-2 font-medium"
                  >
                    + 新增項目
                  </button>
                </li>
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
