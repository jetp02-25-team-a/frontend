'use client';

import TripItemCard from './TripItemCard';
import AddPlaceButton from './AddPlaceButton';

interface TripPlace {
  name: string;
  address?: string;
  image?: string;
  time?: string;
}

interface TripDayProps {
  dayNumber: number;
  date: string;
  places: TripPlace[];
}

export default function TripDay({ dayNumber, date, places }: TripDayProps) {
  return (
    <section className="flex flex-col items-center gap-3 w-full">
      {/* 標題：第 X 天 ｜ 日期 */}
      <div className="w-full">
        <h3 className="text-xl font-bold text-gray-800">{`第${dayNumber}天`}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>

      {/* 行程節點列表（像組長 NodeCard 那樣垂直排） */}
      {places.length > 0 ? (
        places.map((place, idx) => (
          <div key={idx} className="w-full flex flex-col items-center">
            <TripItemCard
              title={place.name}
              address={place.address || '尚未填寫地址'}
              image={place.image || '/covers/default.jpg'}
              startTime={place.time || '09:00'}
              endTime={place.time || '10:00'}
              durationText="約 1 小時"
            />
            {/* 下面那條直線 */}
            {idx !== places.length - 1 && (
              <div className="bg-gray-400 w-[2px] h-10 my-2 rounded-full" />
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 w-full">
          目前尚無行程項目，先加一些景點或住宿吧！
        </p>
      )}

      {/* 最底：加入行程 / 加入住宿（仿組長樣式的兩顆圓圈） */}
      <div className="flex gap-10 mt-2">
        <AddPlaceButton label="加入行程" onClick={() => alert('加入行程')} />
        <AddPlaceButton label="加入住宿" onClick={() => alert('加入住宿')} />
      </div>
    </section>
  );
}
