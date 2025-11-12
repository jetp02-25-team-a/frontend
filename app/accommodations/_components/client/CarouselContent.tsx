'use client';

import { AccDataCard } from '../../_types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ComponentsAccCard from './AccCard';
import { useFavorites, useCarousel } from '../../_lib/_hooks';
import LoginModal from './LoginModal';

export interface CarouselContentProps {
  title: string;
  data: AccDataCard[];
}

// 💡 定義卡片寬度常量 (需與 ComponentsAccCard 中的實際寬度一致)
const CARD_WIDTH = 266; // 卡片寬度 w-[266px]
const GAP_WIDTH = 20; // 卡片間距 gap-5 (約 20px)
const CARD_FULL_SIZE = CARD_WIDTH + GAP_WIDTH;

export default function CarouselContent({ title, data }: CarouselContentProps) {
  // 狀態管理：追蹤每個卡片的收藏狀態
  const { toggleFavorite, isFavorite, showLoginModal, setShowLoginModal } =
    useFavorites(data);

  // 捲動邏輯
  const { moveCarousel, translateX, isAtStart, isAtEnd } = useCarousel(
    3, // 每次移動幾張
    data.length,
    CARD_FULL_SIZE
  );

  // 🚨 空資料防護
  if (!data.length) {
    return (
      <div className="w-full p-4">
        <p className="text-gray-500">目前沒有資料</p>
      </div>
    );
  }

  // 卡片渲染邏輯
  const cards = data.map((card) => (
    <div key={card.id} className="shrink-0">
      <ComponentsAccCard
        id={card.id}
        imageUrl={card.mainImage}
        imageAlt={card.name}
        rating={card.averageRating}
        name={card.name}
        location={card.city}
        // 傳遞狀態和事件處理函式
        isFavorite={isFavorite(card.id)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  ));

  return (
    <>
      <div className="w-full gap-[18px] flex flex-col items-center p-4">
        {/* 標題和按鈕 */}
        <div className="w-full flex justify-between items-center border-b pb-1">
          <div className="flex text-[36px] font-semibold text-gray-800">
            {title}
          </div>

          <div className="flex gap-3">
            {/* 🚨 onClick 直接呼叫 scroll 函式 */}
            <button
              className="flex justify-center items-center size-9 cursor-pointer text-white text-base bg-brand border-2 border-lo rounded-full active:bg-brand active:text-white"
              onClick={() => moveCarousel('left')}
              disabled={isAtStart}
              style={{ opacity: isAtStart ? 0.5 : 1 }}
            >
              <FaChevronLeft className="size-4" />
            </button>

            <button
              className="flex justify-center items-center size-9 cursor-pointer text-white text-base bg-brand border-2 border-lo rounded-full active:bg-brand active:text-white"
              onClick={() => moveCarousel('right')}
              disabled={isAtEnd}
              style={{ opacity: isAtEnd ? 0.5 : 1 }}
            >
              <FaChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* 捲動區域 (Wrapper) */}
        <div className="w-full relative overflow-hidden px-4">
          <div
            className="flex justify-start gap-5 flex-nowrap min-w-max pb-4  transition-transform duration-500 ease-out"
            // 🚨 核心：根據 currentIndex 應用位移
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {cards}
          </div>
        </div>
      </div>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
