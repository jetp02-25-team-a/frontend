'use client';
import { useState, useMemo } from 'react';
import Grid from './Grid';
import { places } from '../lib/fixtures';
import { toFrontSpot } from '../lib/adapter';

export default function ExploreSection() {
  // 狀態：目前選中的類型與排序方式
  const [activeTab, setActiveTab] = useState<'spot' | 'food'>('spot');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // 經 adapter 轉換資料格式（算好 ratingAvg）
  const data = useMemo(() => {
    const converted = places
      .filter((p) => p.type === activeTab)
      .map(toFrontSpot)
      .sort((a, b) =>
        sortOrder === 'desc'
          ? b.ratingAvg - a.ratingAvg
          : a.ratingAvg - b.ratingAvg
      );
    return converted;
  }, [activeTab, sortOrder]);

  return (
    <section className="max-w-6xl mx-auto px-4 mb-12">
      {/* Header 區塊 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('spot')}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              activeTab === 'spot'
                ? 'bg-yellow-500 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            景點
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              activeTab === 'food'
                ? 'bg-yellow-500 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            美食
          </button>
        </div>

        {/* 排序選單 */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-gray-700">
            排序：
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="desc">星等：高 → 低</option>
            <option value="asc">星等：低 → 高</option>
          </select>
        </div>
      </div>

      {/* Grid 卡片 */}
      <Grid data={data} />
    </section>
  );
}
