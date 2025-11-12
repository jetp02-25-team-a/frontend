'use client';

import React from 'react';
import Image from 'next/image';
import ButtonO from './button-orange';
import RegularButton from '@/components/ui/regular-button';
import { AVATAR_PATH } from '../../config/image-path';

interface ComponentsUserCardProps {
  avatar: string;
  name: string;
  description: string;
  id: number;
  state: 'self' | 'other';
  addFriend?: (id: number) => void;
}

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
              <ButtonO path={`member/edit/${id}`} text="編輯個人資料" />
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
          </div>
        </div>
        <div className="flex w-full">
          <p className="w-full text-center">發文</p>
          <p className="w-full text-center">旅行</p>
          <p className="w-full text-center">朋友</p>
          <p className="w-full text-center">追蹤</p>
        </div>
      </div>
    </>
  );
}
