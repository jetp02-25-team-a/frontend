// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay';
// import { API_SERVER } from '@/app/config/api-path';
// import { useAuth } from '../../../hooks/use-Auth';
// import PostCard from '../_components/PostCard';

// import Link from 'next/link';

// interface post {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string | string[];
//   likes?: number;
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pid = searchParams.get('id');
//   const { user, getAuthHeader } = useAuth();
//   const [article, setArticle] = useState<Article>({
//      userId: '',
//     title: 'Cannot find Article',
//     location: '',
//     Content: '',
//     photos: '',
//     likes: 0,
//   });

// //   export default function ReviewPage({ searchParams }: { searchParams: { id: string } }) {
// //   const postId = searchParams.id;

// //   return (
// //     <div className="p-4">
// //       <h1 className="text-2xl font-bold mb-4">Review Artikel</h1>
// //       <PostCard postId={postId} initialLikes={0} />
// //     </div>
// //   );
// // }

//   const [isLoading, setIsLoading] = useState(true);
//   const [isLiking, setIsLiking] = useState(false);

//   // --- 🔹 Fetch Data ---
//   const getArticle = async (articleId: string) => {
//     const URL = `${API_SERVER}/article/${articleId}`;
//     try {
//       const res = await fetch(URL);
//       if (!res.ok) {
//         throw new Error(`Failed to fetch article: ${res.status}`);
//       }

//       const resData = await res.json();
//       if (resData && resData.id) {
//         setArticle(resData);
//       } else {
//         throw new Error('Article data is empty or malformed.');
//       }
//     } catch (error) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- 🔹 Lifecycle Hook ---
//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       setIsLoading(false);
//     }
//   }, [pid]);

