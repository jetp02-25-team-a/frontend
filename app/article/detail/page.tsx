'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import SidebarAction from '../_components/SidebarActions';
import DetailForm from '../_components/DetailForms';
import MessageBoard from '../_components/MessageBoard';
import StatusDisplay from '../_components/StatusDisplay';

import { ARTICLE_PHOTOS_PATH } from '../../../config/image-path';
import { API_SERVER } from '@/app/config/api-path';
import { useAuth } from '../../../hooks/use-Auth';
import toast from 'react-hot-toast';

interface Article {
  id?: string;
  userId: string;
  title: string;
  location: string;
  content: string;
  photos?: string | string[];
  likes?: number;
  isLikedByMe?: boolean;
}

interface LikeResponse {
  newLikesCount: number;
  message: string;
  isLikedByMe?: boolean;
}

export default function ReviewArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = searchParams.get('id');

  const { user, getAuthHeader } = useAuth();
  const isAuthenticated = !!user?.id;

  const [article, setArticle] = useState<Article>({
    userId: '',
    title: 'Loading...',
    location: '',
    content: '',
    photos: '',
    likes: 0,
    isLikedByMe: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const isOwner = isAuthenticated && Number(article.userId) === Number(user.id);

  const getArticle = useCallback(async (articleId: string) => {
    try {
      const res = await fetch(`${API_SERVER}/article/${articleId}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      if (!data?.id) throw new Error('Invalid article data');
      setArticle(data);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Failed to get article data.');
      setArticle((prev) => ({ ...prev, title: 'Article Not Found' }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLike = useCallback(async () => {
    if (!article.id || isLiking) return;
    setIsLiking(true);

    try {
      const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Like failed:', res.status, errorText);
        throw new Error('文章按讚失敗。.');
      }

      const result: LikeResponse = await res.json();
      if (typeof result.newLikesCount !== 'number') {
        throw new Error('後端回應無效：缺少 newLikesCount 值。');
      }

      setArticle((prev) => ({
        ...prev,
        likes: result.newLikesCount,
        isLikedByMe: result.isLikedByMe ?? prev.isLikedByMe,
      }));

      toast.success('您喜歡這篇文章！');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '按讚時發生意外錯誤。';
      console.error('Like Error:', err);
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  }, [article.id, isLiking, getAuthHeader]);

  const handleDelete = useCallback(async () => {
    if (!article.id) return;
    // toast((t) => (
    //   <>
    //     <span>are you sure you want to delete this article</span>{' '}
    //     <button></button>
    //     <button onClick={()=> toast.dismiss(t.id)}>

    //     </button>
    //   </>
    // ));
    // if (!confirm('您確定要刪除這篇文章嗎？')) return;

    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    };

    if (!headers.Authorization) {
      toast.error('您必須登入才能刪除這篇文章。');
      return;
    }

    try {
      const res = await fetch(`${API_SERVER}/article/${article.id}`, {
        method: 'DELETE',
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Delete failed:', res.status, errorText);
        throw new Error(`Failed to delete article: ${res.status}`);
      }

      toast.success('文章已成功刪除.');
      router.push('/article/');
    } catch (err) {
      console.error('Delete Error:', err);
      toast.error(
        err instanceof Error ? err.message : 'Unexpected error during deletion.'
      );
    }
  }, [article.id, getAuthHeader, router]);

  useEffect(() => {
    if (pid) {
      getArticle(pid);
    } else {
      setIsLoading(false);
    }
  }, [pid, getArticle]);

  const showConfirmToast = () => {
    const toastId = toast.custom(
      (t) => (
        <div
          style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            ⚠️ 你確定要執行這個操作嗎？
          </p>

          <div
            style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
          >
            {/* 1. 取消按鈕：只關閉吐司 */}
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: '#eee',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              取消
            </button>

            {/* 2. 確認按鈕：執行功能 AND 關閉吐司 */}
            <button
              onClick={() => {
                handleDelete(); // <--- 執行你的功能
                toast.dismiss(t.id); // <--- 關閉吐司
              }}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              確認執行
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // <--- 設置為無限長，直到使用者點擊按鈕才關閉
        position: 'top-center',
      }
    );
  };

  if (isLoading) return <StatusDisplay message="Loading article details..." />;
  if (!pid) return <StatusDisplay message="Cannot find article ID." />;
  if (article.title === 'Article Not Found')
    return <StatusDisplay message="Article Not Found (404)" />;

  return (
    <div className="relative max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
        <SidebarAction />
      </aside>

      <main className="relative flex-grow max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10">
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
          {isOwner && (
            <>
              <Link
                href={`/article/edit?id=${article.id}`}
                className="bg-amber-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
              >
                ✏️ Edit
              </Link>

              <button
                onClick={showConfirmToast}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
              >
                🗑️ Delete
              </button>
            </>
          )}

          <button
            onClick={handleLike}
            disabled={isLiking}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
          >
            ❤️ {isLiking ? 'Liking...' : `Like (${article.likes || 0})`}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
          {article.title}
        </h1>

        <DetailForm article={article} />

        {article?.photos && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">📸 Travel Photos</h2>
            {Array.isArray(article.photos) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {article.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={
                      photo.startsWith('http')
                        ? photo
                        : `${ARTICLE_PHOTOS_PATH}${photo}`
                    }
                    alt={`photo-${idx}`}
                    className="rounded-xl shadow-md w-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/no-image.png')}
                  />
                ))}
              </div>
            ) : (
              <img
                src={
                  typeof article.photos === 'string' &&
                  article.photos.trim() !== ''
                    ? `${ARTICLE_PHOTOS_PATH}${article.photos}`
                    : '/no-image.png'
                }
                alt="article-photo"
                className="rounded-xl shadow-md w-full object-cover"
                onError={(e) => (e.currentTarget.src = '/no-image.png')}
              />
            )}
          </div>
        )}

        <div className="mt-10">
          <MessageBoard articleId={article.id} />
        </div>
      </main>
    </div>
  );
}

// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Link from 'next/link';

// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay';

// import { ARTICLE_PHOTOS_PATH } from '../../../config/image-path';
// import { API_SERVER } from '@/app/config/api-path';
// import { useAuth } from '../../../hooks/use-Auth';
// import toast from 'react-hot-toast';

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   content: string;
//   photos?: string | string[];
//   likes?: number;
//   isLikedByMe?: boolean;
// }

// interface LikeResponse {
//   newLikesCount: number;
//   message: string;
//   isLikedByMe?: boolean;
// }

// export default function ReviewArticlePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pid = searchParams.get('id');

//   const { user, getAuthHeader } = useAuth(); // ⬅⬅⬅ tambah user
//   const isAuthenticated = !!user?.id;

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Loading...',
//     location: '',
//     content: '',
//     photos: '',
//     likes: 0,
//     isLikedByMe: false,
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [isLiking, setIsLiking] = useState(false);

//   // 🟢 Jika user.id adalah number dan article.userId string → convert
//   const isOwner = isAuthenticated && Number(article.userId) === Number(user.id);

//   const getArticle = useCallback(async (articleId: string) => {
//     try {
//       const res = await fetch(`${API_SERVER}/article/${articleId}`);
//       if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
//       const data = await res.json();
//       if (!data?.id) throw new Error('Invalid article data');
//       setArticle(data);
//     } catch (err) {
//       console.error('Fetch Error:', err);
//       alert('Failed to get article data.');
//       setArticle((prev) => ({ ...prev, title: 'Article Not Found' }));
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const handleLike = useCallback(async () => {
//     if (!article.id || isLiking) return;
//     setIsLiking(true);

//     try {
//       const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeader(),
//         },
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error('Like failed:', res.status, errorText);
//         throw new Error('Gagal memproses like artikel.');
//       }

//       const result: LikeResponse = await res.json();
//       if (typeof result.newLikesCount !== 'number') {
//         throw new Error('Respons backend tidak valid: newLikesCount hilang.');
//       }

//       setArticle((prev) => ({
//         ...prev,
//         likes: result.newLikesCount,
//         isLikedByMe: result.isLikedByMe ?? prev.isLikedByMe,
//       }));
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : 'Terjadi kesalahan tidak terduga saat like.';
//       console.error('Like Error:', err);
//       alert(errorMessage);
//     } finally {
//       setIsLiking(false);
//     }
//   }, [article.id, isLiking, getAuthHeader]);

//   const handleDelete = useCallback(async () => {
//     if (!article.id) return;
//     if (!confirm('Are you sure you want to delete this article?')) return;

//     const headers = {
//       'Content-Type': 'application/json',
//       ...getAuthHeader(),
//     };

//     if (!headers.Authorization) {
//       alert('You must be logged in to delete this article.');
//       return;
//     }

//     try {
//       const res = await fetch(`${API_SERVER}/article/${article.id}`, {
//         method: 'DELETE',
//         headers,
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error('Delete failed:', res.status, errorText);
//         throw new Error(`Failed to delete article: ${res.status}`);
//       }

//       alert('Article successfully deleted.');
//       router.push('/article/');
//     } catch (err) {
//       console.error('Delete Error:', err);
//       alert(
//         err instanceof Error ? err.message : 'Unexpected error during deletion.'
//       );
//     }
//   }, [article.id, getAuthHeader, router]);

//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       setIsLoading(false);
//     }
//   }, [pid, getArticle]);

//   if (isLoading) return <StatusDisplay message="Loading article details..." />;
//   if (!pid) return <StatusDisplay message="Cannot find article ID." />;
//   if (article.title === 'Article Not Found')
//     return <StatusDisplay message="Article Not Found (404)" />;

//   return (
//     <div className="relative max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
//       <aside className="w-full md:w-80 flex-shrink-0 pt-10 border-r border-gray-200 md:pr-6">
//         <SidebarAction />
//       </aside>

//       <main className="relative flex-grow max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-10">
//         {/* 🔥 HANYA MUNCUL JIKA PEMILIK ARTIKEL */}
//         <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
//           {isOwner && (
//             <>
//               <Link
//                 href={`/article/edit?id=${article.id}`}
//                 className="bg-amber-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//               >
//                 ✏️ Edit
//               </Link>

//               <button
//                 onClick={handleDelete}
//                 className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105"
//               >
//                 🗑️ Delete
//               </button>
//             </>
//           )}

//           {/* Tombol like selalu bisa ditampilkan */}
//           <button
//             onClick={handleLike}
//             disabled={isLiking}
//             className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
//           >
//             ❤️ {isLiking ? 'Liking...' : `Like (${article.likes || 0})`}
//           </button>
//         </div>

//         <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center md:text-left">
//           {article.title}
//         </h1>

//         <DetailForm article={article} />

//         {article?.photos && (
//           <div className="mt-10">
//             <h2 className="text-2xl font-bold mb-4">📸 Travel Photos</h2>
//             {Array.isArray(article.photos) ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 {article.photos.map((photo, idx) => (
//                   <img
//                     key={idx}
//                     src={
//                       photo.startsWith('http')
//                         ? photo
//                         : `${ARTICLE_PHOTOS_PATH}${photo}`
//                     }
//                     alt={`photo-${idx}`}
//                     className="rounded-xl shadow-md w-full object-cover"
//                     onError={(e) => (e.currentTarget.src = '/no-image.png')}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <img
//                 src={
//                   typeof article.photos === 'string' &&
//                   article.photos.trim() !== ''
//                     ? `${ARTICLE_PHOTOS_PATH}${article.photos}`
//                     : '/no-image.png'
//                 }
//                 alt="article-photo"
//                 className="rounded-xl shadow-md w-full object-cover"
//                 onError={(e) => (e.currentTarget.src = '/no-image.png')}
//               />
//             )}
//           </div>
//         )}

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
