'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api-path';

interface City {
  id: number;
  name: string;
  imageUrl?: string | null;
}

export default function TripFilterBar() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 載入城市列表
  useEffect(() => {
    async function loadCities() {
      try {
        const r = await fetch(`${API_URL}/api/m2/destinations`, {
          cache: 'no-store',
        });
        const text = await r.text();
        const data = text ? JSON.parse(text) : [];
        setCities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('載入城市列表失敗:', err);
      }
    }
    loadCities();
  }, []);

  const selectedCity = cities.find(c => c.id === selectedCityId);

  const handleSearch = () => {
    // TODO: 實作搜尋功能
    console.log('搜尋:', { selectedCityId, startDate, endDate });
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-neutral-100 px-6 py-5">
      <div className="flex flex-wrap items-center gap-6">
        {/* 搜尋標題 */}
        <div className="w-full mb-2">
          <label className="text-sm font-medium text-neutral-700">搜尋行程日期</label>
        </div>

        {/* 目的地選擇 */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
            目的地
          </label>
          <div className="relative flex-1">
            <select
              value={selectedCityId || ''}
              onChange={(e) => setSelectedCityId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm outline-none appearance-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all"
            >
              <option value="">全部</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* 顯示選中城市的圖片 */}
          {selectedCity?.imageUrl && (
            <img
              src={selectedCity.imageUrl}
              alt={selectedCity.name}
              className="w-10 h-10 object-cover rounded-full border border-neutral-200 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        {/* 開始時間 */}
        <div className="flex items-center gap-3 flex-1 min-w-[220px]">
          <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
            開始時間
          </label>
          <div className="relative flex-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all"
              placeholder="年/月/日"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 結束時間 */}
        <div className="flex items-center gap-3 flex-1 min-w-[220px]">
          <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
            結束時間
          </label>
          <div className="relative flex-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all"
              placeholder="年/月/日"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 搜尋按鈕 */}
        <button
          onClick={handleSearch}
          className="bg-[#F6C453] text-white px-8 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:bg-[#E5B442] transition-all duration-200 font-medium text-sm min-w-[100px]"
        >
          搜尋
        </button>
      </div>
    </div>
  );
}
