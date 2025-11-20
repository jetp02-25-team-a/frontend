// app/trip/_components/TripCard.tsx
'use client';

import type { TripSummary } from './types';

interface Props {
  trip: TripSummary;
  onClick?: () => void;
}

export default function TripCard({ trip, onClick }: Props) {
  const coverImage = trip.destinationImageUrl || trip.coverUrl || '/trip_sample.jpg';

  // 格式化日期：2025/11/25
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer text-left border border-neutral-100 group"
    >
      {/* 封面圖片 - 16:9 比例 */}
      <div className="w-full aspect-[16/9] relative overflow-hidden bg-neutral-100">
        <img
          src={coverImage}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={trip.title}
          onError={(e) => {
            e.currentTarget.src = '/trip_sample.jpg';
          }}
        />
      </div>

      {/* 內容區域 */}
      <div className="p-6 space-y-3">
        {/* 標題 */}
        <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2 group-hover:text-[#F6C453] transition-colors">
          {trip.title}
        </h3>

        {/* 位置 */}
        <div className="flex items-center gap-2">
          {trip.destinationImageUrl && (
            <img
              src={trip.destinationImageUrl}
              alt={trip.destinationName || '目的地'}
              className="w-6 h-6 object-cover rounded-full border border-neutral-200 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span className="text-sm text-neutral-600 font-medium">
            {trip.destinationName ?? '未設定目的地'}
          </span>
        </div>

        {/* 日期 */}
        <div className="text-sm text-neutral-500 font-medium">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </div>
      </div>
    </button>
  );
}
