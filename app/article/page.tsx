// 'use client'; // jika kamu pakai Next.js App Router

// import { useEffect, useState } from 'react';
// import HeroImage from './_components/HeroImage';
// import HeroSection from './_components/HeroSection';
// import IntroText from './_components/IntroText';
// import SidebarAction from './_components/SidebarActions';
// import DestinationCard from './_components/DestinationCard';
// import { API_SERVER } from '../config/api-path';
// interface DestType {
//   title: string;
//   location: string;
//   id: number;
//   imgUrl: string | undefined;
// }
// export default function HomePage() {
//   const [destinations, setDestinations] = useState<DestType[] | null>([]);

//   useEffect(() => {
//     fetch(`${API_SERVER}/article`)
//       .then((res) => res.json())
//       .then((data) => {
//         const newDest = data.map((d: any) => {
//           return {
//             id: d.id,
//             title: d.title,
//             location: d.city,
//             imgUrl: d.imgUrl,
//           };
//         });
//         setDestinations(newDest);
//         console.log(newDest);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <main>
//       <div className="flex-1">
//         <HeroImage />
//         {/* <HeroSection /> */}
//         <div className="text-center mt-6 text-xl font-bold">
//           你的旅程，不只是回憶——也是靈感的起點！
//         </div>
//         <div className="flex">
//           <SidebarAction />
//           {/* <DestinationGrid destinations={destinations} /> */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//             {destinations?.map((dest, idx) => (
//               <DestinationCard
//                 key={dest.id}
//                 // image={dest.image}
//                 id={dest.id}
//                 title={dest.title}
//                 description={dest.location}
//                 image={dest.imgUrl ? dest.imgUrl : ''}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import HeroImage from './_components/HeroImage';
import SidebarAction from './_components/SidebarActions';
import DestinationCard from './_components/DestinationCard';
import { API_SERVER } from '../config/api-path';

interface DestType {
  id: number;
  title: string;
  location: string;
  imgUrl: string;
}

export default function Page() {
  const [destinations, setDestinations] = useState<DestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankingArticles = async () => {
      try {
        const res = await fetch(`${API_SERVER}/article/ranking`);
        const result = await res.json();

        if (!Array.isArray(result.data)) {
          throw new Error('Invalid response format');
        }

        const newDest = result.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          location: post.Location?.name || 'Unknown',
          imgUrl: post.Photos?.[0]?.url || '',
        }));

        setDestinations(newDest);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchRankingArticles();
  }, []);

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
            {loading && <div>Loading destinations...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading &&
              !error &&
              destinations.map((dest) => (
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
