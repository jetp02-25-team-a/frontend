'use client';

import { useEffect, useState } from 'react';
import HeroImage from './_components/HeroImage';
import SidebarAction from './_components/SidebarActions';
import DestinationCard from './_components/DestinationCard';
import { API_SERVER } from '../config/api-path';
import toast from 'react-hot-toast';

interface DestType {
  title: string;
  location: string;
  id: number;
  imgUrl: string | undefined;
}

export default function HomePage() {
  const [destinations, setDestinations] = useState<DestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch(`${API_SERVER}/article`, { cache: 'no-store' });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();
        console.log('API Response:', json);

        // ---- NORMALISASI BENTUK RESPONSE ----
        const raw = Array.isArray(json)       // jika backend return array langsung
          ? json
          : Array.isArray(json.data)
          ? json.data                         // jika backend return {data: [...]}
          : [];

        if (!Array.isArray(raw)) {
          toast.error('API 不傳回數組數據');
          return;
        }

        const newDest = raw.map((d: any) => ({
          id: d.id,
          title: d.title,
          location: d.city ?? d.location ?? '',
          imgUrl: d.imgUrl ?? '',
        }));

        setDestinations(newDest);
      } catch (err: any) {
        console.error(err);
        toast.error('載入目標失敗');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <main>
      <div className="flex-1">
        <HeroImage />

        <div className="text-center mt-6 text-xl font-bold">
          你的旅程，不只是回憶——也是靈感的起點！
        </div>

        <div className="flex">
          <SidebarAction />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                title={dest.title}
                description={dest.location}
                image={dest.imgUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// 'use client';

// import React,{useState, useEffect} from 'react';
// import Navbar from '@/components/layout/Navbar';
// import HeroImage from './(site)/_components/HeroImage';
// import HeroSection from './(site)/_components/HeroSection';
// import IntroText from './(site)/_components/IntroText';
// import SidebarAction from './(site)/_components/SidebarActions';
// import DestinationGrid from './(site)/_components/DestinationGrid';
// import Footer from '@/components/layout/Footer';

// export default function ArticlesPage() {
//    return (
//     <main>
//       <div className="flex-1">
//         <HeroImage />
//         {/* <HeroSection /> */}
//         <div className="text-center mt-6 text-xl font-bold">
//           你的旅程，不只是回憶——也是靈感的起點！
//         </div>
//         <div className="flex">
//           <SidebarAction />
//           <DestinationGrid />
//         </div>
//       </div>
//     </main>
//   );
// }
