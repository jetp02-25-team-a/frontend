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
import { addTimeWrap } from '../utils';
import AddItineraryButton from './_components/addItinerary-button';
import Iframe from './_components/iframe';
import { useFetch } from '@/hooks/useFetch';

const data = [
  {
    id: 1,
    date: '2025-10-25',
    start_time: '09:00:00',
    nodes: [
      {
        id: 1,
        image: '/image.png',
        title: '台北一日遊',
        duration_minute: '01:15:00',
        address: '110臺北市信義區市府路45 號',
      },
      {
        id: 2,
        image: '/image.png',
        title: '台北2日遊',
        duration_minute: '01:15:00',
        address: '110臺北市信義區市府路45 號',
      },
      {
        id: 3,
        image: '/image.png',
        title: '台北2日遊',
        duration_minute: '06:00:00',
        address: '110臺北市信義區市府路45 號',
      },
    ],
  },
  {
    id: 2,
    date: '2025-10-26',
    start_time: '10:00:00',
    nodes: [
      {
        id: 1,
        image: '/image.png',
        title: '台北一日遊',
        duration_minute: '01:15:00',
        address: '110臺北市信義區市府路45 號',
      },
      {
        id: 2,
        image: '/image.png',
        title: '台北2日遊',
        duration_minute: '01:15:00',
        address: '110臺北市信義區市府路45 號',
      },
      {
        id: 3,
        image: '/image.png',
        title: '台北2日遊',
        duration_minute: '06:00:00',
        address: '110臺北市信義區市府路45 號',
      },
    ],
  },
  { id: 3, date: '2025-10-27', start_time: '09:30:00' },
  { id: 4, date: '2025-10-28', start_time: '09:30:00' },
  { id: 5, date: '2025-10-29', start_time: '09:30:00' },
];

interface MyNode {
  id: number;
  image: string;
  title: string;
  duration_minute: string;
  address: string;
  start_time: string;
  end_time: string;
}
interface Node {
  id: number;
  itineraryDayId: number;
  durationMinutes: string;
  googleMapPlaceId: string;
}
interface StayNode {
  id: number;
  itineraryDayId: number;
  accommodationId: number;
}

interface DayWithNodes {
  Nodes: Node[];
  StayNodes: StayNode[];
  dayDate: string;
  id: number;
  itineraryId: number;
  startTime: string;
  status: number;
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

  const [days, setDays] = useState<DayWithNodes[]>([]);
  const [iframeDayData, setIframeDayData] = useState<number>(0);

  const itineraryId = 22;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/detail?itineraryId=${itineraryId}`;
  const { data, loading, error, refetch } = useFetch(url);

  useEffect(() => {
    console.log('data=>', data);
    if (data && data.success) {
      const datas = data.data;
      setDays(datas);
    }
    // const newData = data.map((day) => ({
    //   ...day,
    //   nodes: day.nodes?.reduce(
    //     (acc, node, idx) => {
    //       const start_time = idx === 0 ? day.start_time : acc[idx - 1].end_time;
    //       const end_time = addTimeWrap(start_time, node.duration_minute);
    //       acc.push({ ...node, start_time, end_time });
    //       return acc; // 給下一輪使用
    //     },
    //     [] as (MyNode & { start_time: string; end_time: string })[]
    //   ),
    // }));
    // setDays(newData);
  }, [data]);
  // 控制iframe顯示
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  // 這個函式會傳給子組件
  const handleIframeVisible = (show: boolean) => {
    setIsIframeVisible(show);
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
              {days.map((day: any, index: number) => {
                return (
                  <DayCard key={day.id} id={index + 1} date={day.dayDate} />
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
            {days.map((day, index) => {
              return (
                <div className="flex flex-col items-center gap-3.5" key={index}>
                  <div className="w-full">
                    <h3 className="text-start text-[24px]">{`第${index + 1}天`}</h3>
                    {/* <p className="text-start text-base">{day.dayDate}</p>
                    <p className="text-start text-base">{day.id}</p> */}
                  </div>

                  {/* {day.Nodes.map((node, index) => {
                    return (
                      <div key={index} className="w-full">
                        <NodeCard
                          image={node.image}
                          duration_minute={node.duration_minute}
                          title={node.title}
                          address={node.address}
                          start_time={node.start_time?.slice(0, 5)}
                          end_time={node.end_time?.slice(0, 5)}
                        />
                        <div className="bg-gray-600 w-1 h-[43px] m-auto"></div>
                      </div>
                    );
                  })} */}

                  {/* {day.nodes?.map((node, index) => {
                    return (
                      <div key={index} className="w-full">
                        <NodeCard
                          image={node.image}
                          duration_minute={node.duration_minute}
                          title={node.title}
                          address={node.address}
                          start_time={node.start_time?.slice(0, 5)}
                          end_time={node.end_time?.slice(0, 5)}
                        />
                        <div className="bg-gray-600 w-1 h-[43px] m-auto"></div>
                      </div>
                    );
                  })} */}
                  {/* add btn  */}
                  <div className="flex gap-[30px]">
                    <AddItineraryButton
                      icon={faPlus}
                      btn_name="加入行程"
                      onClick={() => {
                        setIframeDayData(day.id);
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
          {isIframeVisible && (
            <Iframe
              visible={isIframeVisible}
              dayData={iframeDayData}
              onSend={handleIframeVisible}
            />
          )}
        </div>
      </div>
    </>
  );
}
