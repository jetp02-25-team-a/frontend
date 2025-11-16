'use client';

import { FaStar, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { FaLocationDot } from 'react-icons/fa6';
import Link from 'next/link';

import { IMAGE_PATH } from '@/config/image-path';

import { useFavoriteAccommodation } from '@/contexts/FavoriteAccommodationContext';
import LoginModal from './LoginModal';

// 定義 Props 介面
export interface AccCardProps {
  id: number;
  imageUrl: string;
  imageAlt: string;
  avgRating: number | null;
  name: string;
  location: string;
}

export default function AccCard({
  id,
  imageUrl,
  imageAlt,
  avgRating,
  name,
  location,
}: AccCardProps) {
  const { isFavorite, toggleFavorite, showLoginModal, setShowLoginModal } =
    useFavoriteAccommodation();
  const heartClass = isFavorite(id)
    ? 'text-xl text-red-500 cursor-pointer transition-colors' // 已收藏
    : 'text-xl text-gray-400 hover:text-red-400 cursor-pointer transition-colors'; // 未收藏

  return (
    <>
      <Link href={`/accommodations/${id}?from=list`}>
        <div
          className="
          flex flex-col shrink-0 overflow-hidden
          w-[266px] h-96 gap-2.5
          rounded-2xl bg-white customize_shadow
          group
          "
        >
          {/* 1. 圖片區塊 */}
          <div className="w-full h-64 relative overflow-hidden ">
            {/* Next.js Image 元件 */}
            <Image
              src={`${IMAGE_PATH}${imageUrl}`}
              alt={imageAlt}
              fill={true}
              className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
              sizes="100%"
              priority={true}
            />

            {/* 評分顯示區塊 */}
            <div className="absolute top-3 right-3 flex items-center bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-2xl">
              {/* 星星圖示，這裡使用 react-icons/fa 的 FaStar */}
              <FaStar className="text-yellow-400 mr-1" />
              {/* 星星顏色為黃色，右邊距 */}
              <span>
                {avgRating != null ? avgRating.toFixed(1) : '尚無評分'}
              </span>
            </div>
          </div>

          {/* 2. 內容/資訊區塊 */}
          <div className="flex w-full flex-1">
            {/* 2a. 左側資訊欄 */}
            <div
              className="
                flex flex-col justify-between h-full
                w-[211px] gap-2.5
                px-5 py-[15px]
            "
            >
              {/* 酒店名稱 */}
              <div className="w-full wrap-break-words ">
                {/* 排版類別 */}
                <span className="font-sans text-xl font-black">{name}</span>
              </div>

              {/* 地點資訊區塊 */}
              <div className="flex gap-2 items-center">
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
                flex flex-1 justify-center h-full
                pt-5
            "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(id);
              }}
            >
              <FaHeart
                className={heartClass} // 使用 className 設定大小和顏色
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
