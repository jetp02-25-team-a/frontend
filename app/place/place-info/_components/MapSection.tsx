'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ---- 用 dynamic 匯入 LeafletMap ----
// ssr: false → 禁用伺服端渲染，避免 window 未定義
const LeafletMap = dynamic(() => import('./MapSectionClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] bg-neutral-200 animate-pulse rounded-xl" />
  ),
});

export default function MapSectionWrapper({ placeId }: { placeId: number }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[360px] bg-neutral-200 animate-pulse rounded-xl" />
      }
    >
      <LeafletMap
        placeId={placeId}
        apiBase={process.env.NEXT_PUBLIC_API_BASE_URL || ''}
      />
    </Suspense>
  );
}
