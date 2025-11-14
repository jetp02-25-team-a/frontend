'use client';

import dynamic from 'next/dynamic';
import SearchBar from '@/app/place/_components/SearchBar';

// 關鍵：ssr: false -> 不在伺服器載入
const MapClient = dynamic(() => import('./_components/MapClient'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <main className=" min-h-screen">
      {/* 搜尋框 */}
      <SearchBar />

      {/* 熱門地點 */}
      <MapClient />
    </main>
  );
}
