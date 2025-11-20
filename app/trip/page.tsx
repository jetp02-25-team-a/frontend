'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import TripUserCard from './_components/TripUserCard';
import TripTabs from './_components/TripTabs';
import TripFilterBar from './_components/TripFilterBar';
import TripList from './_components/TripList';
import { API_URL } from '@/config/api-path';
import Toast from '../place/_components/Toast';

export default function TripPage() {
  // 認證保護由 layout.tsx 中的 ProtectRoute 處理
  const { user, isReady } = useAuth();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [toast, setToast] = useState(null);

  async function loadTrips() {
    try {
      if (!user?.id) return;
      const r = await fetch(`${API_URL}/api/m2/trip/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const text = await r.text();
      const j = text ? JSON.parse(text) : [];
      setTrips(Array.isArray(j) ? j : []);
    } catch (err) {
      console.error(err);
      setToast({ message: '行程載入失敗', type: 'error' });
    }
  }

  useEffect(() => {
    if (isReady && user?.id) loadTrips();
  }, [isReady, user?.id]);

  if (!isReady) return <div className="p-6">讀取中…</div>;

  return (
    <main className="min-h-screen bg-white">
      {/* 標題區域 */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-neutral-900 text-center">我的行程</h1>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 用戶卡片 */}
        <div className="flex justify-center">
          <TripUserCard />
        </div>

        {/* 標籤切換 */}
        <div className="flex justify-center">
          <TripTabs />
        </div>

        {/* 搜尋篩選欄 */}
        <TripFilterBar />

        {/* 行程列表 */}
        <TripList 
          list={trips} 
          selected={selectedTripId} 
          onSelect={setSelectedTripId} 
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={2000}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </main>
  );
}
