'use client';

import TripItemCard from './TripItemCard';

interface TripDayProps {
  dayNumber: number;
  date: string;
  places: {
    name: string;
    address: string;
    image?: string;
    time: string;
  }[];
}

export default function TripDay({ dayNumber, date, places }: TripDayProps) {
  return (
    <section className="mb-8">
      <h3 className="text-xl font-bold mb-3">
        第 {dayNumber} 天 ｜ {date}
      </h3>

      <div className="flex flex-col gap-4">
        {places.length > 0 ? (
          places.map((place, idx) => <TripItemCard key={idx} {...place} />)
        ) : (
          <p className="text-sm text-gray-400">目前尚無行程項目</p>
        )}
      </div>
    </section>
  );
}
