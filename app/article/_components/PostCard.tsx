'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/use-Auth';
import Image from 'next/image';
import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';
import Link from 'next/link';

interface PostCardProps {
  postId: string;
  initialLikes: number;
}

export default function PostCard({ postId, initialLikes }: PostCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const { getAuthHeader } = useAuth();

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3005/api/article/${postId}/like`, {
        method: 'POST',
                headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ increment: 1 }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.totalLikes); // backend should return updated like count
      } else {
        console.error('❌ Failed to like post');
      }
    } catch (error) {
      console.error('❌ Error liking post:', error);
    }
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <p className="text-lg font-semibold">文章 ID: {postId}</p>
      <button
        onClick={handleLike}
        className="mt-2 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        ❤️ Like ({likes})
      </button>
    </div>
  );
}










































// // PostCard.tsx
// 'use client';


// import React, { useState, useCallback } from 'react';
// // Asumsikan Anda menggunakan Axios untuk request API
// import axios from 'axios';

// // --- 1. Definisikan Tipe Props ---
// interface PostCardProps {
//   postId: string;
//   initialLikes: number;
//   isInitialLiked: boolean;
// }

// // --- 2. Komponen Fungsional ---
// const PostCard: React.FC<PostCardProps> = ({ postId, initialLikes, isInitialLiked }) => {
//   // State 1: 存目前岸讚的總數Menyimpan jumlah likes saat ini
//   const [likesCount, setLikesCount] = useState(initialLikes);
//   // State 2: 存目前使用者狀態是否按讚Menyimpan status apakah user saat ini sudah like atau belum
//   const [isLiked, setIsLiked] = useState(isInitialLiked);
//   // State 3: 避免重複案讚Mengelola status loading untuk mencegah klik ganda
//   const [isLoading, setIsLoading] = useState(false);

//   // Menggunakan useCallback untuk memoize fungsi agar performa lebih baik
//   const handleLike = useCallback(async () => {
//     // 避免重複案讚Pencegahan klik ganda
//     if (isLoading) return;

//     // Tentukan aksi yang akan diambil
//     const newIsLikedState = !isLiked;
//     const action = newIsLikedState ? 'like' : 'unlike';
    
//     setIsLoading(true);

//     // --- Optimistic Update (Update UI sebelum Server merespons) ---
//     // Simpan nilai state lama untuk Rollback jika gagal
//     const prevIsLiked = isLiked;
//     const prevLikesCount = likesCount;
    
//     // Perbarui state secara instan
//     setIsLiked(newIsLikedState);
//     setLikesCount(prevCount => prevCount + (newIsLikedState ? 1 : -1));

//     try {
//       // Kirim permintaan ke Next.js API Route atau Backend
//       // Contoh: POST /api/posts/post123/like atau /api/posts/post123/unlike
//       const response = await axios.post(`/api/posts/${postId}/${action}`, {
//         // Anda mungkin perlu mengirim token auth atau data user ID di header
//       });

//       // Opsional: Jika backend merespons dengan total likes yang benar, update state lagi
//       // if (response.data.newCount) {
//       //   setLikesCount(response.data.newCount);
//       // }

//     } catch (error) {
//       console.error('Gagal memperbarui status like:', error);

//       // --- Rollback: Kembalikan state ke kondisi sebelumnya ---
//       setIsLiked(prevIsLiked);
//       setLikesCount(prevLikesCount);
      
//       alert('Gagal memproses aksi Anda. Silakan coba lagi.');

//     } finally {
//       // Pastikan status loading dimatikan
//       setIsLoading(false);
//     }
//   }, [isLiked, isLoading, likesCount, postId]); // Dependency array

//   return (
//     <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
//       <h3>Post ID: {postId}</h3>
//       <p>Status: {isLiked ? 'Disukai' : 'Belum Disukai'}</p>
      
//       {/* Tombol yang memanggil handleLike */}
//       <button 
//         onClick={handleLike} 
//         disabled={isLoading}
//         style={{ 
//             padding: '10px 20px',
//             backgroundColor: isLiked ? '#f44336' : '#9e9e9e',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: isLoading ? 'not-allowed' : 'pointer'
//         }}
//       >
//         {isLoading ? 'Memproses...' : (
//           <>
//             {isLiked ? '❤️ Batalkan Suka' : '🤍 Suka'} ({likesCount})
//           </>
//         )}
//       </button>
//     </div>
//   );
// };

// export default PostCard;