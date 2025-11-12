import CarouselContent from './_components/client/CarouselContent';
import SearchBar from './_components/client/Searchbar';
import Section from './_components/server/Section';

import { fetchAccommodations } from './_lib/_data';

export default async function AccommodationPage() {
  const [popularData, highRatedData] = await Promise.all([
    fetchAccommodations('popular'),
    fetchAccommodations('highRated'),
  ]);
  return (
    <>
      <Section>
        <span className="text-[36px]">住的好，才能走得更遠。</span>
        <hr className="w-full text-cg" />
        <span className="text-cg text-[24px]">
          輸入您的 目的地，選定 日期，確認
          人數，即刻為您的旅程找到最舒適的「充電站」！
        </span>
        <div className="w-full flex justify-center items-center">
          <SearchBar />
        </div>
      </Section>

      {/* 區塊 1: 熱門推薦 - Page SC 將數據傳給 Section SC */}
      <Section className="bg-lg">
        <CarouselContent title="熱門推薦" data={popularData} />
        <hr className="w-full text-cg" />
      </Section>

      {/* 區塊 2: 高星級住宿 - Page SC 將數據傳給 Section SC */}
      <Section>
        <CarouselContent title="好評推薦" data={highRatedData} />
        <hr className="w-full text-cg" />
      </Section>
    </>
  );
}
