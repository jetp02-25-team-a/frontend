'use client';

import { FaStar, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { FaLocationDot } from 'react-icons/fa6';

// 定義 Props 介面
export interface ComponentsAccCardProps {
  // 圖片資料
  imageUrl: string;
  imageAlt: string;
  // 評分
  rating: number;
  // 內容資料
  name: string;
  location: string;
  // 互動狀態與事件
  isFavorite: boolean;
  onToggleFavorite: React.MouseEventHandler<HTMLDivElement>;
}

export default function ComponentsAccCard({
  imageUrl,
  imageAlt,
  rating,
  name,
  location,
  isFavorite,
  onToggleFavorite,
}: ComponentsAccCardProps) {
  const heartClass = isFavorite
    ? 'text-xl text-red-500 cursor-pointer transition-colors' // 已收藏
    : 'text-xl text-gray-400 hover:text-red-400 cursor-pointer transition-colors'; // 未收藏

  return (
    <>
      <div
        className="
      flex flex-col overflow-hidden             {/* 1. 佈局 */}
      w-[266px] h-[384px] gap-[10px]           {/* 3. 大小 */}
      rounded-2xl bg-white customize_shadow     {/* 5. 外觀/效果 */}
      group                                     {/* 6. 互動性 */}
    "
      >
        {/* 1. 圖片區塊 */}
        <div className="w-full h-[256px] relative overflow-hidden ">
          {/* Next.js Image 元件 */}
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill={true}
            className="object-cover  transition-all  duration-700 ease-in-out group-hover:scale-110"
          />

          {/* 評分顯示區塊 */}
          <div className="absolute top-3 right-3 flex items-center bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-2xl">
            {/* 星星圖示，這裡使用 react-icons/fa 的 FaStar */}
            <FaStar className="text-yellow-400 mr-1" />
            {/* 星星顏色為黃色，右邊距 */}
            <span>{rating.toFixed(1)}</span> {/* 顯示評分 */}
          </div>
        </div>

        {/* 2. 內容/資訊區塊 */}
        <div className="flex w-full flex-1">
          {/* 2a. 左側資訊欄 */}
          <div
            className="
                flex flex-col justify-between h-full   {/* 1. 佈局 */}
                w-[211px] gap-[10px]                              {/* 3. 大小 */}
                 px-[20px] py-[15px]         {/* 5. 外觀/效果 */}
            "
          >
            {/* 酒店名稱 */}
            <div className="w-full break-words ">
              {/* 排版類別 */}
              <span className="font-sans text-xl font-black">{name}</span>
            </div>

            {/* 地點資訊區塊 */}
            <div className="flex gap-[8px] items-center">
              <div>
                <FaLocationDot
                  className="text-2xl text-blue-700" // 2xl 尺寸，深藍色
                />{' '}
              </div>
              <div>
                <span className="text-base">{location}</span>
              </div>
            </div>
          </div>

          {/* 2b. 右側愛心欄 */}
          <div
            className="
                flex flex-1 justify-center h-full  {/* 1. 佈局 */}
                pt-[20px]               {/* 5. 外觀/效果 */}
            "
            onClick={onToggleFavorite}
          >
            <FaHeart
              className={heartClass} // 使用 className 設定大小和顏色
            />
          </div>
        </div>
      </div>
    </>
  );
}
