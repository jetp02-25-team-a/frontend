'use client';

import { RoomTypeDTO } from '../../_types';

export default function RoomCard({ room }: { room: RoomTypeDTO }) {
  return (
    <div className="w-full h-full border rounded-lg shadow bg-white p-6 flex flex-col gap-10">
      {/* 房型名稱 */}
      <h3 className="text-xl font-bold">{room.name}</h3>

      {/* 價格 + 人數 */}
      <div className="flex justify-between text-gray-700">
        <span>價格</span>
        <span>NT$ {room.basePrice}</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>人數</span>
        <span>最多 {room.maxCapacity} 人</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>床型</span>
        <span>{room.bedType}</span>
      </div>
      <hr className="w-full text-cgray" />

      <div className="flex flex-wrap gap-4">
        {room.amenities.map((a) => (
          <span
            key={a.id}
            className="px-5 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700"
          >
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}
