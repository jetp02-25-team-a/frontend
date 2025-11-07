'use client';

import { useEffect, useState } from 'react';
import TourCard from './_components/tour-card';
import { useFetch } from '../../../hooks/useFetch';
import AreaButton from './_components/area-button';
import { ItineraryAreaCard } from '../_types/itineraryTypes';
import { useRouter } from 'next/navigation';
export default function TeamUpPage() {
  const [area, setArea] = useState('新北市');
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/area?area=${area}`;
  const { data, loading, error, refetch } = useFetch(url);
  const [cards, setCards] = useState<ItineraryAreaCard[]>();

  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [area]);
  useEffect(() => {
    if (data?.data) setCards(data.data);
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
          area_name="桃園"
          active={area === '桃園' ? true : false}
          onClick={() => setArea('桃園')}
        />
        <AreaButton
          image="/hsinchu.png"
          area_name="新竹市"
          active={area === '新竹市' ? true : false}
          onClick={() => setArea('新竹市')}
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
      <div className="flex flex-wrap gap-x-[25px] gap-y-[60px] justify-center">
        {cards?.map((card: any, i: number) => {
          return (
            <TourCard
              key={i}
              title={card.title}
              description={card.Article?.title}
              avatar="https://randomuser.me/api/portraits/women/20.jpg"
              user_name={card.User.nickname}
              image="https://www.travel.taipei/image/216608/?r=1625036397904"
              onClick={() =>
                router.push(
                  `/grabgroup/team-up-info/${card.id}?userId=${card.User.id}`
                )
              }
            />
          );
        })}
        {/* {itineraryAreaCards?.map((card: Card, index: number) => {
          return (
            <TourCard
              key={index}
              title={card.title}
              description="探索台北地標，品味信義區美食。"
              avatar="https://randomuser.me/api/portraits/women/20.jpg"
              user_name={card.User.nickname}
              image="https://www.travel.taipei/image/216608/?r=1625036397904"
            />
          );
        })} */}
      </div>
    </>
  );
}
