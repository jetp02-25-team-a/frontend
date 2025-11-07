'use client';

import { useEffect, useState } from 'react';

import { AccDataCard, CardData } from '../../_types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ComponentsAccCard from './AccCard';

export interface CarouselContentProps {
  title: string;
  data: AccDataCard[];
}

type FavoriteState = Map<number, boolean>;

// 💡 定義卡片寬度常量 (需與 ComponentsAccCard 中的實際寬度一致)
const CARD_WIDTH = 266; // 您的卡片寬度 w-[266px]
const GAP_WIDTH = 20; // 您的卡片間距 gap-5 (約 20px)
const CARD_FULL_SIZE = CARD_WIDTH + GAP_WIDTH;

export default function CarouselContent({ title, data }: CarouselContentProps) {
  // 狀態管理：追蹤每個卡片的收藏狀態
  const [favorites, setFavorites] = useState<FavoriteState>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0); // 追蹤當前顯示的第一張卡片索引

  // 初始化收藏狀態：確保在數據載入時，狀態被正確初始化
  useEffect(() => {
    const initialFavorites = new Map<number, boolean>();
    data.forEach((card) => {
      // 🚨 這裡應該使用 SC 傳遞下來的初始收藏狀態，但為了簡潔，暫時設為 false
      initialFavorites.set(card.id, false);
    });
    setFavorites(initialFavorites);
  }, [data]); // 依賴於 data 確保在數據變化時重新初始化

  const moveCarousel = (direction: 'left' | 'right') => {
    const numCards = data.length;
    // 假設我們每次移動一張卡片
    const step = 3;

    if (direction === 'right') {
      // 避免超出最後一張卡片
      const maxIndex = numCards > 0 ? numCards - 1 : 0;
      setCurrentIndex((prev) => Math.min(prev + step, maxIndex));
    } else {
      // 避免低於第一張卡片
      setCurrentIndex((prev) => Math.max(prev - step, 0));
    }
  };

  const translateX = currentIndex * CARD_FULL_SIZE;
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= data.length - 1; // 這裡需要更精確的計算，但單卡片移動時這樣足夠

  // 🚨 切換收藏狀態的函式 (移除 useCallback)
  const handleToggleFavorite = (cardId: number) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Map(prevFavorites);
      const isCurrentlyFavorite = prevFavorites.get(cardId) || false;

      // 樂觀更新 UI
      newFavorites.set(cardId, !isCurrentlyFavorite);

      // ⚠️ 這裡應該加入您的 Server Action 呼叫，進行持久化
      // toggleFavoriteAction(cardId, !isCurrentlyFavorite);

      return newFavorites;
    });
  };

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
        isFavorite={favorites.get(card.id) || false}
        onToggleFavorite={() => handleToggleFavorite(card.id)}
      />
    </div>
  ));

  return (
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
  );
}
