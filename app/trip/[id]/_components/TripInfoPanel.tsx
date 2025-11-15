'use client';

import { useEffect, useState } from 'react';

export default function TripInfoPanel({ tripId }: { tripId: number }) {
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    loadTrip();
  }, []);

  async function loadTrip() {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:300';
    const API = `${BASE}/api/m2`;

    const res = await fetch(`${API}/trip/${tripId}`, {
      credentials: 'include',
    });
    const json = await res.json();

    if (json.success) setTrip(json.data);
  }

  if (!trip) return <div className="p-4 text-gray-500">載入中...</div>;

  return (
    <div className="space-y-4">
      {/* 🔶 使用者資訊卡片 */}
      <div className="p-4 bg-white rounded-2xl shadow-md flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/120?img=5"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="text-xl font-semibold leading-tight">
          {trip.userName || 'Ellen Lambert'}
        </div>
      </div>

      {/* 🔸 分隔線 */}
      <div className="w-full flex justify-center">
        <div className="w-24 h-1 bg-pink-300 rounded-full" />
      </div>

      {/* 🔶 行李清單 */}
      <div className="p-4 bg-white rounded-2xl shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50">
        <div className="flex items-center gap-3 text-cg">
          <span className="text-3xl">🧳</span>
          行李清單
        </div>
        <div className="text-gray-600">
          {trip.PackingItem?.length ?? 0}
          <span className="text-sm text-gray-400">/24</span>
        </div>
      </div>

      {/* 🔸 分隔線 */}
      <div className="w-full flex justify-center">
        <div className="w-24 h-1 bg-pink-300 rounded-full" />
      </div>

      {/* 🔶 下載 PDF */}
      <div
        className="p-4 bg-white rounded-2xl shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => alert('下載 PDF')}
      >
        <div className="flex items-center gap-3 text-cg">
          <span className="text-3xl">📄</span>
          下載 PDF
        </div>
      </div>

      {/* 🔸 分隔線 */}
      <div className="w-full flex justify-center">
        <div className="w-24 h-1 bg-pink-300 rounded-full" />
      </div>

      {/* 🔶 記帳 */}
      <div className="p-4 bg-white rounded-2xl shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50">
        <div className="flex items-center gap-3 text-cg">
          <span className="text-3xl">💲</span>
          記帳
        </div>
        <div className="text-gray-600">{trip.Expense?.length ?? 0}</div>
      </div>
    </div>
  );
}
