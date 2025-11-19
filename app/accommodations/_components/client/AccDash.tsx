'use client';

import React, { useState } from 'react';
import { FaHeart, FaCalendarCheck, FaSpinner } from 'react-icons/fa';

// 假設路徑結構與您先前提供的 UserDashboardTabs 相同
import BookingList from './BookingList';
import { useFavoriteAccommodation } from '../../../../contexts/FavoriteAccommodationContext';
import { useBooking } from '../../../../contexts/BookingContext';
import FavoriteAccommodationList from './FavoriteAccList';

// 定義 Tab 狀態
type ActiveTab = 'Favorites' | 'Bookings';

// 輔助元件：顯示數量和切換的按鈕/標籤
interface TabButtonProps {
  icon: React.ReactNode;
  title: string;
  count: number | string | React.ReactNode; // 數量可以是數字或 '載入中...' 字串
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  icon,
  title,
  count,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`
  flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition duration-200 
  shadow-md text-lg font-semibold
  ${
    isActive
      ? 'bg-indigo-600 text-white shadow-indigo-400/50'
      : 'bg-white text-gray-700 hover:bg-gray-100'
  }
  `}
  >
    <div className="flex items-center space-x-2 mb-1">
      {icon} <span>{title}</span>
    </div>
    <span
      className={`text-3xl font-extrabold ${isActive ? 'text-white' : 'text-indigo-600'}`}
    >
      {count}
    </span>
  </button>
);

export default function UserDashboardTabs() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('Favorites'); // 預設顯示訂單
  // 1. 獲取收藏數據

  const { favoriteData } = useFavoriteAccommodation();
  const favoriteCount = favoriteData?.count ?? 0;
  const isFavoriteLoading = favoriteData === undefined; // 2. 獲取訂單數據

  const {
    bookings, // 獲取當前頁面的訂單陣列
    isLoading: isBookingLoading,
  } = useBooking();

  // 🌟 核心：使用 bookings.length 作為訂單數量 (代表當前頁面筆數)
  const bookingCount = bookings?.length ?? 0; // 決定顯示的內容元件

  const renderContent = () => {
    if (activeTab === 'Bookings') {
      return <BookingList />;
    }
    if (activeTab === 'Favorites') {
      return <FavoriteAccommodationList />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        {/* 收藏按鈕 */}
        <TabButton
          icon={<FaHeart />}
          title="我的收藏"
          count={
            isFavoriteLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              favoriteCount.toLocaleString() // 顯示總收藏數
            )
          }
          isActive={activeTab === 'Favorites'}
          onClick={() => setActiveTab('Favorites')}
        />
        {/* 訂單按鈕 */}
        <TabButton
          icon={<FaCalendarCheck />}
          title="我的訂單"
          count={
            isBookingLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              bookingCount.toLocaleString() // 顯示當前頁面筆數
            )
          }
          isActive={activeTab === 'Bookings'}
          onClick={() => setActiveTab('Bookings')}
        />
      </div>
      {/* --- 內容顯示區塊 --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}
