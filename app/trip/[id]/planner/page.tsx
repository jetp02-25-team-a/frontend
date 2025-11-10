'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './_components/Sidebar';
import TripDay from './_components/TripDay';
import MapPanel from './_components/MapPanel';
import { getTripById } from '@/app/trip/utils/api';

interface Trip {
  id: number;
  userId: number;
  title: string;
  area: string;
  startDate: string;
  endDate: string;
  url?: string;
  days?: {
    date: string;
    places: {
      name: string;
      address?: string;
      image?: string;
      time?: string;
    }[];
  }[];
}

export default function PlannerPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTrip() {
      try {
        const res = await getTripById(id as string);
        if (res.success && res.data) {
          setTrip(res.data);
        } else {
          console.error('取得行程失敗:', res.message);
        }
      } catch (err) {
        console.error('行程讀取錯誤:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-gray-500">載入中...</div>;
  }

  if (!trip) {
    return <div className="p-8 text-red-500">找不到此行程</div>;
  }

  // 這裡先用自動產生日數當假資料，之後接 TripPlanDetail 再改
  const dayDates =
    trip.days && trip.days.length > 0
      ? trip.days.map((d) => d.date)
      : generateDays(trip.startDate, trip.endDate);

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* 左側：私人 Sidebar */}
      <Sidebar />

      {/* 中間：行程天數 + 每天的卡片 */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{trip.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          📍 {trip.area} ｜ {trip.startDate.split('T')[0]} ~{' '}
          {trip.endDate.split('T')[0]}
        </p>

        {/* 日期列（像組長那樣第 1 天、第 2 天...） */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {dayDates.map((date, idx) => (
            <div
              key={date}
              className="flex flex-col items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm shrink-0"
            >
              <p className="text-gray-500">{formatDateToChinese(date)}</p>
              <p className="font-medium">{`第${numberToChinese(idx + 1)}天`}</p>
            </div>
          ))}
        </div>

        {/* 每一天的詳細行程卡片 */}
        <div className="space-y-8">
          {dayDates.map((date, idx) => {
            // 之後可以從 trip.days 把當天的 places 塞進來
            const places =
              trip.days?.find((d) => d.date === date)?.places ?? [];

            return (
              <TripDay
                key={date}
                dayNumber={idx + 1}
                date={date}
                places={places}
              />
            );
          })}
        </div>
      </main>

      {/* 右側：地圖區（可先維持簡單版 MapPanel） */}
      <MapPanel />
    </div>
  );
}

/**
 * 根據開始與結束日期自動產生天數陣列
 */
function generateDays(start: string, end: string): string[] {
  const days: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// 簡易：數字轉成中文（1 → 一, 2 → 二 ...）
function numberToChinese(num: number): string {
  const map = ['零', '一', '二', '三', '四', '五', '六', '七'];
  return map[num] || String(num);
}

// 日期轉成 10 月 25 日 這種
function formatDateToChinese(dateStr: string): string {
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m} 月 ${day} 日`;
}
