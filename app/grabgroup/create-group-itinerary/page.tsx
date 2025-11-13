'use client';
import { useEffect, useState } from 'react';
import Button from '../_components/Button';
import DatePicker from './_components/date-picker';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useFetch } from '@/hooks/useFetch';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AVATAR_PATH } from '../../config/image-path';
import { API_SERVER } from '../../config/api-path';
import { useAuth } from '../../../hooks/use-Auth';

interface User {
  avatar?: string;
  id: number;
  nickname: string;
}

interface Time {
  startDate?: string;
  endDate?: string;
}

export default function CreateGroupItineraryPage() {
  const [time, setTime] = useState<Time>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  //上一頁來的參數
  const destination = searchParams.get('destination');

  const token = localStorage.getItem('BackpackUserInfo');
  let newToken: string;
  if (token) {
    newToken = 'Bearer ' + JSON.parse(token).token;
  }
  const { user } = useAuth();
  useEffect(() => {
    //設定開始時間
    const startDate = searchParams.get('startDate')?.split('T')[0];
    if (startDate) {
      setTime((prev) => ({ ...(prev || {}), startDate: startDate }));
    }
  }, []);

  //處理回傳的值
  const handleDateChange = (dates: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    console.log('子元件回傳的日期:', dates);
    setTime({
      startDate: dates.startDate ?? '',
      endDate: dates.endDate ?? '',
    });
  };

  const people = searchParams.get('people');

  const [itineraryTitle, setItineraryTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [showFriends, setShowFriends] = useState<boolean>(false);
  const [peopleMax, setPeopleMax] = useState<number>(people ? +people : 0);

  const getFirendsUrl = `${API_SERVER}/friendships`;
  const { data, loading, error, refetch } = useFetch(getFirendsUrl);
  const [friendData, setFriendDate] = useState<User[]>();

  useEffect(() => {
    if (showFriends) refetch();
  }, [showFriends]);

  useEffect(() => {
    if (data && data.success) setFriendDate(data.data);
  }, [data]);

  const backend = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}`;

  const [pendingInvites, setPendingInvites] = useState<number[]>([]); // 儲存好友ID
  const [inviteBtnState, setInviteBtnState] = useState<boolean>(true); // 依照狀態改變是否取消邀請
  return (
    <main className="w-full flex flex-col items-center py-16 gap-[30px]">
      <h1 className="text-4xl text-center">行程頁面</h1>

      <p>目的地：{destination}</p>
      {/* <p>
        開始時間：{startDate ? new Date(startDate).toLocaleString() : '未選擇'}
      </p> */}
      <p>目前人數：{people}</p>

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

          <label htmlFor="">制定活動名稱:</label>
          <input
            type="text"
            placeholder="輸入"
            className="border-1 border-gray-300 w-full rounded-sm px-[12px] py-[4px]"
            value={itineraryTitle}
            onChange={(e) => setItineraryTitle(e.target.value)}
          />
          <label htmlFor="">參加人數上限:</label>
          <input
            type="number"
            max={8}
            className="border border-gray-300 w-full rounded-sm px-3 py-1"
            value={peopleMax}
            onChange={(e) => {
              setPeopleMax(+e.target.value);
            }}
          />
          <label htmlFor="">每日開始時間：</label>
          <input
            type="time"
            placeholder="輸入"
            className="border border-gray-300 w-full rounded-sm px-3 py-1"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <div className="w-full flex justify-end gap-2 relative">
            {/* 使用者的好友 */}
            {friendData && (
              <div className="flex gap-3">
                <div className=" flex items-end gap-[30px]">
                  <div className="flex">
                    {/* 最多跑3個好友 */}
                    {friendData.slice(0, 3).map((friend, i) => {
                      return (
                        <Image
                          key={i}
                          width={77}
                          height={77}
                          src={
                            friend.avatar
                              ? `${AVATAR_PATH}${friend.avatar}`
                              : '/avatar.png'
                          }
                          alt=""
                          className="w-[50px] h-[50px] object-cover border-2 border-white rounded-full -ml-5"
                        />
                      );
                    })}
                  </div>
                </div>

                <Button
                  content="邀請好友"
                  onClick={() => setShowFriends(!showFriends)}
                />
              </div>
            )}

            {/* //取得所有好友 且發送邀請訊息 */}
            {showFriends && friendData && (
              <div className=" absolute bg-white border-2 border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex">
                  <p>邀請你的好友們</p>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="ml-auto"
                    onClick={() => setShowFriends(!showFriends)}
                  />
                </div>

                {friendData.map((friend: User, index: number) => {
                  return (
                    <div
                      key={index}
                      className="gap-2 flex items-center justify-between"
                    >
                      <Image
                        width={77}
                        height={77}
                        src={
                          friend.avatar
                            ? `${AVATAR_PATH}${friend.avatar}`
                            : '/avatar.png'
                        }
                        alt=""
                        className="w-[50px] h-[50px] object-cover border-2 border-white rounded-full shrink"
                      />
                      <p className="mr-5">{friend.nickname}</p>
                      <Button
                        // content="邀請"
                        content={
                          pendingInvites.includes(friend.id) ? '已邀請' : '邀請'
                        }
                        onClick={() => {
                          setPendingInvites((prev) =>
                            prev.includes(friend.id)
                              ? prev.filter((id) => id !== friend.id) //刪除
                              : [...prev, friend.id]
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="">活動時間</label>
            <DatePicker
              initialDates={time?.startDate ? [time.startDate] : []}
              onChange={handleDateChange}
            />
          </div>
          <div className="flex justify-center gap-[21px]">
            <Button content="回上一步" onClick={() => router.back()} />

            <Button
              content="下一步"
              onClick={async () => {
                const data = {
                  title: itineraryTitle,
                  area: destination || '',
                  startDay: time?.startDate || '',
                  endDay: time?.endDate || '',
                  startTime: startTime,
                  figure: peopleMax,
                };
                const url = `${API_SERVER}/itineraries/create-itinerary`;

                try {
                  const result = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: newToken,
                    },
                    body: JSON.stringify(data),
                  }).then((r) => r.json());
                  //需要拿到建立的行程id
                  if (result) {
                    console.log('result', result);
                    //對邀請清單的人發出邀請
                    const invitedUrl = `${API_SERVER}/itineraries/invite`;
                    // const { itineraryId, senderId, receiverId } = req.body;
                    pendingInvites.forEach(async (friendId) => {
                      const inviteData = {
                        itineraryId: result.itineraryId,
                        receiverId: friendId,
                        senderId: user.id,
                      };
                      try {
                        const inviteResult = await fetch(invitedUrl, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            // Authorization: newToken,
                          },
                          body: JSON.stringify(inviteData),
                        }).then((r) => r.json());
                        if (inviteResult && inviteResult.success) {
                          console.log(`成功邀請好友ID ${friendId} 加入行程`);
                        }
                      } catch (err) {
                        console.log(err);
                      }
                    });
                    router.push(
                      `/grabgroup/group-itinerary-detail?itineraryId=${result.itineraryId}`
                    );
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
