'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { API_SERVER } from '../../config/api-path';
import { ApiResponse } from '../_interfaces/userData';
import { useRouter } from 'next/navigation';
import ComponentsUserCard from '../_components/user-card';
import ListButton from '../user-info/_components/list-button';
import Checklist from '../user-info/_components/checklist';
import { useFetch } from '@/hooks/useFetch';
import { AVATAR_PATH, IMAGE_PATH } from '../../config/image-path';
import { useAuth } from '../../../hooks/use-Auth';
import toast from 'react-hot-toast';

interface UserALLData {
  id: number;
  email: string;
  nickname: string;
  fullName: string;
  avatar: string;
  description: string;
  point: number;
  Posts: any[];
  Favorites: any[];
  FriendshipsFriend: any[];
}

const userALLDataDefault: UserALLData = {
  id: 0,
  email: '',
  nickname: '',
  fullName: '',
  avatar: '/avatar_default.png',
  description: '',
  point: 0,
  Posts: [],
  Favorites: [],
  FriendshipsFriend: [],
};

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

export default function UserIdPage() {
  const { user_id } = useParams();
  const [userData, setUserData] = useState<UserALLData>(userALLDataDefault);
  const { user, isAuthenticated, isReady } = useAuth();
  const [isFriend, setIsFriend] = useState<boolean>(false);

  const [options, setOptions] = useState<string>('發文');
  const url = `${API_SERVER}/friendships/userinfo?userId=${user_id}`;
  const { data, loading, error, refetch } = useFetch(url);
  //資料拿取
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data?.success) setUserData(data.data);
  }, [data]);

  useEffect(() => {
    //確認是不是好友
    const checkIsFriend = async (id: number, authId: number) => {
      const checkUrl = `${API_SERVER}/friendships/check?userId=${authId}&friendId=${id}`;
      const response = await fetch(checkUrl).then((r) => r.json());
      if (response.isFriend) {
        return true;
      } else {
        return false;
      }
    };

    checkIsFriend(userData.id, user.id).then((r) => setIsFriend(r));
  }, [userData]);

  return (
    <div className="bg-light-orange ">
      <div className="flex flex-col items-center py-16 gap-[30px]">
        {/* 個人資訊區 */}

        <ComponentsUserCard
          avatar={userData.avatar || '/avatar_default.png'}
          name={userData.nickname}
          description={userData.description}
          id={userData.id}
          state={`${isFriend ? 'isFriend' : 'other'}`}
          addFriend={handleAddFriend}
        />

        {/* btns */}
        <div className="w-[900px]">
          <div className="flex">
            <ListButton
              name="發文"
              active={false}
              onClick={() => setOptions('發文')}
            />
            <ListButton
              name="收藏景點"
              active={false}
              onClick={() => setOptions('收藏景點')}
            />
            <ListButton
              name="好友"
              active={false}
              onClick={() => setOptions('好友')}
            />
          </div>
          <div className=" px-5 pb-6 rounded-b-3xl bg-white ">
            {/* 顯示區域 */}
            <div>
              {options === '發文' && <>發表文章</>}
              {options === '收藏景點' && <>收藏景點</>}
              {options === '好友' && (
                <>
                  {userData.FriendshipsFriend.length > 0 &&
                    userData.FriendshipsFriend.map((f, i) => {
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 border-b-2 border-gray-400"
                        >
                          <div className="w-[70px] h-[70px] relative shrink-0">
                            <Image
                              src={
                                f.User.avatar
                                  ? `${AVATAR_PATH}${f.User.avatar}`
                                  : '/avatar_default.png'
                              }
                              alt=""
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <p className="text-gray-600">{f.User.nickname}</p>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <Image
          src={
            userData.data.avatar
              ? `${IMAGE_PATH}${userData.data.avatar}`
              : '/avatar_default.png'
          }
          alt=""
          height={100}
          width={100}
        />
        <h1>{userData.data.nickname}</h1>
        <h1>{userData.data.description}</h1>
      </div>
      <h1>正在查看別人的個人檔案</h1> */}
    </div>
  );
}
