'use client';

import Image from 'next/image';

interface TripItemCardProps {
  title: string;
  address: string;
  image: string;
  startTime: string; // 09:00
  endTime: string; // 10:15
  durationText: string; // 例如：待 1 小時 30 分
}

export default function TripItemCard({
  title,
  address,
  image,
  startTime,
  endTime,
  durationText,
}: TripItemCardProps) {
  // 地址太長就截斷一下
  const shortAddress =
    address.length > 20 ? address.slice(0, 20) + '...' : address;

  return (
    <div className="flex items-center w-full">
      {/* 左側：時間 + 點 */}
      <div className="flex flex-col w-[100px] px-3 gap-1 items-center text-xs text-gray-400">
        <p>{formatTimeLabel(startTime)}</p>
        <div className="w-3 h-3 rounded-full bg-red-600 border-4 border-red-100" />
        <p>{formatTimeLabel(endTime)}</p>
      </div>

      {/* 右側：卡片主體 */}
      <div className="bg-white flex-1 h-[97px] flex gap-2.5 p-2.5 rounded-lg shadow-sm hover:shadow-md transition">
        <div className="relative w-[77px] h-[77px] rounded-md overflow-hidden flex-shrink-0">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>

        <div className="flex-1 flex flex-col justify-between text-sm">
          <p className="text-red-500 text-xs">{durationText}</p>
          <h2 className="font-semibold text-gray-800 truncate">{title}</h2>
          <p className="text-gray-500 text-xs">{shortAddress}</p>
        </div>

        {/* 右側：小功能 icon（簡化版，用文字符號代替 FontAwesome） */}
        <div className="flex flex-col justify-between items-center text-gray-400 text-lg px-1">
          <button className="hover:text-gray-600">⋯</button>
          <button className="hover:text-red-500">🗑</button>
        </div>
      </div>
    </div>
  );
}

function formatTimeLabel(time: string) {
  // 直接顯示「上午 09:00 / 下午 03:00」的簡單版本
  const [hh, mm] = time.split(':');
  const h = parseInt(hh || '0', 10);
  const period = h < 12 ? '上午' : '下午';
  return `${period} ${hh}:${mm}`;
}
