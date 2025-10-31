'use client';

import InfoButton from './_components/InfoButton';
import JoinButton from '@/components/ui/join-button';
import { addTimeWrap } from '../utils';
import { useState } from 'react';
import Map from './_components/GoogleMap';
import MessageBox from './_components/MessageBox';
import ResponseBox from './_components/ResponseBox';

const data = {
  brigade_images: [
    { 1: 'image.png' },
    { 2: 'image.png' },
    { 3: 'image.png' },
    { 4: 'image.png' },
  ],
  brigade_holder_name: 'Ellen Lambert',
  brigade_holder_avatar: '/avatar.png',
  join_persons: [
    { id: 1, user_name: 'Ellen Lambert', avatar: 'avatar.png' },
    { id: 2, user_name: 'Ellen Lambert', avatar: 'avatar.png' },
    { id: 3, user_name: 'Ellen Lambert', avatar: 'avatar.png' },
  ],
  brigade_title: '台北一日遊',
  brigade_content:
    '想用一天認識台北，這趟行程帶你從城市的歷史出發，走進文化、自然與美食交織的日常。早晨在龍山寺感受老台北的信仰與香火氣息，午間轉進西門町與永康街，體驗最地道的街頭美食與年輕活力。午後前往中正紀念堂，感受莊嚴與設計之美，最後登上象山步道，用一場夕陽遠眺，為這趟台北小旅行畫下完美句點。這不是走馬看花的觀光，而是一場在地生活的輕旅行——用一天時間，品味台北的舊情懷與新節奏。',
  brigade_subtitle: '???',
  brigade_subcontent: 'xxxx',
  //brigade_starttime: "2025-10-21 09:30:00", //???有存在必要？應該以第一個節點做開頭算吧？
  brigade_days: [
    {
      date: '2025-10-21',
      start_time: '09:30:00',
      nodes: [
        {
          id: 1,
          name: '台北101',
          itinerarie_time: '01:30:00',
          latitude: 25.033,
          longitude: 121.5654,
        },
        {
          id: 2,
          name: '台北圓山',
          itinerarie_time: '02:30:00',
          latitude: 25.034,
          longitude: 121.566,
        },
      ],
    },
    {
      date: '2025-10-22',
      start_time: '10:00:00',
      nodes: [
        {
          id: 1,
          name: '台北101',
          itinerarie_time: '01:00:00',
          latitude: 25.033,
          longitude: 121.5654,
        },
        {
          id: 2,
          name: '台北圓山',
          itinerarie_time: '04:30:00',
          latitude: 25.034,
          longitude: 121.566,
        },
      ],
    },
  ],
};

const messageData = [
  {
    id: 1,
    avatar: 'avatar.png',
    user_name: '林宥辰',
    content: '這個行程看起來超棒！特別喜歡晚上爬象山看夕陽的安排，想報名～😊',
    create_at: '2025-10-22 14:08',
  },
  {
    id: 2,
    avatar: 'avatar.png',
    user_name: '陳佳穎',
    content:
      '行程內容超詳盡，能不能多放一些美食推薦？另外照片能再多一些角度嗎？',
    create_at: '2025-10-20 09:32',
  },
];

const googleMapNode = {};

