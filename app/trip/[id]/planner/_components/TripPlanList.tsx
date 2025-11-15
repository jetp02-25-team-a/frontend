'use client';

import { useEffect, useState } from 'react';
import TripPlanItem from './TripPlanItem';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const API = `${BASE}/api/m2`;

export default function TripPlanList({
  tripId,
  day,
  refreshKey,
}: {
  tripId: number;
  day: string;
  refreshKey: number;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const res = await fetch(`${API}/plan/${tripId}/detail?day=${day}`);
      const json = await res.json();

      if (json.success) {
        setItems(json.data || []);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('❌ TripPlanList error:', err);
      setItems([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [day, refreshKey]);

  async function deleteItem(id: number) {
    if (!confirm('確定要刪除？')) return;

    await fetch(`${API}/plan/detail/${id}`, { method: 'DELETE' });
    load();
  }

  async function copyItem(item: any) {
    const payload = {
      tripPlanId: tripId,
      title: item.title,
      address: item.address,
      startDate: item.startDate,
      endDate: item.endDate,
      stayHour: item.stayHour,
      stayMin: item.stayMin,
      type: item.type ?? 'custom',
      url: item.url ?? '',
      order: item.order ?? 9999,
    };

    await fetch(`${API}/plan/${tripId}/detail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    load();
  }

  if (loading) return <div className="text-gray-500">讀取活動中...</div>;

  return (
    <div className="space-y-4 mt-4">
      {items.map((it) => (
        <TripPlanItem
          key={it.id}
          item={it}
          onCopy={copyItem}
          onDelete={deleteItem}
        />
      ))}

      {items.length === 0 && (
        <div className="text-gray-500">今日沒有建立活動</div>
      )}
    </div>
  );
}
