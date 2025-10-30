'use client';

import HeroSlider from './_components/HeroSlider';
import SearchBar from './_components/SearchBar';
import PlaceGrid from './_components/Grid';

export default function HomePage() {
  return (
    <main className="bg-[#FAE4B5] min-h-screen">
      {/* Hero 幻燈片 */}
      <HeroSlider />

      {/* 搜尋框 */}
      <SearchBar />

      {/* 熱門地點 */}
      <PlaceGrid />
    </main>
  );
}
