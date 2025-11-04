'use client';

import React from 'react';
import Image from 'next/image';
import ButtonO from './button-orange';

interface ComponentsUserCardProps {
  avatar: string;
  name: string;
  description: string;
  id: number;
}

export default function ComponentsUserCard({
  avatar,
  name,
  description,
  id,
}: ComponentsUserCardProps) {
  return (
    <>
      <div className="bg-white flex rounded-[15]  items-center w-fit p-5 mx-auto  ">
        <div className="mr-4">
          <Image
            src={avatar}
            alt="用戶頭像"
            height={100}
            width={100}
            className="rounded-full object-cover"
          ></Image>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p>{description}</p>
          <ButtonO path={`member/edit/${id}`} text="編輯個人資料" />
        </div>
      </div>
    </>
  );
}
