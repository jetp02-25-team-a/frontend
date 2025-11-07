'use client';

import { useState } from 'react';
import { TripPlanDetail } from '../types/tripPlannerData';

interface Props {
  detail: TripPlanDetail;
  onClose: () => void;
  onSave: (updated: TripPlanDetail) => void;
}

export default function EditAttractionModal({
  detail,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState(detail.title);
  const [address, setAddress] = useState(detail.address);
  const [stayTime, setStayTime] = useState(detail.stayTime);

  const handleSave = () => {
    const updated: TripPlanDetail = {
      ...detail,
      title,
      address,
      stayTime,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-bold mb-4">編輯景點資訊</h3>

        <label className="block mb-2 text-sm font-medium">景點名稱</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">地址</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 text-sm font-medium">停留時間</label>
        <input
          type="text"
          value={stayTime}
          onChange={(e) => setStayTime(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-6"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}
