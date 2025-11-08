'use client';
import InputField from './_components/input-field';
// import TourCard from './_components/tour-card';

import React from 'react';

export default function TeamUpLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return (
    <>
      <div className="flex flex-col gap-[30px] items-center py-16  px-16">
        <h1 className="text-4xl">一起加入旅程</h1>
        <div className="bg-gray-200 h-0.5 w-full"> </div>
        <div className="p-[60px] space-y-[30px]">
          <p className="customize_text_gray text-center">
            我們能依照您的時間、交通方式、旅行類型建立您的行程
          </p>
          <InputField></InputField>
        </div>

        <h1 className="text-4xl">熱門景點</h1>
        <div className="bg-gray-200 h-0.5 w-full"></div>

        {children}
      </div>
    </>
  );
}
