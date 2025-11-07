'use client';
import { useEffect, useState } from 'react';
import Grid from './Grid';
import { getSpotDetail } from '../lib/singlePlaceAdapter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDown } from '@fortawesome/free-solid-svg-icons';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Raw = any;
type Front = {
  id: number;
  name: string;
  address: string;
  description: string;
  ratingAvg: number;
  photos: string[]; // Card 只用到 [0]
};

function normalize(p: Raw): Front {
  // Photos 可能是 [] 或 [{url}]；rating.avg 是字串
  const photos = Array.isArray(p?.Photos)
    ? p.Photos.map((x: any) => x?.url).filter(Boolean)
    : Array.isArray(p?.photos)
      ? p.photos
          .map((x: any) => (typeof x === 'string' ? x : x?.url))
          .filter(Boolean)
      : [];

  const ratingAvg = Number(p?.rating?.avg ?? p?.avgScore ?? 0);

  return {
    id: p?.id ?? p?.place_id,
    name: p?.name ?? '',
    address: p?.address ?? p?.region ?? '',
    description: p?.introduce ?? p?.description ?? '',
    ratingAvg: Number.isFinite(ratingAvg) ? ratingAvg : 0,
    photos,
  };
}

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState<'spot' | 'food'>('spot');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 串接後端 API
  async function fetchPlaces() {
    setLoading(true);
    try {
      const url = `${API}/api/place?type=${activeTab}&sort=${
        sortOrder === 'desc' ? 'rank_desc' : 'rank_asc'
      }&limit=12&page=1`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();

      const rows: Raw[] = Array.isArray(json?.data) ? json.data : [];
      const mapped = rows.map(normalize).filter((x) => x.id != null);

      // 去重避免 key 撞
      const dedup = Array.from(new Map(mapped.map((x) => [x.id, x])).values());
      setData(dedup);

      // 只看一次樣本
      if (dedup.length) console.log('sample for Card:', dedup[0]);
    } finally {
      setLoading(false);
    }
  }

  // 每次切換 tab 或排序時重新抓
  useEffect(() => {
    fetchPlaces();
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
          <button
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
          >
            <FontAwesomeIcon icon={faUpDown} />
          </button>
        </div>
      </div>

      {/* Grid 卡片 */}
      <Grid data={data} />
    </section>
  );
}
