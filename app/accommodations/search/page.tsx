'use client';

import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useAccommodationSearch } from '../_lib/_hooks';
import { useGeolocation, useInfiniteScroll } from '../_lib/_hooks';

import AccCard from '../_components/client/AccCard';
import Section from '../_components/server/Section';
import SearchBar from '../_components/client/Searchbar';

export default function SearchPage() {
  const params = useSearchParams();
  const { items, meta, loading, error, setCursor } =
    useAccommodationSearch(params);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Infinite Scroll Hook
  useInfiniteScroll(sentinelRef, !!meta?.hasNextPage, loading, () => {
    if (meta?.endCursor) {
      setCursor(meta.endCursor);
    }
  });

  // Geolocation Hook
  const { coords, loading: geoLoading, error: geoError } = useGeolocation();

  return (
    <>
      <Section className="bg-lgray">
        <div className="w-full flex justify-center items-center">
          <SearchBar />
        </div>
        <hr className="w-full text-cg" />
      </Section>
      <Section>
        <div className="flex w-full">
          {/* 左欄：卡片列表 */}
          <div className="flex-1 max-w-[900px] p-4">
            <div className="flex flex-wrap gap-6">
              {items.map((item) => (
                <AccCard
                  key={item.id}
                  id={item.id}
                  imageUrl={item.mainImage}
                  imageAlt={item.name}
                  avgRating={item.averageRating}
                  name={item.name}
                  location={item.city}
                />
              ))}
            </div>

            {/* 載入中 / 無更多 / sentinel */}
            <div className="mt-6 flex justify-center">
              {loading && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="loader border-2 border-gray-300 rounded-full w-4 h-4 animate-spin" />
                  載入中…
                </div>
              )}
              {error && (
                <div className="text-sm text-red-500">
                  錯誤: {error.message}
                </div>
              )}
              {!meta?.hasNextPage && (
                <div className="text-sm text-gray-500">已無更多結果</div>
              )}
              {meta?.hasNextPage && <div ref={sentinelRef} className="h-1" />}
            </div>
          </div>

          {/* 右欄：地圖 sticky */}
          <div className="flex-1 border-gray-300">
            <div className="sticky top-0 h-screen">
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
                {/* 🌟 1. 處理載入狀態 (Loading) */}
                {geoLoading && (
                  <span className="text-gray-500 animate-pulse">
                    正在取得您的地圖位置...
                  </span>
                )}

                {/* 🌟 2. 處理錯誤狀態 (Error) */}
                {!geoLoading && geoError && (
                  <span className="text-red-500 text-center p-4">
                    {/* 顯示更精確的錯誤訊息 */}
                    定位失敗：
                    {geoError instanceof GeolocationPositionError
                      ? geoError.message === 'User denied Geolocation'
                        ? '您拒絕了定位權限。'
                        : `錯誤代碼 ${geoError.code}`
                      : '無法取得位置。'}
                  </span>
                )}

                {/* 🌟 3. 處理成功狀態 (Coords available) */}
                {!geoLoading && !geoError && coords && (
                  <span className="text-gray-500 text-center">
                    目前定位：
                    <br />
                    緯度: {coords.lat.toFixed(6)}, 經度: {coords.lng.toFixed(6)}
                  </span>
                )}

                {/* 🌟 4. 處理預設狀態 (既不載入，也沒錯誤，也沒座標，可能是 Hook 剛初始化) */}
                {!geoLoading && !geoError && !coords && (
                  <span className="text-gray-500">地圖互動區 (未設定位置)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <hr className="w-full text-cg" />
      </Section>
    </>
  );
}
