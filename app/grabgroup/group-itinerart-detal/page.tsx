'use client';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayCard from './_components/DayCard';
import { useEffect, useRef, useState } from 'react';
import NodeCard from './_components/NodeCard';
import { addTimeWrap } from '../utils';

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
  start_time?: string;
  end_time?: string;
}

interface DayWithNodes {
  id: number;
  date: string;
  start_time: string;
  nodes?: MyNode[];
}

export default function GroupItineraryDetalPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  //處理滑動
  const scroll = (direction: 'pre' | 'next') => {
    if (!scrollRef) return;
    const scrollAmount = 90;
    scrollRef.current?.scrollBy({
      left: direction === 'pre' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const [days, setDays] = useState<DayWithNodes[]>([]);

  useEffect(() => {
    const newData = data.map((day) => ({
      ...day,
      nodes: day.nodes?.reduce(
        (acc, node, idx) => {
          const start_time = idx === 0 ? day.start_time : acc[idx - 1].end_time;

          const end_time = addTimeWrap(start_time, node.duration_minute);

          acc.push({ ...node, start_time, end_time });
          return acc; // 給下一輪使用
        },
        [] as (MyNode & { start_time: string; end_time: string })[]
      ),
    }));

    setDays(newData);
  }, []);

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
              {data.map((date_card, index) => {
                return (
                  <DayCard key={index} id={index + 1} date={date_card.date} />
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
            <button className="cursor-pointer text-white yellow-orange px-[30px] py-2.5">
              新增
            </button>
          </div>
          {/* 顯示node區域 */}
          <div className="flex flex-col items-center gap-3.5">
            {days.map((day, index) => {
              return (
                <>
                  <div className="w-full">
                    <h3 className="text-start text-[24px]">{`第${index + 1}天`}</h3>
                    <p className="text-start text-base">{day.date}</p>
                  </div>

                  {day.nodes?.map((node, index) => {
                    return (
                      <>
                        <NodeCard
                          key={index}
                          image={node.image}
                          duration_minute={node.duration_minute}
                          title={node.title}
                          address={node.address}
                          start_time={node.start_time?.slice(0, 5)}
                          end_time={node.end_time?.slice(0, 5)}
                        />
                        <div className="bg-gray-600 w-1 h-[43px]"></div>
                      </>
                    );
                  })}
                </>
              );
            })}
          </div>
        </div>
        {/* map_zone */}
        <div className="bg-amber-700">bbb</div>
      </div>
    </>
  );
}
