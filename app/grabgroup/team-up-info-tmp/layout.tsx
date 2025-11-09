'use client';

import InfoButton from './_components/InfoButton';
import JoinButton from '@/components/ui/join-button';
import { addTimeWrap } from '../utils';
import { Children, useState } from 'react';
import Map from './_components/GoogleMap';
import MessageBox from './_components/MessageBox';
import ResponseBox from './_components/ResponseBox';
import Button from '../_components/Button';
import { useRouter } from 'next/navigation';

const googleMapNode = {};

export default function TeamUpInfoPage({
  children,
}: {
  children: React.ReactElement;
}) {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col gap-[30px] items-center py-16">
        <h1 className="text-4xl">預覽畫面</h1>
        <p>此為畫面預覽，如無需修改請按下發佈按鈕</p>
        <div className="bg-gray-200 h-0.5 w-full"> </div>
        {children}
        <div className="flex gap-x-[21px] justify-center w-full">
          <Button content="回上一頁" onClick={() => router.back()} />
          <Button
            content="下一頁"
            onClick={() => router.push(`/grabgroup/team-up`)}
          />
        </div>
      </div>
    </>
  );
}
