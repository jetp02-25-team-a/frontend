'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFetch } from '../_lib/_hooks';

import AccCard from '../_components/client/AccCard';
import Section from '../_components/server/Section';
import SearchBar from '../_components/client/Searchbar';

import type { AccDataCard, SearchResponse } from '../_types';

export default function SearchPage() {
  const params = useSearchParams();
  const [items, setItems] = useState<AccDataCard[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 組 query string
  const query = new URLSearchParams({
    keyword: params.get('keyword') || '',
    checkInDate: params.get('checkInDate') || '',
    checkOutDate: params.get('checkOutDate') || '',
    guestCount: params.get('guestCount') || '',
    ...(cursor ? { cursor } : {}),
  }).toString();

  // 用 useFetch 抓搜尋結果
  const { data, loading, error } = useFetch<SearchResponse>(
    `http://localhost:3005/api/m3/accommodations/search?${query}`,
    { withAuth: false } // 搜尋 API 不需要 token
  );

  // 每次 data 更新 → append 到 items
  useEffect(() => {
    if (data?.data) {
      setItems((prev) => (cursor ? [...prev, ...data.data] : data.data));
    }
  }, [data]);

  // IntersectionObserver → 觸發下一頁
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.meta.hasNextPage && !loading) {
          setCursor(data.meta.endCursor); // 🔑 用 endCursor 當下一頁 cursor
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [data, loading]);

  // 取得定位（可用在地圖）
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('定位失敗:', err);
        }
      );
    }
  }, []);

  return (
    <>
      <Section className="bg-lg">
        <div className="w-full flex justify-center items-center">
          <SearchBar />
        </div>
        <hr className="w-full text-cg" />
      </Section>
      <Section>
        <div className="flex w-full">
          {/* 左欄：卡片列表 */}
          <div className="flex-1 max-w-[900px] p-4 overflow-y-auto">
            <div className="flex flex-wrap gap-6">
              {items.map((item, index) => (
                <AccCard
                  key={`${item.id}-${index}`}
                  id={item.id}
                  imageUrl={item.mainImage}
                  imageAlt={item.name}
                  rating={item.averageRating}
                  name={item.name}
                  location={item.city}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>

            {/* 載入中 / 無更多 / sentinel */}
            <div className="mt-6 flex justify-center">
              {loading && <div className="text-sm text-gray-500">載入中…</div>}
              {error && (
                <div className="text-sm text-red-500">
                  錯誤: {error.message}
                </div>
              )}
              {!data?.meta.hasNextPage && (
                <div className="text-sm text-gray-500">已無更多結果</div>
              )}
              {data?.meta.hasNextPage && (
                <div ref={sentinelRef} className="h-1" />
              )}
            </div>
          </div>

          {/* 右欄：地圖 sticky */}
          <div className="flex-1 border-gray-300">
            <div className="sticky top-0 h-screen">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
                <span className="text-gray-500">地圖互動區</span>
              </div>
            </div>
          </div>
        </div>
        <hr className="w-full text-cg" />
      </Section>
    </>
  );
}
