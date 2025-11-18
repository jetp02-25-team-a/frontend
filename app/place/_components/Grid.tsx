'use client';

import React from 'react';
import Card from './Card';
import FadeIn from '../_components/FadeIn';
import { buildImageUrl } from '@/config/image-path';

export default function Grid({ data }: { data: any[] }) {
  // 你目前每頁是 12 筆，讓錯落依照「該批的 index」做 0~330ms 的延遲
  const STAGGER_BASE = 30; // 每張相差 30ms
  const PAGE_SIZE = 12;

  return (
    <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 ">
      {data.map((p, idx) => {
        const key =
          p?.id ?? p?.place_id ?? `${p?.type ?? 'x'}-${p?.name ?? 'n'}-${idx}`;

        const first =
          Array.isArray(p?.photos) && p.photos.length
            ? (typeof p.photos[0] === 'string'
                ? p.photos[0]
                : p.photos[0]?.url) || ''
            : '';

        const raw = first || '';
        const cover = raw
          ? buildImageUrl(raw)
          : 'https://picsum.photos/seed/default/400/300';

        // 讓每批的 12 張有輕微錯落，避免全部同時跳出
        const delay = (idx % PAGE_SIZE) * STAGGER_BASE;

        return (
          <FadeIn key={key} delay={delay} duration={420} translate={8}>
            <Card spot={p} photo={cover} />
          </FadeIn>
        );
      })}
    </div>
  );
}
