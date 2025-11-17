// app/article/rankingpage/page.tsx
"use client"; // PENTING: Untuk mengaktifkan useState dan useEffect

import React, { useState, useEffect } from 'react';
import RankingCard from '../_components/RankingCard';
import { ArticleRankingItem, RankingAPIResponse } from '../../types'; // Sesuaikan jalur import
import axios from 'axios';

// 🚀 KOREKSI URL AKURAT BERDASARKAN HASIL POSTMAN 🚀
const API_BASE_URL = 'http://localhost:3005/api/article'; 
const ARTICLES_PER_PAGE = 10;

const ArticleRankingPage: React.FC = () => {
  const [rankingData, setRankingData] = useState<ArticleRankingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalArticles, setTotalArticles] = useState<number>(0);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError(null);
      try {
        // URL FINAL YANG PASTI BERHASIL MENGHINDARI 404:
        // Cth: http://localhost:3005/api/article/ranking?limit=10&page=1
        const url = `${API_BASE_URL}/ranking?limit=${ARTICLES_PER_PAGE}&page=${currentPage}`;
        
        const response = await axios.get<RankingAPIResponse>(url);
        const data = response.data;

        if (data.success) {
          setRankingData(data.data);
          setTotalArticles(data.total);
        } else {
          setError(data.message || 'Gagal mengambil data ranking.');
        }
      } catch (err) {
        console.error("Error fetching ranking:", err);
        const errorMessage = axios.isAxiosError(err) 
          ? `Gagal koneksi atau status ${err.response?.status}: Cek Backend!` 
          : 'Terjadi kesalahan tidak terduga.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [currentPage]);

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em' }}>⏳ Memuat Ranking Artikel...</div>;
  if (error) return <div style={{ color: 'white', backgroundColor: '#e53e3e', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>❌ Error: {error}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 15px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', borderBottom: '3px solid #3182ce', paddingBottom: '15px', color: '#2b6cb0' }}>
        🏆 Peringkat Artikel Populer Berdasarkan Score
      </h1>

      {rankingData.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#4a5568' }}>Tidak ada artikel yang dapat di-ranking saat ini.</p>
      ) : (
        rankingData.map((article: ArticleRankingItem) => (
          <RankingCard key={article.id} article={article} />
        ))
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', padding: '10px 0' }}>
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          style={buttonStyle(currentPage === 1)}
        >
          &larr; Halaman Sebelumnya
        </button>
        <span style={{ fontWeight: 'bold', color: '#2d3748' }}>
          Halaman **{currentPage}** dari **{totalPages}** ({totalArticles} total artikel)
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages || totalPages === 0}
          style={buttonStyle(currentPage === totalPages || totalPages === 0)}
        >
          Halaman Berikutnya &rarr;
        </button>
      </div>
    </div>
  );
};

// Helper style untuk tombol
const buttonStyle = (isDisabled: boolean): React.CSSProperties => ({
  padding: '10px 15px',
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  backgroundColor: isDisabled ? '#ccc' : '#3182ce',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  opacity: isDisabled ? 0.6 : 1,
});

export default ArticleRankingPage;















/// 'use client';

// import React from 'react';
// import HeroImage from '../_components/HeroImage';
// import SidebarActions from '../_components/SidebarActions';
// import SectionTitle from '../_components/SectionTitle';
// import DestinationCard from '../_components/DestinationCard';
// import ProductCard from '../_components/ProductCard';
// import destinations from '../_data/destination';

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
