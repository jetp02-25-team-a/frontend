'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/config/api-path';
import Toast from '@/app/place/_components/Toast';

export default function PackingPanel({ tripId }: { tripId: number }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [toast, setToast] = useState(null);

  async function loadPacking() {
    const r = await fetch(`${API_URL}/api/m2/packing/${tripId}`);
    const j = await r.json();
    setItems(j);
  }

  async function addItem() {
    if (!newItem.trim()) return;
    const r = await fetch(`${API_URL}/api/m2/packing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        TripPlanId: tripId,
        name: newItem,
        isChecked: false,
      }),
    });

    await loadPacking();
    setNewItem('');
    setToast({ message: '已新增行李', type: 'success' });
  }

  async function toggleCheck(id, isChecked) {
    await fetch(`${API_URL}/api/m2/packing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isChecked }),
    });

    await loadPacking();
  }

  async function deleteItem(id) {
    await fetch(`${API_URL}/api/m2/packing/${id}`, { method: 'DELETE' });
    await loadPacking();
    setToast({ message: '已刪除', type: 'success' });
  }

  useEffect(() => {
    loadPacking();
  }, []);

  return (
    <section className="rounded-3xl bg-white p-6 shadow space-y-4">
      <h2 className="text-lg font-semibold">行李清單</h2>

      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="新增行李項目"
          className="flex-1 border rounded-full px-4 py-2"
        />
        <button
          onClick={addItem}
          className="bg-amber-400 text-white px-4 py-2 rounded-full"
        >
          新增
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-3 rounded-xl"
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={(e) => toggleCheck(item.id, e.target.checked)}
              />
              <span
                className={
                  item.isChecked ? 'line-through text-neutral-400' : ''
                }
              >
                {item.name}
              </span>
            </label>

            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 text-sm"
            >
              刪除
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
