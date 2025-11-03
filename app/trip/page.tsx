'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TripProfile from './_components/TripProfile';
import TripFilter from './_components/TripFilter';
import TripCard from './_components/TripCard';
import { Trip } from './types/trip';

export default function TripPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showGoTop, setShowGoTop] = useState(false);

  // ✅ 從後端 API 載入行程資料
  const fetchTripsFromAPI = async (): Promise<Trip[]> => {
    try {
      const res = await fetch('/api/trips?userId=1'); // TODO: 改成動態 userId
      const json = await res.json();

      if (json.success) {
        return json.data.map((trip: any) => ({
          id: trip.id,
          title: trip.title,
          area: trip.area,
          date: `${trip.startDate.slice(0, 10)} - ${trip.endDate.slice(0, 10)}`,
          image: trip.url,
          type: trip.type || undefined,
        }));
      }
    } catch (error) {
      console.error('載入行程失敗:', error);
    }
    return [];
  };

  // ✅ 初始載入：localStorage + 後端資料
  useEffect(() => {
    const initTrips = async () => {
      const saved: Trip[] = JSON.parse(
        localStorage.getItem('customTrips') || '[]'
      );
      localStorage.removeItem('customTrips');

      const fetchedTrips = await fetchTripsFromAPI();
      setTrips([...saved, ...fetchedTrips]);
    };

    initTrips();
  }, []);

  // ✅ Infinite Scroll 載入更多資料（目前仍使用模擬）
  const loadMoreTrips = async () => {
    setLoading(true);
    const moreTrips = await fetchTripsFromAPI(); // 可改為分頁 API
    setTrips((prev) => [...prev, ...moreTrips]);
    setHasMore(moreTrips.length > 0);
    setLoading(false);
  };

  // ✅ 監聽滾動事件
  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);

      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        loadMoreTrips();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <TripProfile name="Ellen Lambert" />
      <TripFilter />

      {/* 行程卡區塊 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* 建立新行程卡片 */}
        <div
          onClick={() => router.push('/trip/new-trip')}
          className="flex flex-col justify-center items-center border-2 border-dashed border-yellow-orange rounded-xl hover:bg-[#FFF4E5] cursor-pointer transition p-8 customize_shadow"
        >
          <div className="text-5xl text-[#F2A922] mb-3">＋</div>
          <p className="font-semibold text-[#F2A922]">建立新行程</p>
        </div>

        {/* 現有行程卡片 */}
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            title={trip.title}
            area={trip.area}
            date={trip.date}
            image={trip.image}
          />
        ))}
      </section>

      {/* 載入中提示 */}
      {loading && (
        <div className="text-yellow-500 font-semibold mt-6 animate-pulse">
          正在載入更多行程...
        </div>
      )}

      {/* 回到頂部按鈕 */}
      {showGoTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition"
        >
          TOP
        </button>
      )}
    </div>
  );
}
