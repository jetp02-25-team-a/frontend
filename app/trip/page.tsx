'use client';

import { useEffect, useState } from 'react';
import TripProfile from './_components/TripProfile';
import TripFilter from './_components/TripFilter';
import TripListPage from './_components/TripListPage';
import { Trip } from './types/trip';

import { TripAPI } from './utils/api'; // ← 正確路徑！不用再 import 舊的 API

export default function TripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showGoTop, setShowGoTop] = useState(false);
  const [user, setUser] = useState<{
    nickname: string;
    avatar?: string;
  } | null>(null);

  // 假裝使用者
  useEffect(() => {
    setUser({ nickname: 'Ellen Lambert', avatar: '/avatar.png' });
  }, []);

  /* ===============================
     🧭 從後端載入行程 (使用 TripAPI)
  ================================ */
  const fetchTrips = async (filters?: {
    area?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Trip[]> => {
    try {
      const res = await TripAPI.getAll(); // GET /api/m2/trip
      if (!res.success) return [];

      return res.data.map((t: any) => ({
        id: t.id,
        title: t.title,
        area: t.area,
        startDate: t.startDate,
        endDate: t.endDate,
        url: t.url,
        date: `${t.startDate.slice(0, 10)} ~ ${t.endDate.slice(0, 10)}`,
        image: t.url || '/default-trip.jpg',
      }));
    } catch (err) {
      console.error('❌ 載入失敗', err);
      return [];
    }
  };

  /* ===============================
     🔍 TripFilter 搜尋
  ================================ */
  const handleSearch = async (filters: any) => {
    const results = await fetchTrips(filters);
    setTrips(results);
    setHasMore(false);
  };

  /* ===============================
     🚀 初始化載入
  ================================ */
  useEffect(() => {
    (async () => {
      const fetched = await fetchTrips();
      setTrips(fetched);
    })();
  }, []);

  /* ===============================
     📌 Infinite scroll + TOP
  ================================ */
  useEffect(() => {
    let ticking = false;

    const handleScroll = async () => {
      if (!ticking) {
        window.requestAnimationFrame(async () => {
          setShowGoTop(window.scrollY > 300);

          const nearBottom =
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 200;

          if (nearBottom && hasMore && !loading) {
            setLoading(true);
            const moreTrips = await fetchTrips();
            setTrips((prev) => [...prev, ...moreTrips]);
            setHasMore(moreTrips.length > 0);
            setLoading(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="flex flex-col items-center gap-8 py-10 bg-[#F9F9F9] min-h-screen">
      <TripProfile name={user?.nickname || '旅人'} avatar={user?.avatar} />

      <TripFilter onSearch={handleSearch} />

      <div className="max-w-7xl w-full px-6">
        <TripListPage trips={trips} />
      </div>

      {loading && (
        <div className="text-[#F2A922] font-semibold mt-6 animate-pulse">
          正在載入更多行程...
        </div>
      )}

      {showGoTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-[#F2A922] text-white px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition"
        >
          TOP
        </button>
      )}
    </div>
  );
}
