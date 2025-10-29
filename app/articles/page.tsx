'use client';

import React, { useState, useEffect } from 'react';
import HeroImage from '@/components/HeroImage';
import HeroSection from '@/components/HeroSection';
import IntroText from '@/components/IntroText';
import SidebarAction from '@/components/SidebarAction';
import DestinationGrid from '@/components/DestinationGrid';

export default function ArticlePage() {
  return (
    <main>
      <div className="flex-1">
        <HeroImage />
        {/* <HeroSection /> */}
        <div className="text-center mt-6 text-xl font-bold">
          你的旅程，不只是回憶——也是靈感的起點！
        </div>
        <div className="flex">
          <SidebarAction />
          <DestinationGrid />
        </div>
      </div>
    </main>
  );
}
