'use client';

import { useState, useEffect } from 'react';
import { addPlaceToTrip } from '../lib/addPlaceToTrip';

interface TripSummary {
  id: number;
  title: string;
  startDate: string;
  // 有需要可以再加其他欄位
}

interface AddToTripModalProps {
  spotId: number;
  onClose: () => void;
}

export default function AddToTripModal({
  spotId,
  onClose,
}: AddToTripModalProps) {
  const [trips, setTrips] = useState<TripSummary[]>([]);

  // 讀取使用者行程（暫時寫死 userId=1，之後可接登入）
  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch('/api/m2/trip/user/1');
        if (!res.ok) throw new Error('取得行程失敗');
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTrips();
  }, []);

  async function handleSelectTrip(tripId: number) {
    try {
      await addPlaceToTrip(tripId, spotId);
      alert('已加入行程！');
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      alert('加入行程失敗：' + msg);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">加入到哪個行程？</h2>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {trips.length === 0 && (
            <p className="text-sm text-neutral-500">
              目前沒有任何行程，可以先建立一個行程喔！
            </p>
          )}

          {trips.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTrip(t.id)}
              className="w-full text-left border p-3 rounded-lg hover:bg-neutral-100 text-sm"
            >
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-neutral-500 mt-1">
                {t.startDate?.substring(0, 10)}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full border border-neutral-300 p-2 rounded-lg text-sm hover:bg-neutral-50"
        >
          取消
        </button>
      </div>
    </div>
  );
}
