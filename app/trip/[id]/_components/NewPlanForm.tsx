'use client';

import { useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
const API = `${BASE}/api/m2`;

export default function NewPlanForm({
  tripId,
  day,
  onClose,
}: {
  tripId: number;
  day: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');

  async function submit() {
    await fetch(`${API}/plan/${tripId}/detail`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        location,
        startTime: `${day}T${start}`,
        endTime: `${day}T${end}`,
      }),
    });

    onClose();
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[300px] space-y-4">
        <h2 className="text-xl font-bold">新增行程</h2>

        <input
          className="border w-full p-2 rounded"
          placeholder="活動名稱"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border w-full p-2 rounded"
          placeholder="地點"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex space-x-2">
          <input
            className="border p-2 rounded w-1/2"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <input
            className="border p-2 rounded w-1/2"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button className="px-3 py-2" onClick={onClose}>
            取消
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={submit}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
