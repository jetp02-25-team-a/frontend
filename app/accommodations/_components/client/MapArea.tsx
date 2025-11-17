'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const AccMap = dynamic(() => import('./AccMap'), {
  ssr: false,
});

// 🚨 MapAreaProps 包含所有必要欄位
export interface MapAreaProps {
  id: number; // 住宿 ID
  latitude: number | null;
  longitude: number | null;
  name: string; // 住宿名稱
  city: string; // 城市名稱
}

const searchOsm = async (
  query: string
): Promise<{ lat: number; lng: number } | null> => {
  // 這裡使用 Nominatim API，請注意頻率限制
  // 這是跨域請求，如果在瀏覽器中運行，可能需要考慮 CORS 或使用代理
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
  );
  const data = await response.json();

  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
};

export default function MapArea({
  id,
  latitude,
  longitude,
  name,
  city,
}: MapAreaProps) {
  // 1. 驗證傳入的座標是否有效 (確保不是 null 且不是 NaN)
  const isValidCoord =
    latitude !== null &&
    longitude !== null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude); // 2. 如果座標無效，顯示錯誤訊息

  const [searchText, setSearchText] = useState('');
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setSearchError('請輸入目的地名稱。');
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setDestination(null);

    try {
      const result = await searchOsm(searchText);
      if (result) {
        setDestination(result);
      } else {
        setSearchError('找不到該地點。請嘗試更精確的地址。');
      }
    } catch (error) {
      setSearchError('搜索服務失敗。');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isValidCoord) {
    return (
      <div className="p-4 md:p-8 bg-white rounded-xl shadow-sm h-96 flex items-center justify-center">
        <p className="text-red-500 text-center">
          ⚠️ 地圖資訊無法顯示：住宿座標資料無效。
        </p>
      </div>
    );
  }

  // 3. 處理有效座標和標記數據
  const lat = latitude as number;
  const lng = longitude as number;

  // 設置地圖中心點
  const mapCoords = { lat: lat, lng: lng };

  // 將單一住宿數據轉換為 AccMap 的 items 陣列，以便顯示標記 (Marker)
  const singleItem = [
    {
      id: id, // 🚨 使用傳入的真實 ID 作為 Marker 的 key
      name: name, // 使用傳入的住宿名稱
      city: city, // 使用傳入的城市名稱
      latitude: lat,
      longitude: lng,
    },
  ];

  return (
    <div className="px-32 bg-white h-full w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">地圖位置</h2>
      {/* 🚨 新增的搜索輸入欄位 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="輸入目的地以規劃路線..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-cprimary focus:border-cprimary"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-cprimary text-white font-medium rounded-lg hover:bg-cprimary-dark transition duration-150 disabled:opacity-50"
        >
          {isSearching ? '搜索中...' : '規劃路線'}
        </button>
        {destination && (
          <button
            onClick={() => {
              setDestination(null);
              setSearchText('');
            }}
            className="px-4 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition duration-150"
          >
            清除路線
          </button>
        )}
      </div>
      {searchError && <p className="text-red-500 mb-4">{searchError}</p>}
      <div className="w-full h-128 relative ">
        <AccMap
          className="w-full h-full rounded-lg overflow-hidden border border-gray-200"
          coords={mapCoords}
          items={singleItem}
          zoom={15}
          destination={destination} // 🚨 傳遞目的地座標
        />
      </div>
    </div>
  );
}
