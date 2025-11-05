'use client';

import { useEffect, useRef, useState } from 'react';

import { CardData } from '../../_types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ComponentsAccCard from './AccCard';

export interface CarouselContentProps {
  title: string;
  data: CardData[];
}

type FavoriteState = Map<number, boolean>;

export default function CarouselContent({ title, data }: CarouselContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // 狀態管理：追蹤每個卡片的收藏狀態
  const [favorites, setFavorites] = useState<FavoriteState>(new Map());

  // 初始化收藏狀態：確保在數據載入時，狀態被正確初始化
  useEffect(() => {
    const initialFavorites = new Map<number, boolean>();
    data.forEach((card) => {
      // 🚨 這裡應該使用 SC 傳遞下來的初始收藏狀態，但為了簡潔，暫時設為 false
      initialFavorites.set(card.id, card.isFavorite);
    });
    setFavorites(initialFavorites);
  }, [data]); // 依賴於 data 確保在數據變化時重新初始化

  // 捲動函式 (簡單函式，不需 useCallback)
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const wrapperWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount =
        direction === 'left' ? -(wrapperWidth / 2) : wrapperWidth / 2;

      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
        imageUrl={card.imageUrl}
        imageAlt={card.imageAlt}
        rating={card.rating}
        name={card.name}
        location={card.location}
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
            onClick={() => scroll('left')}
          >
            <FaChevronLeft className="size-4" />
          </button>

          <button
            className="flex justify-center items-center size-9 cursor-pointer text-white text-base bg-brand border-2 border-lo rounded-full active:bg-brand active:text-white"
            onClick={() => scroll('right')}
          >
            <FaChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* 捲動區域 (Wrapper) */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-scroll scrollbar-hide"
      >
        <div className="flex justify-start gap-5 flex-nowrap min-w-max pb-4 p-1 bg-amber-600/10">
          {cards}
        </div>
      </div>
    </div>
  );
}
