'use client';

import TripCard from './TripCard';
import { useRouter } from 'next/navigation';
import { Trip } from '../types/trip';

interface TripListPageProps {
  trips: Trip[];
}

export default function TripListPage({ trips }: TripListPageProps) {
  const router = useRouter();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* 建立新行程卡片 */}
      <div
        onClick={() => router.push('/trip/new-trip')}
        className="w-[303px] h-[259px] rounded-2xl customize_shadow bg-white overflow-hidden flex flex-col justify-center items-center group cursor-pointer hover:shadow-lg transition"
      >
        <div className="text-5xl text-[#F2A922] mb-3">＋</div>
        <p className="font-semibold text-[#F2A922]">建立新行程</p>
      </div>

      {/* 渲染行程卡片 */}
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          id={trip.id}
          title={trip.title}
          area={trip.area}
          date={trip.date!}
          image={trip.image!}
        />
      ))}
    </section>
  );
}
