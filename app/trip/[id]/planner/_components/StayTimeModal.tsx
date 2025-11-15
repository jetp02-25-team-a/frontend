'use client';

import { useState } from 'react';

interface StayTimeModalProps {
  item?: any;
  onClose: () => void;
  onSave: (payload: { stayHour: number; stayMin: number }) => void;
}

export default function StayTimeModal({
  item,
  onClose,
  onSave,
}: StayTimeModalProps) {
  const [hour, setHour] = useState(item?.stayHour ?? 0);
  const [min, setMin] = useState(item?.stayMin ?? 0);

  const hourOptions = Array.from({ length: 13 }, (_, i) => i); // 0–12 小時
  const minOptions = [0, 10, 20, 30, 40, 50];

  const handleSubmit = () => {
    onSave({
      stayHour: hour,
      stayMin: min,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-center mb-4">停留時間</h2>

        <div className="flex gap-4 justify-center items-center mb-6">
          {/* 小時 */}
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {h} 小時
              </option>
            ))}
          </select>

          {/* 分鐘 */}
          <select
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            {minOptions.map((m) => (
              <option key={m} value={m}>
                {m} 分
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
          >
            取消
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
