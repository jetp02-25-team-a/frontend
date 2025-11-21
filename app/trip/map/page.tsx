// app/trip/map/page.tsx
'use client';

import dynamic from 'next/dynamic';

// 禁用 SSR 的地圖組件（你之前的 MapCli.tsx）
const MapCli = dynamic(() => import('../_components/MapCli'), {
  ssr: false,
});

export default function TripMapPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF7]">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <h1 className="text-xl font-semibold">行程地圖</h1>
        <div className="h-[70vh] overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <MapCli />
        </div>
      </div>
    </main>
  );
}
