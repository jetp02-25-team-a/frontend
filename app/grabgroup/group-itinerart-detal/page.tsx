'use client';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayCard from './_components/DayCard';
import { useRef } from 'react';

const data = [
  { id: 1, date: '2025-10-25', start_time: '09:00:00' },
  { id: 2, date: '2025-10-26', start_time: '10:00:00' },
  { id: 3, date: '2025-10-27', start_time: '09:30:00' },
  { id: 4, date: '2025-10-28', start_time: '09:30:00' },
  { id: 5, date: '2025-10-29', start_time: '09:30:00' },
];
export default function GroupItineraryDetalPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'pre' | 'next') => {
    if (!scrollRef) return;
    const scrollAmount = 90;
    scrollRef.current?.scrollBy({
      left: direction === 'pre' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* map_area */}
      <div className="grid grid-cols-[40%_60%]">
        <div className="bg-gray-200 p-[15px] space-y-3.5">
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
        </div>
        <div className="bg-amber-700">bbb</div>
      </div>
    </>
  );
}
