'use client';

import React,{useState, useEffect} from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroImage from './(site)/_components/HeroImage';
import HeroSection from './(site)/_components/HeroSection';
import IntroText from './(site)/_components/IntroText';
import SidebarAction from './(site)/_components/SidebarActions';
import DestinationGrid from './(site)/_components/DestinationGrid';
import Footer from '@/components/layout/Footer';

export default function ArticlesPage() {
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
