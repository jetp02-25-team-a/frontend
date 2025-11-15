'use client';

import { useState } from 'react';
import { TripPlanDetailAPI } from '../../../utils/api';
import StayTimeModal from './StayTimeModal';

interface TripPlanEditModalProps {
  tripId: number;
  item?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function TripPlanEditModal({
  tripId,
  item,
  onClose,
  onSaved,
}: TripPlanEditModalProps) {
  const isEdit = !!item?.id;

  const [title, setTitle] = useState(item?.title || '');
  const [address, setAddress] = useState(item?.address || '');
  const [stayHour, setStayHour] = useState(item?.stayHour ?? 0);
  const [stayMin, setStayMin] = useState(item?.stayMin ?? 0);
  const [type, setType] = useState(item?.type || 'custom');

  const [startDate, setStartDate] = useState(
    item?.startDate ? item.startDate.split('T')[0] : ''
  );

  const [endDate, setEndDate] = useState(
    item?.endDate ? item.endDate.split('T')[0] : ''
  );

  const [url, setUrl] = useState(item?.url || '');

  const [showStayModal, setShowStayModal] = useState(false);

  const handleSave = async () => {
    const payload = {
      title,
      address,
      stayHour,
      stayMin,
      type,
      startDate,
      endDate,
      url,
    };

    try {
      if (isEdit) {
        await TripPlanDetailAPI.update(item.id, payload);
      } else {
        await TripPlanDetailAPI.create(tripId, payload);
      }

      onSaved(); // reload list
      onClose(); // close modal
    } catch (err) {
      console.error('❌ 儲存失敗:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isEdit ? '編輯活動' : '新增活動'}
        </h2>

        {/* 標題 */}
        <div className="mb-4">
          <label className="text-sm font-medium">標題</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
            placeholder="輸入活動名稱"
          />
        </div>

        {/* 地址 */}
        <div className="mb-4">
          <label className="text-sm font-medium">地點</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
            placeholder="輸入地點"
          />
        </div>

        {/* 停留時間 */}
        <div className="mb-4">
          <label className="text-sm font-medium">停留時間</label>
          <div className="flex items-center gap-3 mt-1">
            <div className="text-gray-700">
              {stayHour} 小時 {stayMin} 分
            </div>
            <button
              onClick={() => setShowStayModal(true)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
            >
              設定
            </button>
          </div>
        </div>

        {/* 類型 */}
        <div className="mb-4">
          <label className="text-sm font-medium">類型</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
          >
            <option value="spot">景點</option>
            <option value="food">美食</option>
            <option value="hotel">住宿</option>
            <option value="custom">自訂</option>
          </select>
        </div>

        {/* 日期 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm font-medium">開始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">結束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mt-1"
            />
          </div>
        </div>

        {/* 圖片 */}
        <div className="mb-4">
          <label className="text-sm font-medium">圖片網址</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mt-1"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 按鈕 */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            取消
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
          >
            儲存
          </button>
        </div>
      </div>

      {/* 停留時間選擇 Modal */}
      {showStayModal && (
        <StayTimeModal
          item={{ stayHour, stayMin }}
          onClose={() => setShowStayModal(false)}
          onSave={({ stayHour, stayMin }) => {
            setStayHour(stayHour);
            setStayMin(stayMin);
          }}
        />
      )}
    </div>
  );
}