export default function TeamUpInfoPage() {
  const [baseTime, setBaseTime] = useState(data.brigade_days[0].start_time);
  const [mapPoint, setMapPoint] = useState({
    latitude: 25.033,
    longitude: 121.5654,
  });
  return (
    <>
      <div className="flex flex-col gap-[30px] items-center py-[64px]">
        <h1 className="text-4xl">行程頁面</h1>
        <div className="bg-gray-200 h-[2px] w-full"> </div>
        {/* image區 */}
        <div className="flex gap-4 relative">
          <img src="/image.png" className=" w-[770px] h-[510px]" />
          <div className="flex flex-col gap-4">
            <img src="/image.png" className="w-[510] h-[250px]" />
            <div className="flex gap-4">
              <img src="/image.png" className="w-[250px] h-[250px]" />
              <img src="/image.png" className="w-[250px] h-[250px]" />
            </div>
          </div>
          <button className="absolute rounded-full bg-[#05073C] text-white px-10 py-5 right-5 bottom-5 cursor-pointer">
            查看所有照片
          </button>
        </div>

        {/* 個人資訊 貼文內容 */}
        <section className="w-full px-[200px]">
          <div className=" flex justify-between">
            {/* 團主個人訊息 */}
            <div className="flex items-center gap-[20px]">
              <img src={data.brigade_holder_avatar} alt="" />
              <h3 className="text-xl">{data.brigade_holder_name}</h3>
              <InfoButton button_name="個人檔案" />
            </div>
            {/* 參與人數 */}
            <div className=" flex items-end gap-[30px]">
              <p className="text-lg">合計{data.join_persons.length}人</p>
              <div className="flex">
                {data.join_persons.map((v, i) => {
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
          </div>
        </section>

        {/* 揪團標題 文章 */}
        <section className="w-full px-[200px]">
          <h2 className="text-2xl">{data.brigade_title}</h2>
          <p className="text-base">{data.brigade_content}</p>
          <JoinButton className="mx-auto" content="加入我們" />
        </section>

        {/* 行程 */}
        <section className="bg-light-gray w-full  h-auto py-[64px]">
          <div className="px-[200px] grid grid-cols-2">
            {/* 行程區 */}
            <div className="overflow-auto">
              <h2 className="text-3xl h-[97px] flex items-center">活動流程</h2>
              {data.brigade_days.map((day: any, dayIndex) => {
                const baseTime = day.start_time;
                return (
                  <div key={dayIndex}>
                    {/* 天數開頭 */}
                    <div className="flex items-center gap-[15px]">
                      <div className="bg-orange-700 rounded-full w-[30px] h-[30px]"></div>
                      <h2>{`第${dayIndex + 1}天行程`}</h2>
                    </div>
                    <div className="ml-3.5 h-[30px] border-l-2 border-dashed border-amber-700"></div>
                    {/* nodes */}
                    <div>
                      {day.nodes.map((node: any, nodeIndex: number) => {
                        return (
                          <div key={nodeIndex}>
                            <div
                              className="flex gap-[15px] ml-1.5 items-center cursor-pointer"
                              onClick={() =>
                                setMapPoint({
                                  latitude: node.latitude,
                                  longitude: node.longitude,
                                })
                              }
                            >
                              <div className="border-3 border-amber-700 rounded-full w-[18px] h-[18px]"></div>
                              <p>
                                {nodeIndex === 0
                                  ? day.start_time
                                  : `${addTimeWrap(
                                      baseTime,
                                      day.nodes[nodeIndex - 1].itinerarie_time
                                    )}`}
                              </p>
                              <p>{node.name}</p>
                            </div>

                            {nodeIndex === day.nodes.length - 1 ? (
                              <div className="h-[30px]"></div>
                            ) : (
                              <div className="ml-3.5 h-[30px] border-l-2 border-dashed border-amber-700"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* map區 */}
            <div className="w-full mx-auto my-auto ">
              <Map
                latitude={mapPoint.latitude}
                longitude={mapPoint.longitude}
              />
            </div>
          </div>
        </section>
        {/* 留言區 */}
        <section className="w-full flex flex-col py-[64px] gap-[24px]">
          <h2 className="text-3xl text-left m-auot">留言區</h2>

          <div className="gap-y-[24px] flex flex-col items-center">
            {messageData.map((comment, index) => {
              return (
                <MessageBox
                  key={index}
                  avatar={`./${comment.avatar}`}
                  user_name={comment.user_name}
                  create_at={comment.create_at}
                  content={comment.content}
                />
              );
            })}
          </div>
          <ResponseBox />
        </section>
      </div>
    </>
  );
}
