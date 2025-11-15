'use client';

import { useRouter } from 'next/navigation';
import TripCard from './TripCard';
import { Trip } from '../types/trip';

interface TripListPageProps {
  trips: Trip[];
}

/**
 * TripListPage
 * - Figma 規格樣式
 * - 內含「建立新行程」卡片
 * - 使用 next/navigation Router
 * - 接收 Trip 陣列資料
 */
export default function TripListPage({ trips }: TripListPageProps) {
  const router = useRouter();

  return (
    <section className="w-full flex flex-wrap gap-6 justify-center">
      {/* 建立新行程卡片 */}
      <div
        onClick={() => router.push('/trip/new-trip')}
        className="w-[303px] h-[259px] rounded-2xl customize_shadow bg-white overflow-hidden flex flex-col justify-center items-center group cursor-pointer hover:shadow-lg transition"
      >
        <div className="text-5xl text-[#F2A922] mb-3 group-hover:scale-110 transition-transform">
          ＋
        </div>
        <p className="font-semibold text-[#F2A922] group-hover:text-[#d18b00] transition-colors">
          建立新行程
        </p>
      </div>

      {/* 渲染行程卡片 */}
      {trips?.map((trip) => (
        <TripCard
          key={trip.id}
          id={trip.id}
          title={trip.title}
          area={trip.area}
          date={`${trip.startDate?.slice(0, 10)} - ${trip.endDate?.slice(0, 10)}`}
          image={trip.url || `https://picsum.photos/seed/${trip.id}/600/400`}
        />
      ))}
    </section>
  );
}
