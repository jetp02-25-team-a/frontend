'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';





export default function HeroSection() {
  return (
    <>
     <div className="relative w-full h-[500px] bg-white-200 ">
    <Image src={'/image/BANNER-3.jpg'} alt='' fill style={{zIndex:'-1'}}/>
      <h1 className=" text-white  text-6xl font-bold relative pt-40 text-center">
        台灣之美，等你親自體驗
      </h1>
    </div>
      </>
  );
}
