'use client';
import Button from '../_components/Button';
import DatePicker from './_components/date-picker';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const user_friends = [
  { id: 1, avatar: '/avatar.png' },
  { id: 2, avatar: '/avatar.png' },
  { id: 3, avatar: '/avatar.png' },
];

export default function CreateGroupItineraryPage() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <main className="w-full flex flex-col items-center py-16 gap-[30px]">
      <h1 className="text-4xl text-center">行程頁面</h1>

      <div className="w-[920px]">
        <div className="w-full flex">
          <button
            className={`w-full py-2.5 border-l-2 border-gray-300 ${pathname.startsWith('/grabgroup/create-group-itinerary') ? '' : 'text-white yellow-orange '}`}
          >
            私人行程
          </button>
          <button
            className={`w-full py-2.5 ${pathname.startsWith('/grabgroup/???') ? '' : 'text-white yellow-orange '}`}
          >
            揪團行程
          </button>
        </div>
        <div className="px-8 py-[28px border-gray-300 border-l-2 border-r-2 border-b-2 rounded-bl-2xl rounded-br-2xl  space-y-10 py-7 px-8">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-3xl text-center">開始設定您的活動行程</h2>
            <p className="text-base text-center">
              編輯你們想去的景點和規劃你的行程
            </p>
          </div>

          <label htmlFor="">制定活動名稱</label>
          <input
            type="text"
            placeholder="輸入"
            className="border-1 border-gray-300 w-full rounded-sm px-[12px] py-[4px]"
          />
          <label htmlFor="">參加人數上限</label>
          <input
            type="number"
            max={8}
            className="border-1 border-gray-300 w-full rounded-sm px-[12px] py-[4px]"
          />
          <div className="w-full flex justify-end gap-[8px]">
            {/* 使用者的好友 */}
            <div className=" flex items-end gap-[30px]">
              <div className="flex">
                {user_friends.map((v, i) => {
                  return (
                    <img
                      key={i}
                      src={v.avatar}
                      className="w-[50px] h-[50px] object-cover border-2 border-white rounded-full -ml-5"
                    />
                  );
                })}
              </div>
            </div>

            <Button content="邀請好友" />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="">活動時間</label>
            <DatePicker />
          </div>
          <div className="flex justify-center gap-[21px]">
            <Button content="回上一步" onClick={() => router.back()} />

            <Link href="/grabgroup/group-itinerart-detal">
              <Button content="下一步" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
