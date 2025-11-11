'use client';

import React from 'react';
import Image from 'next/image';
import ButtonO from './button-orange';
import RegularButton from '@/components/ui/regular-button';

interface ComponentsUserCardProps {
  avatar: string;
  name: string;
  description: string;
  id: number;
  state: 'self' | 'other';
  addFriend: (id: number) => void;
}

export default function ComponentsUserCard({
  avatar,
  name,
  description,
  id,
  state,
  addFriend,
}: ComponentsUserCardProps) {
  return (
    <>
      <div className="bg-white flex flex-col rounded-[15] gap-[30px]  items-center w-[533px] p-5 mx-auto  ">
        <div className="m-auto flex">
          <div className="mr-4">
            <Image
              src={avatar}
              alt="用戶頭像"
              height={300}
              width={300}
              className="rounded-full object-cover shrink-0"
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
                    console.log('down');
                    addFriend(id);
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
