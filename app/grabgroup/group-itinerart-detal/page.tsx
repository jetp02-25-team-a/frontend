'use client';
import {
  faChevronLeft,
  faChevronRight,
  faHouse,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayCard from './_components/day-card';
import { useEffect, useRef, useState, useMemo } from 'react';
import NodeCard from './_components/node-card';

import AddItineraryButton from './_components/addItinerary-button';
import PlacePanel from './_components/place-panel';
import { useFetch } from '@/hooks/useFetch';

import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import { ItineraryContextType, ItineraryData } from '../_types/itineraryTypes';
import Map from '../_components/GoogleMap';

import { addDays, addMinutes } from 'date-fns';
import { ItineraryEditor } from '../_components/ItineraryEditor';
import { useSearchParams } from 'next/navigation';

export interface mapPoint {
  latitude: number; //預設台北101
  longitude: number;
}

export default function GroupItineraryDetalPage() {
  const params = useSearchParams().get('itineraryId');
  const itineraryId = params;
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
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  //設定經緯度 預設101
  const [mapPoint, setMapPoint] = useState<mapPoint>({
    latitude: 25.033964,
    longitude: 121.564468,
  });
  //日期bar 用來顯示點選的天
  const [activeId, setActiveId] = useState<number>(0);

  const { itineraryData, setItineraryData } = useItinerary(); //公共

  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/detail?itineraryId=${itineraryId}`;
  const { data, error, refetch } = useFetch(url);

  useEffect(() => {
    if (data && data.success) {
      const datas = data.data;
      setItineraryData((prev) => [...datas]); //設定context
    }
  }, [data]);

  //日期自動往前補
  const normalizeDays = (days: ItineraryData[]): ItineraryData[] => {
    return days.map((d, i) => {
      if (i === 0) return d;
      const prevDay = new Date(days[i - 1].dayDate);
      return { ...d, dayDate: addDays(prevDay, 1).toISOString() };
    });
  };

  //公共資料更新後刷新
  useEffect(() => {
    console.log('itineraryData=>', itineraryData);
    // if (itineraryData) setDays(itineraryData);
    let newItineraryData: ItineraryData[] = [];
    if (itineraryData) {
      newItineraryData = normalizeDays(itineraryData);
    }
    if (JSON.stringify(newItineraryData) !== JSON.stringify(itineraryData)) {
      setItineraryData(newItineraryData);
    }
  }, [itineraryData]);

  // 控制iframe顯示
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  // 這個函式會傳給子組件
  const handleIframeVisible = (show: boolean) => {
    setIsIframeVisible(show);
  };

  const handleAddNode = (dayId: number, nodeData: any) => {
    console.log('nodeData', itineraryData);
    setItineraryData((prev) => {
      return prev.map((d, index) => {
        if (index === dayId) {
          return {
            ...d,
            Nodes: [...d.Nodes, nodeData],
          };
        }
        return d;
      });
    });
  };

  return (
    <>
      <ItineraryEditor itineraryData={itineraryData} />
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
              {itineraryData &&
                itineraryData.map((day: any, index: number) => {
                  return (
                    <DayCard
                      key={index}
                      id={index + 1}
                      date={day.dayDate}
                      // date={dayTime}
                      active={activeId === index ? true : false}
                      onClick={() => setActiveId(index)}
                      onDelete={() => {
                        const newItineraryData = itineraryData.filter(
                          (d, i) => i !== index
                        );
                        setItineraryData(newItineraryData);
                      }}
                    />
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
              onClick={() => {
                const lastDay = itineraryData?.at(-1); // ES2022 新語法，取最後一個元素
                let dayString = new Date().toISOString(); // 假日期
                if (lastDay)
                  dayString = addDays(
                    new Date(lastDay.dayDate),
                    1
                  ).toISOString(); // 加一天
                //創建新天的資料
                const newDay = {
                  id: (itineraryData?.length ?? 0) + 1,
                  itineraryId: Number(itineraryId),
                  dayDate: dayString,
                  startTime: lastDay?.startTime ?? '2025-11-06T08:53:23.234Z',
                  Nodes: [],
                  StayNodes: [],
                };
                if ((itineraryData?.length ?? 0) >= 7) return;
                setItineraryData((prev) => [...(prev ?? []), newDay]);
              }}
            >
              新增
            </button>
          </div>

          {/* 顯示node區域 */}
          <div>
            {/* 顯示所有天數 */}

            {itineraryData &&
              itineraryData.map((day, index) => {
                let tmpTime = day.startTime;
                if (index !== activeId) return;
                return (
                  <div
                    className="flex flex-col items-center gap-3.5"
                    key={index}
                  >
                    <div className="w-full">
                      <h3 className="text-start text-[24px]">{`第${index + 1}天`}</h3>
                      {/* {itineraryData[0].startTime} */}
                      {/* <p className="text-start text-base">{day.dayDate}</p>
                    <p className="text-start text-base">{day.id}</p> */}
                    </div>

                    {/* 節點區 */}
                    {day.Nodes.map((node, nodeIndex) => {
                      let start;
                      let end;
                      if (nodeIndex === 0) {
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
                        <div key={nodeIndex} className="w-full">
                          <NodeCard
                            image={node.Place.image}
                            duration_minute={node.durationMinutes}
                            title={node.Place.nameZh}
                            address={node.Place.addrFull}
                            start_time={start.toISOString()}
                            end_time={end.toISOString()}
                            dayIndex={index}
                            nodeIndex={nodeIndex}
                            onClick={() =>
                              setMapPoint({
                                latitude: node.Place.lat,
                                longitude: node.Place.lng,
                              })
                            }
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
                          console.log('down');
                          setCurrentDayIndex(index); //設置當天日期，使用陣列索引
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
          {/* googlemap */}
          <div className="w-full mx-auto my-auto ">
            <Map
              latitude={mapPoint.latitude}
              longitude={mapPoint.longitude}
              width={1000}
              height={1000}
            />
          </div>
          {/* 彈出視窗 */}
          {isIframeVisible && currentDayIndex !== null && (
            <div className="absolute inset-0 z-50 flex left-3 top-3">
              <PlacePanel
                visible={isIframeVisible}
                onSend={handleIframeVisible}
                currentId={currentDayIndex}
                onAddNode={handleAddNode}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
