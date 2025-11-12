'use client';

import InfoButton from './_components/InfoButton';
import JoinButton from '@/components/ui/join-button';
import { addTimeWrap } from '../utils';
import { Children, useState } from 'react';
import Map from './_components/GoogleMap';
import MessageBox from './_components/MessageBox';
import ResponseBox from './_components/ResponseBox';

const googleMapNode = {};

export default function TeamUpInfoPage({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <>
      <div className="flex flex-col gap-[30px] items-center py-16">
        <h1 className="text-4xl">行程頁面</h1>
        <div className="bg-gray-200 h-0.5 w-full"></div>
        {children}
      </div>
    </>
  );
}
