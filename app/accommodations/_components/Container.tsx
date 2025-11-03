'use client';

import { useState } from 'react';
import AccCard from './AccCard';
import SearchBar4 from './Searchbar-4';
import Filters from './Filter';

interface AccommodationData {
  imageUrl: string;
  imageAlt: string;
  rating: number;
  name: string;
  location: string;
}

const MOCK_ACCOMMODATIONS: AccommodationData[] = [
  {
    imageUrl: '/images/trip_sample.jpg',
    imageAlt: '台北精品酒店',
    rating: 4.8,
    name: '台北頂級商務酒店',
    location: '台灣台北市信義區',
  },
  {
    imageUrl: '/istockphoto-1209191587-612x612.jpg',
    imageAlt: '東京豪華飯店',
    rating: 3.4,
    name: '東京天空塔觀景飯店',
    location: '日本東京市墨田區',
  },
  {
    imageUrl: '/image.png',
    imageAlt: '曼谷度假村',
    rating: 4.9,
    name: '曼谷熱帶風情度假村',
    location: '泰國曼谷素坤逸區',
  },
];

export default function Container() {
  const [favorites, setFavorites] = useState(
    Array(MOCK_ACCOMMODATIONS.length).fill(false)
  );
  const handleFavoriteToggle = (index: number) => {
    // 最佳實踐：使用函數式更新來確保狀態可靠性
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites];
      newFavorites[index] = !newFavorites[index];
      return newFavorites;
    });
  };

  // 渲染所有卡片的邏輯
  const renderAccCards = MOCK_ACCOMMODATIONS.map((data, i) => (
    <AccCard
      // 靜態資料可以使用索引作為 key，但如果有唯一 ID 更好
      key={i}
      // 傳入資料
      imageUrl={data.imageUrl}
      imageAlt={data.imageAlt}
      rating={data.rating}
      name={data.name}
      location={data.location}
      // 傳入狀態與處理函數
      isFavorite={favorites[i]}
      onToggleFavorite={() => handleFavoriteToggle(i)}
    />
  ));

  return (
    <>
      <div className="container bg-amber-600 p-3 flex gap-5 ">
        <div className="container bg-amber-600 p-8 flex flex-wrap justify-start gap-5 min-h-screen">
          {renderAccCards}
        </div>
      </div>
      <div className="container bg-amber-300 p-3 flex gap-5 ">
        <SearchBar4 /> <Filters />
      </div>
    </>
  );
}
