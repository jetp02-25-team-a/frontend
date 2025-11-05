'use client';
import { useRouter } from 'next/navigation';
import Button from './../_components/Button';
import { ItineraryContext } from '@/hooks/use-itinerart';
import { useState } from 'react';
import {
  ItineraryContextType,
  ItineraryData,
  Node,
  StayNode,
  GoogleMapPlace,
} from '../_types/itineraryTypes';

export default function GroupItineraryDetalPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState<ItineraryData[] | null>(
    null
  );

  return (
    <ItineraryContext.Provider value={{ itineraryData, setItineraryData }}>
      <div className="flex flex-col px-16 py-16 gap-[30px]">
        <div className="space-y-2.5">
          <h1 className="text-center text-4xl">設定揪團行程</h1>
          <p className="text-center text-base">
            編輯你們想去的景點和規劃你的行程
          </p>
        </div>

        <div className="flex gap-x-[21px] justify-center w-full">
          <Button content="回上一頁" onClick={() => router.back()} />
          <Button content="下一頁" />
        </div>
        {children}
      </div>
    </ItineraryContext.Provider>
  );
}
