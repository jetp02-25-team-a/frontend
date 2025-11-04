'use client';
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';

// 由於你移除了 SearchIcon, 我創建了一個簡單的 SearchField 來取代它
interface SearchFieldProps {
  icon: React.ElementType; // 接受一個 React Icon 組件
  type: string;
  // 這裡可以根據需要添加更多 prop，例如 placeholder 或 value
}

const SearchField = ({ icon: Icon, type }: SearchFieldProps) => {
  return (
    <div className="flex flex-1 grow items-center gap-2">
      {/* 渲染傳入的 Icon 組件，並設置大小和顏色 */}
      <Icon className="w-6 h-6 text-brand" />
      <div className="font-semibold text-gray-800 whitespace-nowrap">
        {/* 這裡可以根據 type 顯示不同的文字或輸入框 */}
        {type === 'location' && 'Location'}
        {type === 'from' && 'From Date'}
        {type === 'end' && 'End Date'}
        {type === 'guest' && 'Guests'}
      </div>
    </div>
  );
};

// ---

interface SearchBar4Props {
  className?: string;
}

export default function SearchBar4({ className }: SearchBar4Props) {
  return (
    <div
      className={`flex w-[954px] items-center justify-between pl-6 pr-3 py-1.5  bg-white rounded-[72px] border border-solid border-[#d9d9d9] shadow-card-shadow ${className}`}
    >
      <div className="flex w-[845px] items-center justify-center gap-12 relative">
        {/* 1. Location */}
        <SearchField icon={FiMapPin} type="location" />

        {/* 垂直分隔線 (使用 Tailwind 實現) */}
        <div className="w-px h-[33px] bg-[#d9d9d9] mx-2" />

        {/* 2. From Date */}
        <SearchField icon={FiCalendar} type="from" />

        {/* 垂直分隔線 */}
        <div className="w-px h-[33px] bg-[#d9d9d9] mx-2" />

        {/* 3. End Date */}
        <SearchField
          icon={FiCalendar} // 這裡也用 FiCalendar，或選擇另一個日曆圖標
          type="end"
        />

        {/* 垂直分隔線 */}
        <div className="w-px h-[33px] bg-[#d9d9d9] mx-2" />

        {/* 4. Guests */}
        <SearchField icon={FiUsers} type="guest" />
      </div>

      {/* 搜索按鈕圖標 */}
      <div className="w-12 h-12 flex items-center justify-center bg-brand rounded-full cursor-pointer">
        <FiSearch className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
