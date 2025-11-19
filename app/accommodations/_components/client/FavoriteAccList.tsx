// components/FavoriteAccommodationList.tsx

'use client';

import Link from 'next/link';
import { FaHeart, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { useFavoriteAccommodation } from '../../../../contexts/FavoriteAccommodationContext';

// 假設住宿詳情頁面的基礎路徑是 /accommodations/[ID]
const ACCOMMODATION_DETAIL_BASE_PATH = '/accommodations';

export default function FavoriteAccommodationList() {
  const { favoriteData } = useFavoriteAccommodation();

  // 檢查 SWR 是否正在載入 (當 key 存在但 data 為 undefined 時)
  // 並且排除未登入時 key 為 null 的情況
  const isLoading = favoriteData === undefined;

  const favorites = favoriteData?.favoriteAccList || [];
  const count = favoriteData?.count || 0;

  // --- 載入狀態 ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500">
        <FaSpinner className="animate-spin mr-2" />
        載入您的收藏清單...
      </div>
    );
  }

  // --- 空狀態 ---
  if (favorites.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <FaHeart className="mx-auto h-10 w-10 text-pink-500 mb-3" />
        <h3 className="text-xl font-semibold text-gray-700">
          您尚未收藏任何住宿
        </h3>
        <p className="mt-2 text-gray-500">
          前往住宿頁面探索您喜歡的房源並點擊愛心圖示。
        </p>
        <Link
          href={ACCOMMODATION_DETAIL_BASE_PATH}
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium transition"
        >
          開始探索住宿
        </Link>
      </div>
    );
  }

  // --- 列表渲染 ---
  return (
    <div className="space-y-4">
      <ul className="divide-y divide-gray-200">
        {favorites.map((item) => (
          <li key={item.accommodationId}>
            <Link
              href={`${ACCOMMODATION_DETAIL_BASE_PATH}/${item.accommodationId}`}
              className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition duration-150 rounded-lg shadow-sm"
            >
              {/* 住宿名稱 */}
              <span className="text-lg font-medium text-gray-800 truncate">
                {item.name}
              </span>

              {/* 連結圖示 */}
              <FaChevronRight className="h-5 w-5 text-gray-400 ml-4" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
