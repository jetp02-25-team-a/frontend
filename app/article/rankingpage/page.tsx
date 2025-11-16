// app/article/rankingpage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import PostCard from '../_components/PostCard1'; // Pastikan nama file PostCard sudah benar
import { API_SERVER } from '@/config/api-path';

// --- Konfigurasi Path Gambar ---
// Sesuaikan dengan path server Anda. Contoh: jika gambar di /public/uploads/
const IMAGE_UPLOAD_PREFIX = '/uploads/';
const FALLBACK_IMAGE_PATH = '/images/default.jpg';

// --- Interface Data yang Diharapkan dari Backend ---
export interface PostRanking {
  id: string;
  title: string;
  // Foto dari backend adalah array objek dengan field 'url'
  Photos: { url: string }[];
  Location?: { city: string };
  _count: { Likes: number };
}

// --- Fungsi Helper untuk Validasi dan Konstruksi URL Gambar ---
/**
 * Memastikan URL gambar memiliki prefix yang benar ('/' untuk internal, 'http' untuk eksternal)
 * atau kembali ke gambar default.
 * Ini adalah solusi utama untuk error "Invalid image path detected".
 */
const getPostImageUrl = (post: PostRanking): string => {
  const imageUrl = post.Photos?.[0]?.url;

  if (!imageUrl || imageUrl.trim() === '') {
    return FALLBACK_IMAGE_PATH;
  }

  // Jika URL sudah valid (sudah dimulai dengan http/https atau /), gunakan langsung
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // Jika hanya berupa nama file (e.g., 'f5915956-....png'), tambahkan prefix internal
  // Ini mengasumsikan gambar disimpan di `/public/uploads/`
  return `${IMAGE_UPLOAD_PREFIX}${imageUrl.trim()}`;
};