//   // --- 🔹 Handlers ---
//   const handleDelete = async () => {
//     if (!article.id) return;
//     const confirmDelete = confirm(
//       'Are you sure you want to delete this article?'
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`${API_SERVER}/article/${article.id}`, {
//         headers: {
//           ...getAuthHeader(),
//         },
//         method: 'DELETE',
//       });

//       if (!res.ok) {
//         throw new Error('Failed to delete article');
//       }

//       alert('Article deleted successfully.');
//       router.push('/article/list'); // redirect ke daftar artikel
//     } catch (err) {
//       console.error('Delete Error:', err);
//       alert('Failed to delete article.');
//     }
//   };

//   const handleLike = async () => {
//     if (!article.id) return;
//     if (isLiking) return;

//     setIsLiking(true);
//     try {
//       const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
//         method: 'POST',
//       });

//       if (!res.ok) {
//         throw new Error('Failed to like article');
//       }

//       setArticle((prev) => ({
//         ...prev,
//         likes: (prev.likes || 0) + 1,
//       }));
//     } catch (err) {
//       console.error('Like Error:', err);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   // --- 🔹 Render Status ---
//   if (isLoading) return <StatusDisplay message="Loading article details..." />;
//   if (!pid) return <StatusDisplay message="Cannot find article ID." />;

//   // --- 🔹 Render Layout ---
//   return (
//     <div className="relative max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
//       {/* 🔸 Sidebar di sebelah kiri */}
//       <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
//         <SidebarAction />
//       </aside>

//       {/* 🔹 Konten utama */}
//       <main className="relative flex-grow max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10">
//         {/* 🔹 Floating Action Bar */}
//         <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
//           <Link
//             href={`/article/edit?id=${article.id}`}
//             className="bg-amber-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//           >
//             ✏️ Edit
//           </Link>

//           <button
//             onClick={handleDelete}
//             className="bg-amber-700 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//           >
//             🗑️ Delete
//           </button>

//           <button
//             onClick={handleLike}
//             disabled={isLiking}
//             className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
//           >
//             ❤️ {isLiking ? 'Liking...' : `Like (${article.likes || 0})`}
//           </button>
//         </div>

//         {/* 🔹 Judul Artikel */}
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
//           Travelling Article
//         </h1>

//         {/* 🔹 Detail Artikel */}
//         <DetailForm article={article} />

//         {/* 🔸 Message Board */}
//         <div className="mt-10">
//           <MessageBoard articleId={article.id} />
//         </div>
//       </main>
//     </div>
//   );
// }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Link from 'next/link';

// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay';
// import { API_SERVER } from '@/app/config/api-path';
// import { useAuth } from '../../../hooks/use-Auth';

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string | string[];
//   likes?: number;
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pid = searchParams.get('id');
//   const { user, getAuthHeader } = useAuth();

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Cannot find Article',
//     location: '',
//     Content: '',
//     photos: '',
//     likes: 0,
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [isLiking, setIsLiking] = useState(false);

//   // 🔹 Fetch Article
//   const getArticle = async (articleId: string) => {
//     try {
//       const res = await fetch(`${API_SERVER}/article/${articleId}`);
//       if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//       const data = await res.json();
//       if (!data?.id) throw new Error('Malformed article data');
//       setArticle(data);
//     } catch (err) {
//       console.error('Fetch Error:', err);
//       alert('Gagal memuat artikel.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🔹 Like Handler
//   const handleLike = async () => {
//     if (!article.id || isLiking) return;
//     setIsLiking(true);

//     try {
//       const res = await fetch(`${API_SERVER}/api/article/${id}/like`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       // const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     ...getAuthHeader(),
//       //   },
//       // });

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error('Like failed:', res.status, errorText);
//         throw new Error('Failed to like article');
//       }

//       setArticle((prev) => ({
//         ...prev,
//         likes: (prev.likes || 0) + 1,
//       }));
//     } catch (err) {
//       console.error('Like Error:', err);
//       alert('Failed to like article.');
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   // 🔹 Delete Handler
//   const handleDelete = async () => {
//     if (!article.id) return;
//     const confirmDelete = confirm(
//       'Are you sure you want to delete this article?'
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`${API_SERVER}/article/${article.id}`, {
//         method: 'DELETE',
//         headers: {
//           ...getAuthHeader(),
//         },
//       });

//       if (!res.ok) throw new Error('Failed to delete article');

//       alert('Article successfully deleted.');
//       router.push('/article/list');
//     } catch (err) {
//       console.error('Delete Error:', err);
//       alert('Failed to like the article');
//     }
//   };

//   // 🔹 Load on Mount
//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       setIsLoading(false);
//     }
//   }, [pid]);

//   // 🔹 Render
//   if (isLoading) return <StatusDisplay message="Loading article details..." />;
//   if (!pid) return <StatusDisplay message="Cannot find article ID." />;

//   return (
//     <div className="relative max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
//       {/* Sidebar */}
//       <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
//         <SidebarAction />
//       </aside>

//       {/* Main Content */}
//       <main className="relative flex-grow max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10">
//         {/* Action Buttons */}
//         <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
//           <Link
//             href={`/article/edit?id=${article.id}`}
//             className="bg-amber-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//           >
//             ✏️ Edit
//           </Link>

//           <button
//             onClick={handleDelete}
//             className="bg-amber-700 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//           >
//             🗑️ Delete
//           </button>

//           <button
//             onClick={handleLike}
//             disabled={isLiking}
//             className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
//           >
//             ❤️ {isLiking ? 'Liking...' : `Like (${article.likes || 0})`}
//           </button>
//         </div>

//         {/* Title */}
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
//           Travelling Article
//         </h1>

//         {/* Article Details */}
//         <DetailForm article={article} />

//         {/* Message Board */}
//         <div className="mt-10">
//           <MessageBoard articleId={article.id} />
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SidebarAction from '../_components/SidebarActions';
import DetailForm from '../_components/DetailForms';
import MessageBoard from '../_components/MessageBoard';
import StatusDisplay from '../_components/StatusDisplay';
import { API_SERVER } from '@/app/config/api-path';
import { useAuth } from '../../../hooks/use-Auth';

interface Article {
  id?: string;
  userId: string;
  title: string;
  location: string;
  Content: string;
  photos: string | string[];
  likes?: number;
}

export default function ReviewArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = searchParams.get('id');
  // const { getAuthHeader } = useAuth();

  const [article, setArticle] = useState<Article>({
    userId: '',
    title: 'Cannot find Article',
    location: '',
    Content: '',
    photos: '',
    likes: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  // 🔹 Fetch single article
  const getArticle = async (articleId: string) => {
    try {
      const res = await fetch(`${API_SERVER}/article/${articleId}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      if (!data?.id) throw new Error('Invalid article data');
      setArticle(data);
    } catch (err) {
      console.error('Fetch Error:', err);
      alert('Gagal memuat artikel.');
    } finally {
      setIsLoading(false);
    }
  };

  // // 🔹 Like Article
  // const handleLike = async () => {
  //   if (!article.id || isLiking) return;

  //   setIsLiking(true);
  //   try {
  //     // Pastikan endpoint sama dengan backend kamu (biasanya tanpa /api)
  //     // const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //     ...getAuthHeader(),
  //     //   },
  //     // });
  //     const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...getAuthHeader(),
  //       },
  //     });

  //     if (!res.ok) {
  //       const errorText = await res.text();
  //       console.error('Like failed:', res.status, errorText);
  //       throw new Error('Failed to like article');
  //     }

  //     setArticle((prev) => ({
  //       ...prev,
  //       likes: (prev.likes || 0) + 1,
  //     }));
  //   } catch (err) {
  //     console.error('Like Error:', err);
  //     alert('Failed to like article.');
  //   } finally {
  //     setIsLiking(false);
  //   }
  // };
  // Asumsi tipe untuk artikel Anda
  // interface Article {
  //   id: number | null; // Bisa null jika belum dimuat
  //   title: string;
  //   content: string;
  //   likes: number; // Harus ada
  //   isLikedByMe?: boolean; // Opsional: Status apakah pengguna sudah like
  //   // ... properti lain
  // }

  // Asumsi tipe untuk respons sukses dari backend
  // Kita asumsikan backend mengembalikan total likes yang baru
  interface LikeResponse {
    newLikesCount: number;
    message: string;
    // Jika backend mengembalikan status like pengguna
    isLikedByMe?: boolean;
  }

  // --- Konstanta API ---
  // Ganti dengan path API Anda yang sebenarnya atau ambil dari environment
  const API_SERVER = 'http://localhost:8080';

  // --- Fungsi Helper (Simulasi) ---
  // Ganti dengan fungsi yang benar untuk mengambil header otentikasi
  const getAuthHeader = () => ({
    Authorization: `Bearer YOUR_AUTH_TOKEN`, // Ganti dengan token yang sebenarnya
  });

  // --- Komponen/Hook Utama yang Menggunakan handleLike ---

  const ArticleDetail = ({ initialArticle }: { initialArticle: Article }) => {
    const [article, setArticle] = useState<Article>(initialArticle);
    const [isLiking, setIsLiking] = useState<boolean>(false);

    // Menggunakan useCallback untuk stabilitas fungsi (dianjurkan)
    const handleLike = useCallback(async () => {
      // 1. Pre-check dan Guard Clauses
      // article.id harus ada dan bukan dalam proses liking
      if (!article.id || isLiking) return;

      setIsLiking(true);

      try {
        // 2. Tentukan Endpoint (Menggunakan Template Literal)
        const endpoint = `${API_SERVER}/article/${article.id}/like`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          // Jika perlu mengirimkan data body (misal: user_id), tambahkan di sini
          // body: JSON.stringify({ userId: someUserId }),
        });

        // 3. Penanganan Respons Gagal
        if (!res.ok) {
          // Log error detail untuk debugging di console
          const errorText = await res.text();
          console.error('Like failed:', res.status, errorText);
          throw new Error('Gagal memproses like artikel. Silakan coba lagi.');
        }

        // 4. Membaca & Memvalidasi Respons Sukses dari Backend
        const result: LikeResponse = await res.json();

        // Pastikan backend mengembalikan angka yang valid
        if (typeof result.newLikesCount !== 'number') {
          throw new Error(
            'Respons backend tidak valid: newLikesCount hilang atau bukan angka.'
          );
        }

        // 5. Update State dengan Data Akurat dari Backend
        setArticle((prev) => ({
          ...prev,
          likes: result.newLikesCount, // ⭐ Sumber kebenaran dari Backend
          isLikedByMe: result.isLikedByMe ?? prev.isLikedByMe, // Update status like pengguna (jika disediakan backend)
        }));
      } catch (err) {
        // Menampilkan error yang lebih informatif ke pengguna
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan tidak terduga saat like.';
        console.error('Like Error:', err);
        alert(errorMessage);
      } finally {
        // 6. Reset Loading State
        setIsLiking(false);
      }
    }, [article.id, isLiking, setArticle]); // Dependencies yang tepat

    // Tampilan sederhana
    return (
      <div className="p-4 border rounded-md">
        <h3 className="text-xl font-bold">{article.title}</h3>
        <p>Likes: {article.likes}</p>
        <button
          onClick={handleLike}
          disabled={isLiking || article.id === null}
          className={`mt-2 px-4 py-2 rounded text-white transition-colors 
                        ${isLiking ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLiking ? 'Memproses...' : `👍 ${article.likes} Like`}
        </button>
      </div>
    );
  };

  // export default ArticleDetail;

  // 🔹 Delete Article
  const handleDelete = async () => {
    if (!article.id) return;
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`${API_SERVER}/article/${article.id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) throw new Error('Failed to delete article');

      alert('Article successfully deleted.');
      router.push('/article/list');
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete the article.');
    }
  };

  // 🔹 Load article on mount
  useEffect(() => {
    if (pid) {
      getArticle(pid);
    } else {
      setIsLoading(false);
    }
  }, [pid]);

  // 🔹 UI Rendering
  if (isLoading) return <StatusDisplay message="Loading article details..." />;
  if (!pid) return <StatusDisplay message="Cannot find article ID." />;

  return (
    <div className="relative max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
        <SidebarAction />
      </aside>

      {/* Main Content */}
      <main className="relative flex-grow max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
          <Link
            href={`/article/edit?id=${article.id}`}
            className="bg-amber-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            ✏️ Edit
          </Link>

          <button
            onClick={handleDelete}
            className="bg-amber-700 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
          >
            🗑️ Delete
          </button>

          <button
            onClick={handleLike}
            disabled={isLiking}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            ❤️ {isLiking ? 'Liking...' : `Like (${article.likes || 0})`}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
          Travelling Article
        </h1>

        {/* Article Details */}
        <DetailForm article={article} />

        {/* Message Board */}
        <div className="mt-10">
          <MessageBoard articleId={article.id} />
        </div>
      </main>
    </div>
  );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay';
// import { API_SERVER } from '@/app/config/api-path';
// import { useAuth } from '../../../hooks/use-Auth';

// // --- 🎯 IMPORT BARU: Kita gunakan PostCard di sini ---
// import PostCard from '../_components/PostCard';

// import Link from 'next/link';

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string | string[];
//   likes?: number; // Tambahkan status liked oleh user saat ini, jika API menyediakannya
//   isLikedByCurrentUser?: boolean;
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pid = searchParams.get('id');
//   const { user, getAuthHeader } = useAuth();
//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Cannot find Article',
//     location: '',
//     Content: '',
//     photos: '',
//     likes: 0,
//     isLikedByCurrentUser: false, // Default
//   });

//   const [isLoading, setIsLoading] = useState(true); // State isLiking Dihapus karena akan dikelola di PostCard
//   // --- 🔹 Fetch Data ---
//   // const [isLiking, setIsLiking] = useState(false);

//   const getArticle = async (articleId: string) => {
//     const URL = `${API_SERVER}/article/${articleId}`;
//     try {
//       // Kirim header otentikasi saat fetch untuk mendapatkan status like user
//       const res = await fetch(URL, { headers: getAuthHeader() });
//       if (!res.ok) {
//         throw new Error(`Failed to fetch article: ${res.status}`);
//       }

//       const resData = await res.json();
//       if (resData && resData.id) {
//         setArticle(resData);
//       } else {
//         throw new Error('Article data is empty or malformed.');
//       }
//     } catch (error) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }; // --- 🔹 Lifecycle Hook ---

//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       setIsLoading(false);
//     }
//   }, [pid]); // --- 🔹 Handlers ---

//   const handleDelete = async () => {
//     // Logika handleDelete tetap di sini karena ini adalah aksi halaman/pemilik artikel.
//     if (!article.id) return; // ... (Logika konfirmasi dan fetch DELETE tetap sama) ...
//     const confirmDelete = confirm(
//       'Are you sure you want to delete this article?'
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`${API_SERVER}/article/${article.id}`, {
//         headers: {
//           ...getAuthHeader(),
//         },
//         method: 'DELETE',
//       });

//       if (!res.ok) {
//         throw new Error('Failed to delete article');
//       }

//       alert('Article deleted successfully.');
//       router.push('/article/list'); // redirect ke daftar artikel
//     } catch (err) {
//       console.error('Delete Error:', err);
//       alert('Failed to delete article.');
//     }
//   }; // --- 🔹 Render Status ---

//   // --- FUNGSI handleLike DIHAPUS, Logika Dipindahkan ke PostCard.tsx ---

//   if (isLoading) return <StatusDisplay message="Loading article details..." />;
//   if (!pid) return <StatusDisplay message="Cannot find article ID." />; // --- 🔹 Render Layout ---

//   return (
//     <div className="relative max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
//             {/* 🔸 Sidebar di sebelah kiri */}     {' '}
//       <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
//                 <SidebarAction />     {' '}
//       </aside>
//             {/* 🔹 Konten utama */}     {' '}
//       <main className="relative flex-grow max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10">
//                 {/* 🔹 Floating Action Bar */}       {' '}
//         <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
//                    {' '}
//           <Link
//             href={`/article/edit?id=${article.id}`}
//             className="bg-amber-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//           >
//                         ✏️ Edit          {' '}
//           </Link>
//                    {' '}
//           <button
//             onClick={handleDelete}
//             className="bg-amber-700 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//           >
//                         🗑️ Delete          {' '}
//           </button>
//                    {' '}
//           {/* 🎯 PENGGANTIAN: Ganti tombol Like kustom dengan komponen PostCard */}
//                    {' '}
//           <PostCard
//             postId={article.id!}
//             initialLikes={article.likes || 0}
//             isInitialLiked={article.isLikedByCurrentUser || false}
//             // Jika PostCard memerlukan header otentikasi untuk API call, kirimkan
//             authHeader={getAuthHeader()}
//           />
//                  {' '}
//         </div>
//                 {/* 🔹 Judul Artikel */}       {' '}
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
//                     Travelling Article        {' '}
//         </h1>
//                 {/* 🔹 Detail Artikel */}
//                 <DetailForm article={article} />        {/* 🔸 Message Board */}
//                {' '}
//         <div className="mt-10">
//                     <MessageBoard articleId={article.id} />       {' '}
//         </div>
//              {' '}
//       </main>
//          {' '}
//     </div>
//   );
// }

//📁 /app/article/review/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay';
// import { API_SERVER } from '@/app/config/api-path';

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string | string[];
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const pid = searchParams.get('id');

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Cannot find Article',
//     location: '',
//     Content: '',
//     photos: '',
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   // --- 🔹 Fetch Data ---
//   const getArticle = async (articleId: string) => {
//     const URL = `${API_SERVER}/article/${articleId}`;
//     try {
//       const res = await fetch(URL);
//       if (!res.ok) {
//         throw new Error(`Failed to fetch article: ${res.status}`);
//       }

//       const resData = await res.json();

//       if (resData && resData.id) {
//         setArticle(resData);
//       } else {
//         throw new Error('Article data is empty or malformed.');
//       }
//     } catch (error) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- 🔹 Lifecycle Hook ---
//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       setIsLoading(false);
//     }
//   }, [pid]);

//   // --- 🔹 Render Status ---
//   if (isLoading) {
//     return <StatusDisplay message="Loading article details..." />;
//   }

//   if (!pid) {
//     return <StatusDisplay message="Cannot find article ID." />;
//   }

//   // --- 🔹 Render Layout ---
//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
//       {/* 🔸 Sidebar di sebelah kiri */}
//       <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
//         <SidebarAction />
//       </aside>

//       {/* 🔹 Konten utama */}
//       <main className="flex-grow max-w-4xl">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
//           Travelling Article
//         </h1>

//         <DetailForm article={article} />

//         {/* 🔸 Message Board */}
//         <div className="mt-8">
//           <MessageBoard articleId={article.id} />
//         </div>
//       </main>
//     </div>
//   );
// }

// // 📁 /app/article/review/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import SidebarAction from '../_components/SidebarActions';
// import { useSearchParams } from 'next/navigation';

// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay'; // <--- DI-IMPORT DARI FILE BARU
// import { API_SERVER } from '@/app/config/api-path';

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   Content: string;
//   photos: string | string[];
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const pid = searchParams.get('id');

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Cannot find Article',
//     location: '',
//     Content: '',
//     photos: '',
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   // --- Fungsi Fetch Data ---
//   const getArticle = async (articleId: string) => {
//     const URL = `${API_SERVER}/article/${articleId}`;
//     try {
//       const res = await fetch(URL);

//       if (!res.ok) {
//         throw new Error(`Failed to fetch article: ${res.status}`);
//       }

//       const resData = await res.json();

//       if (resData.id) {
//         setArticle(resData);
//       } else {
//         throw new Error('Article data is empty or malformed.');
//       }
//     } catch (e) {
//       console.error('Fetch Error:', e);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Lifecycle Hook ---
//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       // Penting: Hentikan loading jika ID hilang
//       setIsLoading(false);
//     }
//   }, [pid]);

//   // --- Render Status ---
//   if (isLoading) {
//     return <StatusDisplay message="Detail Article..." />;
//   }

//   if (!pid) {
//     return <StatusDisplay message="Cannot find ID Article. " />;
//   }

//   // --- Render Halaman Utama ---
//   return (
//     <div className="max-w-7xl mx-auto py-10 px-4 flex gap-8">
//       {/* 🔹 Konten Utama */}
//       <main className="flex-grow max-w-4xl">
//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
//           Travelling Article
//         </h1>

//         <DetailForm article={article} />

//         {/* Bagian Papan Pesan */}
//         <div className="mt-8">
//           <MessageBoard articleId={article.id} />
//         </div>
//       </main>

//       {/* 🔸 Sidebar */}
//       <aside className="w-80 flex-shrink-0 pt-10">
//         <SidebarAction />
//       </aside>
//     </div>
//   );
// }

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
