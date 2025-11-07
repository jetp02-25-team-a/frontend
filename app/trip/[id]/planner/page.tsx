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

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{trip.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          📍 {trip.area} ｜ {trip.startDate.split('T')[0]} ~{' '}
          {trip.endDate.split('T')[0]}
        </p>

        {/* 如果後端有 days 結構 */}
        {trip.days && trip.days.length > 0 ? (
          trip.days.map((day, i) => (
            <TripDay
              key={i}
              dayNumber={i + 1}
              date={day.date}
              places={day.places}
            />
          ))
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">
              目前尚無詳細行程，以下為自動產生的天數框架：
            </p>
            {generateDays(trip.startDate, trip.endDate).map((date, i) => (
              <TripDay key={i} dayNumber={i + 1} date={date} places={[]} />
            ))}
          </>
        )}
      </main>

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
