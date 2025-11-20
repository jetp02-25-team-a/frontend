'use client';

import { useRouter } from 'next/navigation';
import TripCreateCard from './TripCreateCard';
import TripCard from './TripCard';

export default function TripList({ list = [], selected, onSelect }) {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push('/trip/create');
  };

  const handleTripClick = (tripId: number) => {
    if (onSelect) {
      onSelect(tripId);
    }
    router.push(`/trip/${tripId}`);
  };

  // 轉換資料格式以符合 TripCard 的需求
  const tripsForCard = list.map((t) => ({
    id: t.id,
    title: t.title || '未命名行程',
    destinationName: t.Destination?.name || t.destination || '未設定目的地',
    destinationImageUrl: t.Destination?.imageUrl || null,  // 從後端獲取城市圖片
    startDate: t.startDate,
    endDate: t.endDate,
    coverUrl: t.coverUrl || '/trip_sample.jpg',
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
      <div onClick={handleCreateClick}>
        <TripCreateCard />
      </div>

      {tripsForCard.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onClick={() => handleTripClick(trip.id)}
        />
      ))}
    </div>
  );
}