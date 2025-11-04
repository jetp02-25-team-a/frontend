'use client'; // jika kamu pakai Next.js App Router

import { useEffect, useState } from 'react';
import HeroImage from './(site)/_components/HeroImage';
import HeroSection from './(site)/_components/HeroSection';
import IntroText from './(site)/_components/IntroText';
import SidebarAction from './(site)/_components/SidebarActions';
import DestinationCard from './(site)/_components/DestinationCard';

export default function HomePage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

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
          {/* <DestinationGrid destinations={destinations} /> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {destinations.map((dest, idx) => (
              <DestinationCard
                key={idx}
                // image={dest.image}
                title={dest.name}
                description={dest.city}
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
