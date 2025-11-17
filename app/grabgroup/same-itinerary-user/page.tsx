'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import InfoButton from './_components/InfoButton';
import RegularButton from '@/components/ui/regular-button';
export default function SameItineraryUserPage() {
  const [flipped, setFlipped] = useState(false);

  // 假資料，請替換成實際 API 或 props
  const userA = {
    avatar: '/avatar.png',
    nickname: '小明',
    intro: '喜歡戶外活動，熱愛旅行。',
    places: ['台北101', '日月潭', '墾丁'],
  };
  const userB = {
    avatar: '/avatar.png',
    nickname: '小美',
    intro: '美食控，喜歡探索新景點。',
    places: ['高雄美術館', '阿里山', '九份'],
  };
  return (
    <div className="h-full py-4 flex items-center justify-center bg-linear-to-br from-pink-100 via-blue-100 to-purple-100">
      <div className="flex gap-8 items-center p-10 rounded-2xl shadow-2xl bg-white/80 backdrop-blur-md">
        {/* 使用者A卡片 */}
        <motion.div
          className="flex flex-col items-center w-80 border p-8 rounded-xl bg-white shadow-lg hover:shadow-pink-200 transition-shadow duration-300"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4">
            <img
              src={userA.avatar}
              alt="頭像A"
              className="w-24 h-24 rounded-full border-4 border-pink-300 shadow-lg"
            />
            <span className="absolute -bottom-2 right-2 w-6 h-6 bg-pink-200 rounded-full blur-sm opacity-60"></span>
          </div>
          <h2 className="text-2xl font-extrabold text-pink-600 mb-2 tracking-wide">
            {userA.nickname}
          </h2>
          <InfoButton button_name="個人檔案" />
          <p className="text-gray-500 mb-4 text-center">{userA.intro}</p>
          <RegularButton
            content="加好友"
            mode="solid"
            onClick={() => {
              if (addFriend) addFriend(id);
            }}
          />
          <div className="w-full">
            <span className="font-semibold text-pink-500">去過地點：</span>
            <ul className="list-disc ml-6 mt-2 space-y-1 border-t pt-2 border-pink-100">
              {userA.places.map((place, idx) => (
                <li key={idx} className="text-gray-700">
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        {/* 配對icon（emoji） */}
        {/* <div className="flex flex-col items-center">
          <span className="text-4xl mb-2 animate-bounce">❤️</span>
          <span className="text-pink-500 font-bold">配對成功</span>
        </div> */}
        {/* 使用者B卡片 */}
        <motion.div
          className="flex flex-col items-center w-80 border p-8 rounded-xl bg-white shadow-lg hover:shadow-purple-200 transition-shadow duration-300"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-4">
            <img
              src={userB.avatar}
              alt="頭像B"
              className="w-24 h-24 rounded-full border-4 border-purple-300 shadow-lg"
            />
            <span className="absolute -bottom-2 right-2 w-6 h-6 bg-purple-200 rounded-full blur-sm opacity-60"></span>
          </div>
          <h2 className="text-2xl font-extrabold text-purple-600 mb-2 tracking-wide">
            {userB.nickname}
          </h2>
          <p className="text-gray-500 mb-4 text-center">{userB.intro}</p>
          <div className="w-full">
            <span className="font-semibold text-purple-500">去過地點：</span>
            <ul className="list-disc ml-6 mt-2 space-y-1 border-t pt-2 border-purple-100">
              {userB.places.map((place, idx) => (
                <li key={idx} className="text-gray-700">
                  {place}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
