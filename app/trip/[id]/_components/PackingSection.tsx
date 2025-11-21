'use client';

import { useEffect, useState } from 'react';
import {
  getPackingList,
  createPackingItem,
  updatePackingItem,
  deletePackingItem,
} from '../packing_api';

export default function PackingSection({ tripId }) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    getPackingList(tripId).then(setItems);
  }, [tripId]);

  async function addItem() {
    if (!input) return;
    const newItem = await createPackingItem({
      TripPlanId: tripId,
      name: input,
    });
    setItems([...items, newItem]);
    setInput('');
  }

  async function toggleChecked(item) {
    const updated = await updatePackingItem(item.id, {
      isChecked: !item.isChecked,
    });
    setItems(items.map((i) => (i.id === item.id ? updated : i)));
  }

  async function removeItem(id) {
    await deletePackingItem(id);
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新增項目..."
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-amber-400 text-white rounded-lg"
        >
          新增
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-white shadow rounded-xl p-3"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => toggleChecked(item)}
              />
              <span className={item.isChecked ? 'line-through' : ''}>
                {item.name}
              </span>
            </label>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500"
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
