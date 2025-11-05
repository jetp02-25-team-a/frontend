'use client';
import {
  faChevronLeft,
  faChevronRight,
  faHouse,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayCard from './_components/day-card';
import { useEffect, useRef, useState } from 'react';
import NodeCard from './_components/node-card';
import { addTimeWrap } from '../utils';
import AddItineraryButton from './_components/addItinerary-button';
import PlacePanel from './_components/place-panel';
import { useFetch } from '@/hooks/useFetch';
import { useContext } from 'react';
import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import {
  ItineraryContextType,
  ItineraryData,
  Node,
  StayNode,
  GoogleMapPlace,
} from '../_types/itineraryTypes';
import { id } from 'date-fns/locale';
import { addMinutes } from 'date-fns';

// interface MyNode {
//   id: number;
//   image: string;
//   title: string;
//   duration_minute: string;
//   address: string;
//   start_time: string;
//   end_time: string;
// }
// interface Node {
//   id: number;
//   itineraryDayId: number;
//   durationMinutes: string;
//   googleMapPlaceId: string;
// }
// interface StayNode {
//   id: number;
//   itineraryDayId: number;
//   accommodationId: number;
// }

// interface DayWithNodes {
//   Nodes: Node[];
//   StayNodes: StayNode[];
//   dayDate: string;
//   id: number;
//   itineraryId: number;
//   startTime: string;
//   status: number;
// }

export default function GroupItineraryDetalPage() {
  //處理滑動
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'pre' | 'next') => {
    if (!scrollRef) return;
    const scrollAmount = 90;
    scrollRef.current?.scrollBy({
      left: direction === 'pre' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };
  //state-------------------
  const [days, setDays] = useState<ItineraryData[]>([]);
  // const [iframeDayData, setIframeDayData] = useState<number>(0);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  // const [tmpTime, setTmpTime] = useState<string>('');

  const { itineraryData, setItineraryData } = useItinerary(); //公共

  const itineraryId = 22;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/detail?itineraryId=${itineraryId}`;
  const { data, loading, error, refetch } = useFetch(url);

  useEffect(() => {
    if (data && data.success) {
      const datas = data.data;
      setItineraryData((prev) => [...datas]); //設定context

      setDays(datas);
    }
  }, [data]);

  //公共資料更新後刷新
  useEffect(() => {
    if (itineraryData) setDays(itineraryData);
  }, [itineraryData]);

  // 控制iframe顯示
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  // 這個函式會傳給子組件
  const handleIframeVisible = (show: boolean) => {
    setIsIframeVisible(show);
  };

  return (
    <>
      {/* map_area */}
      <div className="grid grid-cols-[40%_60%] h-screen">
        {/* area_zone */}
        <div className="bg-gray-200 p-[15px] space-y-3.5 overflow-scroll">
          <h3 className="text-3xl">行程</h3>
          {/* date_bar area */}
          <div className="flex w-full ">
            <div
              className="bg-white border  border-gray-300 flex items-center px-2.5 rounded-tl-xl rounded-bl-xl"
              onClick={() => scroll('pre')}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <div
              className="flex bg-gray-400 w-full  overflow-x-auto scrollbar-hide"
              ref={scrollRef}
            >
              {days.map((day: any, index: number) => {
                return (
                  <DayCard key={index} id={index + 1} date={day.dayDate} />
                );
              })}
            </div>
            <div
              className="bg-white border  border-gray-300 flex items-center px-2.5 rounded-tr-xl rounded-br-xl"
              onClick={() => {
                scroll('next');
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
          <div className="flex gap-[37px] justify-end items-center">
            <p className="text-gray-600">活動天數上限為7天</p>
            <button
              className="cursor-pointer text-white yellow-orange px-[30px] py-2.5"
              onClick={() => {}}
            >
              新增
            </button>
          </div>
          {/* 顯示node區域 */}
          <div>
            {days.map((day, index) => {
              let tmpTime = day.startTime;
              return (
                <div className="flex flex-col items-center gap-3.5" key={index}>
                  <div className="w-full">
                    <h3 className="text-start text-[24px]">{`第${index + 1}天`}</h3>
                    {/* {itineraryData[0].startTime} */}
                    {/* <p className="text-start text-base">{day.dayDate}</p>
                    <p className="text-start text-base">{day.id}</p> */}
                  </div>

                  {/* 節點區 */}
                  {day.Nodes.map((node, dayIndex) => {
                    let start;
                    let end;
                    if (dayIndex === 0) {
                      start = new Date(tmpTime); //為第一個設定開始時間為最開始時間
                      end = addMinutes(start, node.durationMinutes); //結束時間設定為開始＋時長度
                      tmpTime = end.toISOString(); //在將暫存時間設定為end時間提供下一次作為開始時間讀取
                    } else {
                      start = new Date(tmpTime);
                      end = addMinutes(start, node.durationMinutes); //結束時間設定為開始＋時長度
                      tmpTime = end.toISOString(); //在將暫存時間設定為end時間提供下一次作為開始時間讀取
                    }

                    // const end = addMinutes(start, node.durationMinutes);
                    return (
                      <div key={dayIndex} className="w-full">
                        <NodeCard
                          image={node.GoogleMapPlace.photoReference}
                          duration_minute={node.durationMinutes}
                          title={node.GoogleMapPlace.name}
                          address={node.GoogleMapPlace.formattedAddress}
                          start_time={start.toISOString()}
                          end_time={end.toISOString()}
                        />
                        <div className="bg-gray-600 w-1 h-[43px] m-auto"></div>
                      </div>
                    );
                  })}

                  {/* add btn  */}
                  <div className="flex gap-[30px]">
                    <AddItineraryButton
                      icon={faPlus}
                      btn_name="加入行程"
                      onClick={() => {
                        setCurrentDayIndex(day.id);
                        setIsIframeVisible(true);
                      }}
                    />
                    <AddItineraryButton icon={faHouse} btn_name="加入住宿" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ------------------------------------------- */}
        {/* map_zone */}
        <div className="bg-amber-700 relative">
          {isIframeVisible && currentDayIndex && (
            <PlacePanel
              visible={isIframeVisible}
              onSend={handleIframeVisible}
              currentId={currentDayIndex}
            />
          )}
        </div>
      </div>
    </>
  );
}
