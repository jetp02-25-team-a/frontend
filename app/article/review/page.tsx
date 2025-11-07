// 📁 /app/article/review/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SidebarAction from '../_components/SidebarActions';
import DetailForm from '../_components/DetailForms';
import MessageBoard from '../_components/MessageBoard';
import StatusDisplay from '../_components/StatusDisplay'; // <--- DI-IMPORT DARI FILE BARU
import { API_SERVER } from '@/app/config/api-path';

interface Article {
  id?: string;
  userId: string;
  title: string;
  location: string;
  Content: string;
  photos: string | string[];
}

export default function ReviewArticlePage() {
  const searchParams = useSearchParams();
  const pid = searchParams.get('id');

  const [article, setArticle] = useState<Article>({
    userId: '',
    title: 'Cannot find Article',
    location: '',
    Content: '',
    photos: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  // --- Fungsi Fetch Data ---
  const getArticle = async (articleId: string) => {
    const URL = `${API_SERVER}/article/${articleId}`;
    try {
      const res = await fetch(URL);

      if (!res.ok) {
        throw new Error(`Failed to fetch article: ${res.status}`);
      }

      const resData = await res.json();

      if (resData.id) {
        setArticle(resData);
      } else {
        throw new Error('Article data is empty or malformed.');
      }
    } catch (e) {
      console.error('Fetch Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Lifecycle Hook ---
  useEffect(() => {
    if (pid) {
      getArticle(pid);
    } else {
      // Penting: Hentikan loading jika ID hilang
      setIsLoading(false);
    }
  }, [pid]);

  // --- Render Status ---
  if (isLoading) {
    return <StatusDisplay message="Detail Article..." />;
  }

  if (!pid) {
    return <StatusDisplay message="Cannot find ID Article. " />;
  }

  // --- Render Halaman Utama ---
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 flex gap-8">
      {/* 🔹 Konten Utama */}
      <main className="flex-grow max-w-4xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Travelling Article
        </h1>

        <DetailForm article={article} />

        {/* Bagian Papan Pesan */}
        <div className="mt-8">
          <MessageBoard articleId={article.id} />
        </div>
      </main>

      {/* 🔸 Sidebar */}
      <aside className="w-80 flex-shrink-0 pt-10">
        <SidebarAction />
      </aside>
    </div>
  );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import SidebarAction from '../_components/SidebarActions'; // Komponen ini sekarang akan digunakan
// import { API_SERVER } from '@/app/config/api-path';

// // Hapus import yang tidak digunakan untuk menjaga kebersihan: HeroImage, HeroSection, IntroText

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string | string[]; // Diperbaiki agar sesuai dengan DetailForms.tsx yang menerima string atau array
// }

// // Komponen untuk menangani tampilan saat memuat/error
// const StatusDisplay = ({ message }: { message: string }) => (
//   <div className="flex justify-center items-center h-screen bg-gray-50">
//     <h1 className="text-xl font-semibold text-gray-700">{message}</h1>
//   </div>
// );

// export default function ReviewArticlePage() {
//   // Ganti nama fungsi agar lebih deskriptif
//   const searchParams = useSearchParams();
//   const pid = searchParams.get('id'); // ID artikel

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Artikel Tidak Ditemukan',
//     location: '',
//     Content: '',
//     photos: '',
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   // --- Fungsi Fetch Data ---
//   const getArticle = async (articleId: string) => {
//     // Memberikan delay palsu agar kita bisa melihat status loading
//     // await new Promise(resolve => setTimeout(resolve, 1000));

//     const URL = `${API_SERVER}/article/review/${articleId}`;
//     try {
//       const res = await fetch(URL);

//       if (!res.ok) {
//         // Jika respons 404/500, set artikel ke default dan throw error
//         throw new Error(`Failed to fetch article: ${res.status}`);
//       }

//       const resData = await res.json();

//       if (resData.id) {
//         setArticle(resData);
//       } else {
//         // Jika respons 200 tapi data kosong, set artikel default
//         throw new Error('Article data is empty or malformed.');
//       }
//     } catch (e) {
//       console.error('Fetch Error:', e);
//       // Biarkan article tetap pada nilai default "Artikel Tidak Ditemukan"
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Lifecycle Hook ---
//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       // Jika tidak ada ID di URL, loading selesai dan tampilkan pesan not found
//       setIsLoading(false);
//     }
//   }, [pid]);

//   // --- Render Status ---
//   if (isLoading) {
//     return <StatusDisplay message="Memuat detail artikel..." />;
//   }

//   if (!pid) {
//     return (
//       <StatusDisplay message="ID Artikel Hilang. Silakan akses melalui tautan yang valid." />
//     );
//   }

//   // --- Render Halaman Utama ---
//   return (
//     // Gunakan layout flex untuk menempatkan DetailForm dan SidebarAction berdampingan
//     <div className="max-w-7xl mx-auto py-10 px-4 flex gap-8">
//       {/* 🔹 Konten Utama (Mengambil sebagian besar ruang) */}
//       <main className="flex-grow max-w-4xl">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
//           Ulasan Artikel Perjalanan
//         </h1>

//         {/* Pastikan DetailForm menerima format 'photos' yang benar */}
//         <DetailForm article={article} />

//         {/* Bagian Papan Pesan */}
//         <div className="mt-8">
//           <MessageBoard articleId={article.id} />
//         </div>
//       </main>

//       {/* 🔸 Sidebar (Lebar tetap di sebelah kanan) */}
//       <aside className="w-80 flex-shrink-0 pt-10">
//         {/* SidebarAction yang sebelumnya di-import, sekarang digunakan */}
//         <SidebarAction />
//       </aside>
//     </div>
//   );
// }

// 'use client';

// import HeroImage from '../_components/HeroImage';
// import HeroSection from '../_components/HeroSection';
// import IntroText from '../_components/IntroText';
// import SidebarAction from '../_components/SidebarActions';
// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import { API_SERVER } from '@/app/config/api-path';

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string;
// }

// export default function WriteArticlePage() {
//   const searchParams = useSearchParams();
//   const pid = searchParams.get('id'); // ambil id dari query

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: '',
//     location: '',
//     Content: '',
//     photos: '',
//   });

//   const [isLoading, setIsloading] = useState(true);

//   const getArticle = async (pid: string) => {
//     const URL = `${API_SERVER}/article/review/${pid}`;
//     try {
//       const res = await fetch(URL);
//       const resData = await res.json();
//       if (resData.id) {
//         setArticle(resData);
//       }
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setIsloading(false);
//     }
//   };

//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     }
//   }, [pid]);

//   if (isLoading) {
//     return <h1>Loading article...</h1>;
//   }

//   return (
//     <main className="max-w-4xl mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1>
//       <DetailForm article={article} />
//       <MessageBoard articleId={article.id} />
//     </main>
//   );
// }

// // server-side helper
// async function getArticle(pid: string) {
//   const res = await fetch(`https://localhost:3001/article/review/${pid}`);
//   return res.json();
// }

// // React component sebagai default export
// export default async function ReviewPage({
//   params,
// }: {
//   params: { pid: string };
// }) {
//   const article = await getArticle(params.pid);

//   return (
//     <div>
//       <h1>{article.title}</h1>
//       <p>{article.content}</p>
//     </div>
//   );
// }

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import HeroImage from '../_components/HeroImage';
// import HeroSection from '../_components/HeroSection';
// import IntroText from '../_components/IntroText';
// import SidebarAction from '../_components/SidebarActions';
// // import DetailForm from '../_components/DetailForms';
// // import React, { useState, useEffect } from 'react';
// // import { useSearchParams } from 'next/navigation';
// // import DetailForms from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';

// interface Article {
//   id?: number;
//   title?: string;
//   location?: string;
//   content?: string;
//   photos?: string | string[];
// }

// export default function ReviewPage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get('id');
//   const [article, setArticle] = useState<Article>({});
//   const [isLoading, setIsLoading] = useState(true);

//   const getArticle = async (pid: string) => {
//     const URL = `http://localhost:3005/api/article/${pid}`;
//     try {
//       const res = await fetch(URL);
//       const data = await res.json();
//       setArticle(data);
//     } catch (error) {
//       console.error('❌ Error fetching article:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id && typeof id === 'string') getArticle(id);
//   }, [id]);

//   if (isLoading) {
//     return (
//       <main className="flex justify-center items-center h-screen">
//         <h2 className="text-xl font-semibold">Loading article...</h2>
//       </main>
//     );
//   }

//   return (
//     <main className="flex flex-col">
//       {/* 🔹 HeroImage section (full width) */}
//       <section className="relative w-full">
//         <HeroImage />

//         {/* Overlay konten di dalam HeroImage */}
//         <div className="absolute inset-0 flex flex-col justify-end bg-black/30 text-white p-8 md:p-16">
//           <HeroSection />
//           <div className="mt-4">
//             <IntroText />
//           </div>
//         </div>
//       </section>

//       {/* 🔹 Konten utama di bawah HeroImage */}
//       <section className="max-w-7xl mx-auto grid grid-cols-12 gap-8 py-10 px-4">
//         {/* Sidebar kiri */}
//         <aside className="col-span-12 md:col-span-3 order-1 md:order-none">
//           <SidebarAction />
//         </aside>

//         {/* DetailForm kanan */}
//         <article className="col-span-12 md:col-span-9">
//           <DetailForm article={article} />
//         </article>
//       </section>
//     </main>
//   );
// }

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import DetailForms from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';

// interface Article {
//   id?: number;
//   userId?: string;
//   title: string;
//   location: string;
//   content: string;
//   photos?: string | string[];
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get('id');
//   const [article, setArticle] = useState<Article>({
//     title: '',
//     location: '',
//     content: '',
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   const getArticle = async (pid: string) => {
//     const URL = `http://localhost:3005/api/article/${pid}`;
//     try {
//       const res = await fetch(URL);
//       const resData = await res.json();

//       if (resData.id) {
//         setArticle(resData);
//       }
//     } catch (e) {
//       console.error('❌ Fetch error:', e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id && typeof id === 'string') {
//       getArticle(id);
//     }
//   }, [id]);

//   if (isLoading) {
//     return (
//       <main className="flex justify-center items-center h-screen">
//         <h2 className="text-xl font-semibold">Loading article...</h2>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-4xl mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-6">Article (SearchParams)</h1>
//       <hr className="mb-6" />
//       <h2 className="text-2xl mb-2">{article.title}</h2>
//       <p className="text-gray-600 mb-4">Location: {article.location}</p>
//       <p className="mb-6">{article.content}</p>

//       {/* ✅ Tambahkan gambar jika tersedia */}
//       {article.photos && (
//         <div className="mb-10">
//           <img
//             src={
//               Array.isArray(article.photos) ? article.photos[0] : article.photos
//             }
//             alt={article.title}
//             className="w-full max-h-[500px] object-cover rounded shadow"
//           />
//         </div>
//       )}

//       {/* ✅ Komponen Form dan MessageBoard */}
//       <div className="space-y-10">
//         <DetailForms />
//         <MessageBoard />
//       </div>
//     </main>
//   );
// }

// 'use client'; // jika kamu pakai Next.js App Router

// import React, { useState, useEffect } from 'react';
// import HeroImage from '../_components/HeroImage';
// import HeroSection from '../_components/HeroSection';
// import IntroText from '../_components/IntroText';
// import SidebarAction from '../_components/SidebarActions';
// import { useSearchParams } from 'next/navigation';
// import ArticleForms from '../_components/ArticleForms';
// import MessageBoard from '../_components/MessageBoard';
// // import DestinationCard from './_components/DestinationCard';
// import { API_SERVER } from '@/app/config/api-path';

// interface Article {
//   userId: string;
//   title: string;
//   location: string;
//   content: string;
//   photos: string;
// }

// export default function WriteArticlePage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get('id');

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: '',
//     location: '',
//     content: '',
//     photos: '',
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   const getArticle = async (pid: string) => {
//     const URL = `http://localhost:3005/api/article/${pid}`;
//     try {
//       const res = await fetch(URL);
//       const resData = await res.json();

//       if (resData.id) {
//         setArticle(resData);
//         setTimeout(() => {
//           setIsLoading(false);
//         }, 1500);
//       }
//     } catch (e) {
//       console.error(e);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id && typeof id === 'string') {
//       getArticle(id);
//     }
//   }, [id]);

//   if (isLoading) {
//     return (
//       <main className="flex justify-center items-center h-screen">
//         <h2 className="text-xl font-semibold">Loading article...</h2>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-4xl mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-6">Article (SearchParams)</h1>
//       <hr className="mb-6" />
//       <h2 className="text-2xl mb-2">{article.title}</h2>
//       <p className="text-gray-600 mb-4">Location: {article.location}</p>
//       <p className="mb-6">{article.content}</p>
//       // {/* ✅ Komponen Form dan MessageBoard */}
//       <div className="space-y-10">
//         <ArticleForms />
//         <MessageBoard />
//       </div>
//     </main>
//   );
// }

// 'use client';
// import HeroImage from '../_components/HeroImage';
// import HeroSection from '../_components/HeroSection';
// import IntroText from '../_components/IntroText';
// import SidebarAction from '../_components/SidebarActions';
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';

// interface Article {
//   userId: string;
//   title: string;
//   location: string;
//   content: string;
//   photos: string;
// }

// export default function WriteArticlePage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get('id');

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: '',
//     location: '',
//     content: '',
//     photos: '',
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   const getArticle = async (pid: string) => {
//     const URL = `http://localhost:3005/api/article/${pid}`;
//     try {
//       const res = await fetch(URL);
//       const resData = await res.json();

//       if (resData.id) {
//         setArticle(resData);
//         setTimeout(() => {
//           setIsLoading(false);
//         }, 1500);
//       }
//     } catch (e) {
//       console.error(e);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id && typeof id === 'string') {
//       getArticle(id);
//     }
//   }, [id]);

//   if (isLoading) {
//     return (
//       <main className="flex justify-center items-center h-screen">
//         <h2 className="text-xl font-semibold">Loading article...</h2>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-4xl mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-6">Article (SearchParams)</h1>
//       <hr className="mb-6" />
//       <h2 className="text-2xl mb-2">{article.title}</h2>
//       <p className="text-gray-600 mb-4">Location: {article.location}</p>
//       <p className="mb-6">{article.content}</p>

//       {/* ✅ Tambahkan gambar jika tersedia */}
//       {article.photos && (
//         <div className="mb-10">
//           <img
//             src={article.photos}
//             alt={article.title}
//             className="w-full max-h-[500px] object-cover rounded shadow"
//           />
//         </div>
//       )}

//       {/* ✅ Komponen Form dan MessageBoard */}
//       <div className="space-y-10">
//         <ArticleForms />
//         <MessageBoard />
//       </div>
//     </main>
//   );
// }

// 'use client';
// import HeroImage from '../_components/HeroImage';
// import HeroSection from '../_components/HeroSection';
// import IntroText from '../_components/IntroText';
// import SidebarAction from '../_components/SidebarActions';
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import DetailForms from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';

// interface Article {
//   userId: string;
//   title: string;
//   location: string;
//   content: string;
//   photos: string;
// }

// export default function WriteArticlePage() {
//   const searchParams = useSearchParams();
//   const id = searchParams.get('id');

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: '',
//     location: '',
//     content: '',
//     photos: '',
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   const getArticle = async (pid: string) => {
//     const URL = `http://localhost:3005/api/article/${pid}`;
//     try {
//       const res = await fetch(URL);
//       console.log(res);
//       const resData = await res.json();
//       console.log(resData);

//       if (resData.id) {
//         setArticle(resData);
//         setTimeout(() => {
//           setIsLoading(false);
//         }, 1500);
//       }
//     } catch (e) {
//       console.error(e);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (id && typeof id === 'string') {
//       getArticle(id);
//     }
//   }, [id]);

//   if (isLoading) {
//     return (
//       <main className="flex justify-center items-center h-screen">
//         <h2 className="text-xl font-semibold">Loading article...</h2>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-4xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Article (SearchParams)</h1>
//       <hr className="mb-6" />
//       <h2 className="text-2xl mb-2">{article.title}</h2>
//       <p className="text-gray-600 mb-4">Location: {article.location}</p>
//       <p>{article.content}</p>
//       <div className="mt-8">
//         <ArticleForms />
//         <MessageBoard />
//       </div>
//     </main>
//   );
// }

// 'use client';

// import ArticleForm from '../_components/ArticleForms';
// import MessageBoard from '../_components/MessageBoard';
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { pid, title } from 'process';
// import { Content } from 'next/font/google';

// interface Article {
//   userId: '';
//   title: '';
//   location: '';
//   Content: '';
//   photos: '';
// }

// export default function WriteArticlePage() {
//   // 如果網址上設計為 ?pid=123

//   const searchParams = useSearchParams();
//   const id = searchParams.get('id');
//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: '',
//     location: '',
//     Content: '',
//     photos: '',
//   });
//   //定義控制載入指示動畫撥放的狀態
//   const getArticle = async (pid: string) =>{
//     const URL = `https://localhost:3001/article/review/${pid}`;
//     try{

//       const res = await fetch(URL);
//       const resData = await res.json();
//       console.log(resData);
//       if (resData.id){
//         setArticle(resData);
//         setTimeout(()=> {
//           setIsloading(false);
//         },1500);
//       }
//     }catch (e) {
//         console.log(e);

//       }

//     };
//   }

//   useEffect(()=>{
//     if (pid && typeof pid === 'string'){
//       setArticle(pid);
//     }
//   }, []);
//   if (isLoading){
//     return(
//       <>
//       <h1>Article(SearchParams)</h1>
//       <hr />
//       <h2>{article.id}</h2>
//       <p>{article.title}</p>

//       </>
//     )
//   }

//   return (
//     <main className="max-w-4xl mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1>
//       <ArticleForm />
//       <MessageBoard />
//     </main>
//   );
