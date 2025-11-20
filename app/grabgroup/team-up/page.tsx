'use client';

import { useEffect, useState } from 'react';
import TourCard from './_components/tour-card';
import { useFetch } from '../../../hooks/useFetch';
import AreaButton from './_components/area-button';
import { ItineraryAreaCard } from '../_types/itineraryTypes';
import { useRouter } from 'next/navigation';
import { AVATAR_PATH, IMAGE_PATH } from '../../config/image-path';
import { API_SERVER } from '../../config/api-path';
import { motion } from 'framer-motion';

// 時間過濾選項
type TimeFilter = 'all' | 'upcoming' | 'month';

interface TimeFilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}
// 時間過濾按鈕組件
const TimeFilterButton: React.FC<TimeFilterButtonProps> = ({
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
      active
        ? 'bg-amber-400 text-white shadow-md'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export default function TeamUpPage() {
  const [area, setArea] = useState('新北市');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const url = `${API_SERVER}/itineraries/area?area=${area}`;
  const { data } = useFetch(url);
  const [cards, setCards] = useState<ItineraryAreaCard[]>();
  const router = useRouter();

  // 時間過濾邏輯 - 直接計算，避免額外狀態
  const getFilteredCards = () => {
    if (!cards) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return cards.filter((card: any) => {
      if (!card.createdAt && !card.Days) return true;

      const cardDate = card.Days?.[0]?.dayDate
        ? new Date(card.Days[0].dayDate)
        : new Date(card.createdAt);
      //小魚今天的都過濾去除掉
      if (cardDate < today) return false;

      switch (timeFilter) {
        case 'upcoming':
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return cardDate >= today && cardDate <= nextWeek;

        case 'month':
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          return cardDate >= today && cardDate <= nextMonth;

        case 'all':
        default:
          return cardDate >= today;
      }
    });
  };

  const filteredCards = getFilteredCards();

  useEffect(() => {
    if (data?.data) {
      setCards(data.data);
    }
  }, [data]);
  return (
    <>
      <div className=" flex flex-col gap-[30px]">{/* 顯示不同區域 */}</div>
      <div className="w-full flex justify-center gap-[50px]">
        <AreaButton
          image="/istockphoto-1209191587-612x612.jpg"
          area_name="台北市"
          active={area === '台北市' ? true : false}
          onClick={() => setArea('台北市')}
        />
        <AreaButton
          image="/newTaipeiCity.png"
          area_name="新北市"
          active={area === '新北市' ? true : false}
          onClick={() => setArea('新北市')}
        />
        <AreaButton
          image="/taoyuan.png"
          area_name="桃園市"
          active={area === '桃園市' ? true : false}
          onClick={() => setArea('桃園市')}
        />
        <AreaButton
          image="/hsinchu.png"
          area_name="新竹市"
          active={area === '新竹市' ? true : false}
          onClick={() => setArea('新竹市')}
        />
        <AreaButton
          image="/taichyu.jpg"
          area_name="台中市"
          active={area === '台中市' ? true : false}
          onClick={() => setArea('台中市')}
        />
        <AreaButton
          image="/twofuen.jpg"
          area_name="台南市"
          active={area === '台南市' ? true : false}
          onClick={() => setArea('台南市')}
        />
        <AreaButton
          image="/kaohsiung.png"
          area_name="高雄市"
          active={area === '高雄市' ? true : false}
          onClick={() => setArea('高雄市')}
        />
      </div>
      <h1 className="text-4xl text-center">{area}</h1>
      <div className="bg-gray-200 h-0.5 w-full"> </div>

      {/* 時間過濾按鈕 */}
      <div className="flex justify-end gap-4 my-6 w-full">
        <TimeFilterButton
          label="所有行程"
          active={timeFilter === 'all'}
          onClick={() => setTimeFilter('all')}
        />
        <TimeFilterButton
          label="即將到來"
          active={timeFilter === 'upcoming'}
          onClick={() => setTimeFilter('upcoming')}
        />
        <TimeFilterButton
          label="未來一個月"
          active={timeFilter === 'month'}
          onClick={() => setTimeFilter('month')}
        />
      </div>

      <div className="flex flex-wrap gap-x-[25px] gap-y-[60px] justify-center">
        {filteredCards?.map((card: any, i: number) => {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <TourCard
                // key={i}
                title={card.title}
                description={card.Article?.title}
                avatar={`${AVATAR_PATH}/${card.User.avatar}`}
                user_name={card.User.nickname}
                image={
                  card.Images?.[0]
                    ? `${IMAGE_PATH}/itineraries_photo/${card.Images?.[0].imageName}`
                    : '/istockphoto-1209191587-612x612.jpg'
                }
                onClick={() =>
                  router.push(
                    `/grabgroup/team-up-info/${card.id}?userId=${card.User.id}`
                  )
                }
              />
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
