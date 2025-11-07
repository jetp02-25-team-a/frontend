// RoomTypeCard.tsx (純 Server Component)
import React from 'react';
// 假設 RoomTypeData 類型已從 data.ts 引入
import { RoomTypeData } from '../../_lib/data'; // 請根據您的路徑調整

export default function RoomTypeCard({ roomType }: { roomType: RoomTypeData }) {
  return (
    <div className="border border-solid border-gray-300 rounded-[5px] p-4 w-[220px] flex-shrink-0">
      {/* 房型名稱 */}
      <div className="font-bold text-lg mb-1">{roomType.name}</div>

      {/* 入住資訊 */}
      <div className="text-sm text-gray-600 mb-1">{roomType.description}</div>
      <div className="text-sm text-gray-600 mb-3">
        {roomType.maxCapacity} 人
      </div>

      {/* 🚨 房型專屬設施 (靜態顯示) */}
      <div className="text-xs font-medium text-gray-500 mt-4 mb-2">
        房型設施:
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {roomType.amenities.map((amenity, index) => (
          <span
            key={index}
            className="text-xs text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded"
          >
            {amenity}
          </span>
        ))}
      </div>

      {/* 這裡可以顯示價格，但預訂邏輯在 Booking Form */}
      <div className="mt-4 text-xl font-bold text-black">
        ${roomType.basePrice.toLocaleString()}
      </div>
    </div>
  );
}
