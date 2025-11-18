'use client';

import React, { useEffect, useEffectEvent } from 'react';
import Image from 'next/image';
import ButtonO from './button-orange';
import RegularButton from '@/components/ui/regular-button';
import { AVATAR_PATH } from '../../config/image-path';
import { string } from 'zod';
// import { console } from 'inspector';
import { API_SERVER } from '../../config/api-path';
import { useState } from 'react';
import { de } from 'date-fns/locale';

interface ComponentsUserCardProps {
  avatar: string;
  name: string;
  description: string;
  id: number;
  state: 'self' | 'other' | 'isFriend';
  addFriend?: (id: number) => void;
}

interface UserDetail {
  followers: number;
  friends: number;
  itineraries: number;
  posts: number;
}
const defaultUserDetail: UserDetail = {
  followers: 0,
  friends: 0,
  itineraries: 0,
  posts: 0,
};

export default function ComponentsUserCard({
  avatar,
  name,
  description,
  id,
  state,
  addFriend,
}: ComponentsUserCardProps) {
  // 生成有效的圖片 URL
  const getAvatarUrl = (avatarStr: string): string => {
    if (!avatarStr || avatarStr === '/avatar_default.png') {
      return '/avatar_default.png';
    }
    // 如果已經是完整路徑，直接返回
    if (avatarStr.startsWith('http') || avatarStr.startsWith('/')) {
      return avatarStr;
    }
    // 否則加上 AVATAR_PATH 前綴
    return `${AVATAR_PATH}${avatarStr}`;
  };

  const getUserDetailUrl = async (userId: number) => {
    if (!userId) return;
    //http://localhost:3005/api/friendships/user-activity?userId=55
    const url = `${API_SERVER}/friendships/user-activity?userId=${userId}`;
    const result = await fetch(url);
    if (!result.ok) {
      console.error('Failed to fetch user details');
      return;
    }
    const data = await result.json();
    // console.log('User Details:', data.data);
    return data;
  };

  const [userDetail, setUserDetail] = useState<UserDetail>(defaultUserDetail);

  useEffect(() => {
    getUserDetailUrl(id).then((data) => {
      if (data && data.data) setUserDetail(data.data);
    });
  }, []);

  return (
    <>
      <div className="bg-white flex flex-col rounded-[15] gap-[30px]  items-center w-[533px] p-5 mx-auto  ">
        <div className="m-auto flex">
          <div className="mr-4 w-[150px] h-[150px] relative shrink-0">
            <Image
              src={getAvatarUrl(avatar)}
              alt="用戶頭像"
              fill
              className="rounded-full object-cover"
            ></Image>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{name}</h3>
            <p>{description}</p>
            {state === 'self' && (
              <ButtonO path={`/member/edit/${id}`} text="編輯個人資料" />
            )}
            {state === 'other' && (
              <div className="flex gap-3">
                <RegularButton
                  content="加好友"
                  mode="solid"
                  onClick={() => {
                    if (addFriend) addFriend(id);
                  }}
                />
                <RegularButton content="追蹤" mode="hollow" />
              </div>
            )}

            {state === 'isFriend' && (
              <div className="flex gap-3">
                <RegularButton content="好友" mode="solid" />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full">
          <p className="w-full text-center">發文 {userDetail.posts}</p>
          <p className="w-full text-center">旅行 {userDetail.itineraries}</p>
          <p className="w-full text-center">朋友 {userDetail.friends}</p>
          <p className="w-full text-center">追蹤 {userDetail.followers}</p>
        </div>
      </div>
    </>
  );
}
