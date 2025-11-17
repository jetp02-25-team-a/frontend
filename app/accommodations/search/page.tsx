'use client';

import { useSearchParams } from 'next/navigation';
import {
  useAccommodationSearchInfiniteScroll,
  useGeolocation,
} from '../_lib/_hooks';

import AccCard from '../_components/client/AccCard';
import Section from '../_components/server/Section';
import SearchBar from '../_components/client/Searchbar';

import dynamic from 'next/dynamic';

const AccMap = dynamic(() => import('../_components/client/AccMap'), {
  ssr: false,
});

export default function SearchPage() {
  const params = useSearchParams();
  const { items, meta, loading, error, sentinelRef } =
    useAccommodationSearchInfiniteScroll(params);

  // Geolocation Hook
  const { coords, loading: geoLoading, error: geoError } = useGeolocation();

  return (
    <>
      {/* 🔎 上方搜尋區塊 */}
      <Section className="bg-lgray">
        <div className="w-full flex justify-center items-center">
          <SearchBar />
        </div>
        <hr className="w-full text-cg" />
      </Section>

      {/* 🔎 主內容區塊 */}
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
              <div className="py-2 w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl">
                {/* 🌟 1. 載入中 */}
                {geoLoading && (
                  <span className="text-gray-500 animate-pulse">
                    正在取得您的地圖位置...
                  </span>
                )}

                {/* 🌟 2. 錯誤 */}
                {!geoLoading && geoError && (
                  <span className="text-red-500 text-center p-4">
                    定位失敗：
                    {geoError instanceof GeolocationPositionError
                      ? geoError.message === 'User denied Geolocation'
                        ? '您拒絕了定位權限。'
                        : `錯誤代碼 ${geoError.code}`
                      : '無法取得位置。'}
                  </span>
                )}

                {/* 🌟 3. 成功 → 顯示 Map */}
                {!geoLoading && !geoError && coords && (
                  <AccMap items={items} coords={coords} zoom={13} />
                )}

                {/* 🌟 4. 預設 → 顯示 Map (沒有定位就用 fallback) */}
                {!geoLoading && !geoError && !coords && (
                  <AccMap items={items} zoom={13} />
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
