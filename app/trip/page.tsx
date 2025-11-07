'use client';

import { useEffect, useState } from 'react';
import TripProfile from './_components/TripProfile';
import TripFilter from './_components/TripFilter';
import TripListPage from './_components/TripListPage';
import { Trip } from './types/trip';

export default function TripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showGoTop, setShowGoTop] = useState(false);
  const [user, setUser] = useState<{
    nickname: string;
    avatar?: string;
  } | null>(null);

  // ✅ 模擬取得使用者資訊
  useEffect(() => {
    setUser({ nickname: 'Ellen Lambert', avatar: '/avatar.png' });
  }, []);

  // ✅ 從後端 Express 伺服器載入資料
  const fetchTripsFromAPI = async (filters?: {
    area?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Trip[]> => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      const baseUrl = 'http://localhost:3005/api/trips';

      const params = new URLSearchParams();
      if (filters?.area) params.append('area', filters.area);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (userId) params.append('userId', userId);

      const res = await fetch(`${baseUrl}?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        return json.data.map((trip: any) => ({
          id: trip.id,
          title: trip.title,
          area: trip.area,
          date: `${trip.startDate.slice(0, 10)} ~ ${trip.endDate.slice(0, 10)}`,
          image: trip.url,
        }));
      }
    } catch (error) {
      console.error('載入行程失敗:', error);
    }
    return [];
  };

  // ✅ 搜尋功能
  const handleSearch = async (filters: {
    area: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const results = await fetchTripsFromAPI(filters);
    setTrips(results);
    setHasMore(false);
  };

  // ✅ 初始載入
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

  // ✅ Infinite Scroll
  const loadMoreTrips = async () => {
    setLoading(true);
    const moreTrips = await fetchTripsFromAPI();
    setTrips((prev) => [...prev, ...moreTrips]);
    setHasMore(moreTrips.length > 0);
    setLoading(false);
  };

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
      <TripProfile name={user?.nickname || '旅人'} />
      <TripFilter onSearch={handleSearch} />
      <TripListPage trips={trips} />

      {loading && (
        <div className="text-yellow-500 font-semibold mt-6 animate-pulse">
          正在載入更多行程...
        </div>
      )}

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
