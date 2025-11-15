'use client';

import { useEffect, useState } from 'react';
import DayTabs from './_components/DayTabs';
import TripPlanList from './_components/TripPlanList';
import AddPlanButton from './_components/AddPlanButton';
import SidePanel from '../_components/Sidebar';
import MapPanel from '../_components/MapPanel';
import PackingPanel from '../_components/PackingPanel';
import ExpensePanel from '../_components/ExpensePanel';

type ActiveTab = 'info' | 'packing' | 'expense';

interface PlannerClientProps {
  tripId: number;
}

export default function PlannerClient({ tripId }: PlannerClientProps) {
  const [trip, setTrip] = useState<any>(null);
  const [days, setDays] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');

  const [refreshKey, setRefreshKey] = useState(0);
  const reloadPlans = () => setRefreshKey((v) => v + 1);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTrip() {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
      const API = `${BASE}/api/m2/trip/${tripId}`;

      const res = await fetch(API, { credentials: 'include' });
      const json = await res.json();
      console.log('Trip Result:', json);

      if (json.success) {
        setTrip(json.data);
        generateDays(json.data.startDate, json.data.endDate);
      } else {
        console.error('Trip API error:', json);
      }
    } catch (err) {
      console.error('Error fetching trip:', err);
    }
  }

  function generateDays(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);

    const arr: string[] = [];
    let d = new Date(s);

    while (d <= e) {
      arr.push(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }

    setDays(arr);
  }

  if (!trip) return <div className="p-10">載入中...</div>;

  // --- 中間區塊依 activeTab 切換 ---
  let mainContent: React.ReactNode;

  if (activeTab === 'info') {
    // 行程頁（有 DayTabs + 活動列表 + 新增活動）
    const currentDay = days[activeDay];

    mainContent = (
      <>
        <h2 className="text-xl font-semibold mb-4">行程</h2>

        {days.length > 0 && (
          <>
            <DayTabs
              days={days}
              activeDay={activeDay}
              onChange={setActiveDay}
            />

            <TripPlanList
              tripId={tripId}
              day={currentDay}
              refreshKey={refreshKey}
            />

            <AddPlanButton
              tripId={tripId}
              day={currentDay}
              onSaved={reloadPlans}
            />
          </>
        )}

        {days.length === 0 && (
          <div className="mt-6 text-gray-500">尚未設定行程日期</div>
        )}
      </>
    );
  } else if (activeTab === 'packing') {
    // 行李清單頁
    mainContent = (
      <>
        <h2 className="text-xl font-semibold mb-4">行程</h2>
        <PackingPanel tripId={tripId} />
      </>
    );
  } else {
    // 記帳頁
    mainContent = (
      <>
        <h2 className="text-xl font-semibold mb-4">記帳</h2>
        <ExpensePanel tripId={tripId} />
      </>
    );
  }

  return (
    <div className="flex h-screen">
      {/* LEFT: Side Panel */}
      <div className="w-[320px] border-r bg-gray-50 p-4 overflow-auto">
        <SidePanel
          tripId={tripId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* CENTER: Dynamic Main Content */}
      <div className="flex-1 p-6 overflow-auto bg-white">{mainContent}</div>

      {/* RIGHT: Map */}
      <div className="w-[33%] border-l p-4 bg-gray-50">
        <MapPanel />
      </div>
    </div>
  );
}
