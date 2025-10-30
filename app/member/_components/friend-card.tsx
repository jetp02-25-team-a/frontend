'use client';

import Image from 'next/image';
import Button from '../../../components/ui/regular-button';

interface FriendCard {
  avatar: string;
  name: string;
  address: string;
}

export default function FriendCard({ avatar, name, address }: FriendCard) {
  return (
    <div className="bg-white px-[50px] py-[30px] rounded-2xl flex justify-center items-center gap-[46px] border border-gray-200  shadow-[0_8px_20px_rgba(0,0,0,0.2)] ">
      <div className="w-[100px] h-[100px]">
        <Image
          width={100}
          height={100}
          src={`/${avatar}`}
          alt=""
          className="rounded-full w-[100px] h-[100px] shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
        />
      </div>

      <div className="space-y-2.5">
        <h2 className="text-xl">{name}</h2>
        <h2 className="text-base">{`也去過${address}`}</h2>
        <Button content="加朋友" />
      </div>
    </div>
  );
}
