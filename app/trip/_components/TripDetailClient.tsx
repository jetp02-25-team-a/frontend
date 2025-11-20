'use client';

import { useState } from 'react';
import TripInfoPanel from './TripInfoPanel';
import PackingPanel from './PackingPanel';
import ExpensePanel from './ExpensePanel';
import TripSideNav from './TripSideNav';
import MapCli from './MapCli';
import type { TripPlanDetail } from '../lib/trip_adapter';
import { useAuth } from '@/hooks/use-Auth';
import { API_URL } from '@/config/api-path';
import Image from 'next/image';

type DetailTab = 'info' | 'packing' | 'expense';

export default function TripDetailClient({ data }: { data: TripPlanDetail }) {
  const [tab, setTab] = useState<DetailTab>('info');
  const { user } = useAuth();
  
  const userName = user?.nickname || user?.name || '旅人';
  const avatarUrl = user?.avatar 
    ? `${API_URL}/${user.avatar}` 
    : '/avatar_default.png';

  return (
    <div className="min-h-screen bg-white">
      {/* 三欄佈局 */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* 左側邊欄 */}
        <aside className="w-80 bg-white border-r border-neutral-200 flex flex-col">
          {/* 用戶卡片 */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-neutral-100 overflow-hidden flex-shrink-0">
                <Image
                  src={avatarUrl}
                  alt={userName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/avatar_default.png';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold text-neutral-900 truncate">
                  {userName}
                </div>
                <div className="flex items-center gap-1 text-neutral-500 text-sm">
                  <span>查看個人資料</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 導航選單 */}
          <div className="flex-1 overflow-y-auto">
            <TripSideNav active={tab} onChange={setTab} />
          </div>
        </aside>

        {/* 中間區域：行程內容 */}
        <main className="flex-1 overflow-y-auto bg-[#FFFDF7]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* 標題 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {data.trip.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span>{data.trip.startDate} ~ {data.trip.endDate}</span>
                <span>•</span>
                <span>目的地：{data.trip.destination}</span>
              </div>
            </div>

            {/* 內容區域 */}
            {tab === 'info' && (
              <TripInfoPanel 
                details={data.details} 
                tripId={data.trip.id}
                startDate={data.trip.startDate}
                endDate={data.trip.endDate}
                onUpdate={() => {}}
              />
            )}
            {tab === 'packing' && <PackingPanel tripId={data.trip.id} />}
            {tab === 'expense' && <ExpensePanel tripId={data.trip.id} />}
          </div>
        </main>

        {/* 右側：地圖 */}
        <aside className="w-96 bg-white border-l border-neutral-200 p-6 overflow-y-auto">
          <MapCli />
        </aside>
      </div>
    </div>
  );
}
