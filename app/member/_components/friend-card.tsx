'use client';

import Image from 'next/image';
import Button from '../../../components/ui/regular-button';
import { useState } from 'react';
import InfoButton from './InfoButton';
import RegularButton from '@/components/ui/regular-button';
import { API_SERVER } from '../../../config/api-path';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Attractin {
  id: number;
  name: string;
  image: string | null;
}

interface FriendCard {
  userId: number;
  avatar: string;
  name: string;
  description: string;
  address: string;
  overlappedAttractions: Attractin[];
}

export default function FriendCard({
  userId,
  avatar,
  name,
  description,
  address,
  overlappedAttractions,
}: FriendCard) {
  const handleAddFriend = async (id: number) => {
    // 加好友的邏輯（加入授權、錯誤處理與偵錯輸出）
    try {
      const url = `${API_SERVER}/friendships/add`;

      const token = localStorage.getItem('BackpackUserInfo');
      let auth;
      if (token) auth = 'Bearer ' + JSON.parse(token).token;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify({ friendId: id }),
      });

      if (!res.ok) {
        return;
      }

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error('addFriend error', err);
    }
  };
  const [showDetails, setShowDetails] = useState<boolean>(false);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="bg-white px-6 py-4 rounded-2xl  items-center gap-6 border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex flex-col"
      >
        <div className="flex w-full gap-4 items-center">
          <div className="w-[90px] h-[90px] relative shrink-0 overflow-hidden rounded-full">
            <Image
              src={avatar}
              alt=""
              fill
              className="object-cover shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            />
          </div>

          <div>
            <h2 className="text-2xl">{name}</h2>
            {!showDetails && (
              <h2 className="text-base">{`也去過${address}`}</h2>
            )}
          </div>
        </div>
        {/* 去過的地方 */}
        {!showDetails && (
          <div className="space-y-2.5">
            {/* <h2 className="text-xl">{name}</h2>
          <h2 className="text-base">{`也去過${address}`}</h2> */}
            <Button
              content="查看"
              mode="solid"
              onClick={() => setShowDetails(!showDetails)}
            />
          </div>
        )}

        {showDetails && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* 這裡放你的內容 */}
            <div className="w-full">
              {/* <p>{description}</p> */}
              <Link href={`/member/${userId}`}>
                <InfoButton button_name="個人檔案" />
              </Link>
              {overlappedAttractions && overlappedAttractions.length > 0 && (
                <div className="mt-4 ">
                  <h3 className="font-semibold mb-2">共同去過的景點：</h3>
                  <ul className="list-disc list-inside">
                    {overlappedAttractions.map((attraction) => (
                      <li key={attraction.id}>{attraction.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex w-full justify-between pt-3">
                <RegularButton
                  content="加好友"
                  mode="solid"
                  onClick={() => handleAddFriend(userId)}
                />
                {/* 關閉按鈕 */}
                <button
                  className=" top-2 right-2 text-gray-400"
                  onClick={() => setShowDetails(false)}
                >
                  收回
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
