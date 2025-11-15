'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TripCardProps {
  id: number;
  title: string;
  area: string;
  date: string;
  image: string;
}

/**
 * TripCard
 * - 符合 Figma UI（303×259、customize_shadow）
 * - hover 顯示「查看行程」
 * - 點擊導向 /trip/[id]
 */
export default function TripCard({
  id,
  title,
  area,
  date,
  image,
}: TripCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/trip/${id}`)}
      className="relative w-[303px] h-[259px] rounded-2xl customize_shadow bg-white overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02] hover:shadow-lg"
    >
      {/* 圖片區 */}
      <div className="relative w-full h-[60%] overflow-hidden">
        <Image
          src={image || `https://picsum.photos/seed/${id}/600/400`}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-lg">
          查看行程
        </div>
      </div>

      {/* 文字內容 */}
      <div className="flex flex-col justify-between p-4 h-[40%] bg-white">
        <div>
          <h3 className="font-semibold text-base text-gray-800 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{area}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">{date}</p>
      </div>
    </div>
  );
}
