'use client';
import { useState } from 'react';
import AreaButton from './_components/AreaButton';
import TourCard from './_components/TourCard';
export default function TeamUpPage() {
  const [area, setArea] = useState('taipeicity');

  return (
    <>
      <div className="w-full flex justify-center gap-[50px]">
        <AreaButton
          image="/istockphoto-1209191587-612x612.jpg"
          area_name="台北市"
          active={area === 'taipeicity' ? true : false}
          onClick={() => setArea('taipeicity')}
        />
        <AreaButton
          image="/newTaipeiCity.png"
          area_name="新北市"
          active={area === 'newtaipeicity' ? true : false}
          onClick={() => setArea('newtaipeicity')}
        />
        <AreaButton
          image="/taoyuan.png"
          area_name="桃園"
          active={area === 'taoyuan' ? true : false}
          onClick={() => setArea('taoyuan')}
        />
        <AreaButton
          image="/hsinchu.png"
          area_name="新竹市"
          active={area === 'hsinchu' ? true : false}
          onClick={() => setArea('hsinchu')}
        />
        <AreaButton
          image="/kaohsiung.png"
          area_name="高雄市"
          active={area === 'kaohsiung' ? true : false}
          onClick={() => setArea('kaohsiung')}
        />
      </div>
      <h1 className="text-4xl text-center">台北市</h1>
      <div className="bg-gray-200 h-[2px] w-full"> </div>
      <div className="flex flex-wrap gap-x-[25px] gap-y-[60px] justify-center">
        {[...Array(5)].map((v, i) => {
          return (
            <TourCard
              key={i}
              title="台北101半日遊"
              description="探索台北地標，品味信義區美食。"
              avatar="https://randomuser.me/api/portraits/women/20.jpg"
              user_name="小美"
              image="https://www.travel.taipei/image/216608/?r=1625036397904"
            />
          );
        })}
      </div>
    </>
  );
}