// --- Komponen Halaman Ranking ---
export default function RankingPage() {
  const [posts, setPosts] = useState<PostRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 💡 Refactor: Fungsi fetching yang lebih rapi
  async function fetchRankingData() {
    const url = `${API_SERVER}/article/ranking`;
    try {
      const res = await fetch(url);

      if (!res.ok) {
        // Logika error yang lebih informatif
        const msg = await res.text();
        throw new Error(
          `Gagal memuat ranking. Status: ${res.status}. Detail: ${msg}`
        );
      }

      const json = await res.json();
      // Pastikan struktur respons memiliki field 'data'
      if (!json || !Array.isArray(json.data)) {
        throw new Error(
          'Format data dari server tidak valid (expected "data" array).'
        );
      }

      return json.data as PostRanking[];
    } catch (err) {
      // Menangkap dan melempar error
      throw new Error(
        `Kesalahan Fetch: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }

  useEffect(() => {
    fetchRankingData()
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Hanya berjalan sekali saat mount

  // --- Rendering UI State ---
  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        <p>Memuat data ranking...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-600 font-medium">
        <h2>Kesalahan Fatal</h2>
        <p>{error}</p>
      </div>
    );

  // --- Rendering Konten Utama ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-2">
        🏆 Top Ranking Posts
      </h1>

      {posts.length === 0 && (
        <p className="text-gray-500 text-center py-10 border-t border-gray-200 mt-4">
          Saat ini belum ada postingan yang masuk ranking.
        </p>
      )}

      {/* Grid untuk menampilkan PostCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id}
            title={post.title}
            // 💡 Menggunakan fungsi helper untuk memastikan path gambar valid
            image={getPostImageUrl(post)}
            likes={post._count?.Likes ?? 0}
            destination={post.Location?.city ?? 'Unknown'}
          />
        ))}
      </div>
    </div>
  );
}

// export async function getRanking() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts/ranking`);

//   if (!res.ok) throw new Error("Failed to load ranking");

//   return res.json();
// }

// export default function RankingPage() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <HeroImage />
//       <div className="text-center mt-7 text-5xl font-bold">
//         你的旅程，不只是回憶——也是靈感的起點！
//       </div>

//       {/* Konten dengan Sidebar */}
//       <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 w-full max-w-7xl">
//         {/* Sidebar */}
//         <aside className="md:col-span-1">
//           <SidebarActions />
//         </aside>

//         {/* Konten utama */}
//         <div className="md:col-span-3">
//           <SectionTitle />
//           <div className="grid gap-4">
//             {destinations.map((destination, index) => (
//               <ProductCard
//                 key={destination.id ?? index}   // ← FIX key unik
//                 rank={index + 1}
//                 title={destination.title}
//                 description={destination.description}
//                 image={destination.image}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// 'use client';

// import React from 'react';
// import HeroImage from '../_components/HeroImage';
// import SidebarActions from '../_components/SidebarActions';
// import SectionTitle from '../_components/SectionTitle';
// import ProductCard from '../_components/ProductCard';
// // import { products } from '../_data/products';
// import { API_SERVER } from '@/config/api-path';
// import destinations from '../_data/destination';
// import DestinationCard from '../_components/DestinationCard';

// export default function RankingPage() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <HeroImage />
//       <div className="text-center mt-7 text-5xl font-bold">
//         你的旅程，不只是回憶——也是靈感的起點！
//       </div>

//       {/* Konten dengan Sidebar */}
//       <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 w-full max-w-7xl">
//         {/* Sidebar */}
//         <aside className="md:col-span-1">
//           <SidebarActions />
//         </aside>

//         {/* Konten utama */}
//         <div className="md:col-span-3">
//           <SectionTitle />
//           <div className="grid gap-4">
//             {destinations.map((destination, index) => (
//               <ProductCard
//                 key={DestinationCard.id}
//                 rank={index + 1}
//                 title={DestinationCard.title}
//                 description={DestinationCard.description}
//                 image={DestinationCard.image}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// 'use client';

// import React from 'react';
// import Image from 'next/image';

// import HeroImage from '../_components/HeroImage';
// // import SidebarNav from './_components/SideBarNav';
// import IntroText from '../_components/IntroText';
// import DestinationGrid from '../_components/DestinationGrid';
// import SectionTitle from '../_components/SectionTitle';
// import ProductCard from '../_components/ProductCard';
// import SidebarActions from '../_components/SidebarActions';
// import { products } from '../data/products';

// export default function Page() {
//   return (
//     <main className="flex">
//       {/* Sidebar kiri */}
//       {/* {<SidebarActions />} */}

//       {/* Konten utama */}
//       <div className="flex-1">
//         <HeroImage />

//         <div className="text-center mt-7 text-5xl font-bold">
//           你的旅程，不只是回憶——也是靈感的起點！
//         </div>

//         {/* <DestinationGrid /> */}

//         {/* Ranking Section */}
//         <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
//           <aside className="md:col-span-1">
//             <SidebarActions />
//           </aside>
//           <div className="md:col-span-3">
//             <SectionTitle />
//             <div className="grid gap-4">
//               {products.map((product, index) => (
//                 <ProductCard
//                   key={product.id}
//                   rank={index + 1}
//                   title={product.title}
//                   description={product.description}
//                   image={product.image}
//                 />
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// 'use client';

// import HeroImage from './_components/HeroImage';
// import SidebarNav from './_components/SideBarNav';
// import HeroSection from './_components/HeroSection';
// import IntroText from './_components/IntroText';
// import DestinationGrid from './_components/DestinationGrid';

// import React from 'react';
// import SectionTitle from './_components/SectionTitle';
// import ProductCard from './_components/ProductCard';
// import SidebarActions from './_components/SidebarActions';
// import { products } from './data/products';

// export default function HomePage() {
//   return (
//     <main className="flex">
//       <SidebarNav />
//       <div className="flex-1">
//         <HeroImage />
//         {/* <HeroSection /> */}
//         <div className="text-center mt-6 text-xl font-bold">
//           你的旅程，不只是回憶——也是靈感的起點！
//         </div>
//         <DestinationGrid />
//       </div>
//     </main>
//   );
// }

// export default function Page() {
//   return (
//     <main className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
//       <aside className="md:col-span-1">
//         <SidebarActions />
//       </aside>
//       <section className="md:col-span-3">
//         <SectionTitle />
//         <div className="grid gap-4">
//           {products.map((product, index) => (
//             <ProductCard
//               key={product.id}
//               rank={index + 1}
//               title={product.title}
//               description={product.description}
//               image={product.image}
//             />
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }

// import Image from 'next/image';

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{' '}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

// 'use client';

// import React, {useState, useEffect} from "react";
// import express, {Requet, Response} from "express";
// import Image from "next/image";
// import HeroImage from '../_components/HeroImage';
// // import SidebarNav from './_components/SideBarNav';
// import IntroText from '../_components/IntroText';
// import DestinationGrid from '../_components/DestinationGrid';
// import SectionTitle from '../_components/SectionTitle';
// import ProductCard from '../_components/ProductCard';
// import SidebarActions from '../components/SidebarActions';
// import { products } from './data/products';
