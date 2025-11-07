'use client';

import { useState } from 'react';
import { TripPlanDetail } from '../types/tripPlannerData';
import EditAttractionModal from './EditAttractionModal';

interface Props {
  detail: TripPlanDetail;
  dispatch: (action: {
    type: 'UPDATE_DETAIL';
    payload: TripPlanDetail;
  }) => void;
}

export default function AttractionCard({ detail, dispatch }: Props) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div
      className="relative border rounded-lg p-3 shadow-sm bg-gray-50 hover:shadow-md transition cursor-pointer"
      onClick={() => setShowEdit(true)}
    >
      <img
        src={detail.url}
        alt={detail.title}
        className="h-32 w-full object-cover rounded"
      />
      <h4 className="text-md font-bold mt-2">{detail.title}</h4>
      <p className="text-sm text-gray-600">{detail.address}</p>
      <p className="text-sm text-gray-500">停留時間：{detail.stayTime}</p>
      <p className="text-sm text-gray-500">
        時間：{formatTime(detail.startDate)} ~ {formatTime(detail.endDate)}
      </p>

      {/* ⋯ 編輯按鈕 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowEdit(true);
        }}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ⋯
      </button>

      {/* 編輯彈窗 */}
      {showEdit && (
        <EditAttractionModal
          detail={detail}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => {
            dispatch({ type: 'UPDATE_DETAIL', payload: updated });
          }}
        />
      )}
    </div>
  );
}

// ✅ 補上時間格式化函式
function formatTime(datetime: string) {
  return new Date(datetime).toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
