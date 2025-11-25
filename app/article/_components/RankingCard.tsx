'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleRankingItem } from '../_components/type';

interface RankingCardProps {
  article: ArticleRankingItem;
}

const ARTICLE_PHOTOS_PATH = 'http://localhost:3005/images/posts/';
const isValidUrl = (url?: string) => !!url;

const RankingCard: React.FC<RankingCardProps> = ({ article }) => {
  const isTopThree = article.rank <= 3;

  const imageUrl = isValidUrl(article.imgUrl)
    ? `${ARTICLE_PHOTOS_PATH}${article.imgUrl}`
    : '/placeholder.jpg';

  const rankColor =
    article.rank === 1
      ? '#FFD700'
      : article.rank === 2
      ? '#C0C0C0'
      : article.rank === 3
      ? '#CD7F32'
      : '#333';

  return (
    <div
      className={`
        flex items-center gap-4 p-4 mb-4 rounded-xl border shadow-sm 
        max-w-3xl mx-auto transition-all hover:shadow-md
        ${isTopThree ? 'bg-yellow-50' : 'bg-white'}
      `}
    >
      {/* Rank */}
      <div
        className="text-3xl font-extrabold w-14 text-center"
        style={{ color: rankColor }}
      >
        #{article.rank}
      </div>

      {/* Image */}
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={article.title}
          width={128}
          height={128}
          className="object-cover rounded-lg w-32 h-32"
        />
      </div>

      {/* Text + Stats */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{article.title}</h3>

        <p className="text-gray-600 text-sm mb-2">
          📍 {article.location} ｜Created at:{' '}
          {new Date(article.createdAt).toLocaleDateString()}
        </p>

        {/* Stats */}
        <div className="text-sm text-gray-500">
          <span className="font-bold text-blue-600 text-lg block">
            ⭐ Score: {article.score.toFixed(2)}
          </span>
          ❤️ {article.likesCount} Likes | 💬 {article.commentsCount} Comments
        </div>

        <Link
          href={`/article/detail?id=${article.id}`}
          className="inline-block mt-3 text-blue-600 hover:underline"
        >
          查看
        </Link>
      </div>
    </div>
  );
};

export default RankingCard;


{
  /* export default RankingCard; */
}

// 'use client';

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useAuth } from '@/hooks/use-Auth';
// import { API_SERVER } from '@/config/api-path';
// import { IMAGE_PATH } from '@/config/image-path';

// interface Article {
//   id: number;
//   image?: string;
//   title: string;
//   location: string;
//   content: string;
// }

// const isValidUrl = (url?: string) => {
//   return url && url.trim() !== '';
// };

// export default function MakeArticle() {
//   const { user, getAuthHeader, isReady, isAuthenticated } = useAuth();
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isReady || !isAuthenticated) return;

//     const fetchArticles = async () => {
//       try {
//         const url = `${API_SERVER}/article/user`;

//         const headers = {
//           'Content-Type': 'application/json',
//           ...getAuthHeader(),
//         };

//         const res = await fetch(url, { headers });
//         const raw = await res.text();

//         if (!res.ok) {
//           const err = JSON.parse(raw);
//           throw new Error(err.message || res.status.toString());
//         }

//         const result = JSON.parse(raw);
//         setArticles(result.data || []);
//       } catch (err) {
//         console.error('Error fetching articles:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, [isReady, isAuthenticated, user?.id]);

//   if (!isReady || loading) return <p>Loading articles...</p>;
//   if (articles.length === 0) return <p>No articles found.</p>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {articles.map((article) => {
//         // Perbaikan URL gambar
//         const imgUrl = isValidUrl(article.image)
//           ? `${IMAGE_PATH}/${article.image}`
//           : '/placeholder.jpg';

//         return (
//           <div
//             key={article.id}
//             className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden"
//           >
//             <Image
//               src={imgUrl}
//               alt={article.title}
//               width={400}
//               height={260}
//               className="object-cover w-full h-64"
//             />

//             <div className="p-4 flex flex-col justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold">{article.title}</h3>

//                 {article.content && (
//                   <p className="text-sm text-gray-600 mt-2 line-clamp-3">
//                     {article.content}
//                   </p>
//                 )}
//               </div>

//               <Link
//                 href={`/article/detail?id=${article.id}`}
//                 className="mt-4 text-blue-600 hover:underline self-start"
//               >
//                 查看
//               </Link>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // // src/components/RankingCard.tsx
// // import React from 'react';
// // import Image from 'next/image';
// // import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';
// // import Link from 'next/link';

// // import { ArticleRankingItem } from '../_components/type'; // Import Interface

// // // 1. Definisikan Interface untuk Props
// // interface RankingCardProps {
// //   article: ArticleRankingItem;
// // }

// // const RankingCard: React.FC<RankingCardProps> = ({ article }) => {
// //   return (
// //     <div style={{
// //       border: '1px solid #ddd',
// //       borderRadius: '8px',
// //       padding: '15px',
// //       marginBottom: '10px',
// //       display: 'flex',
// //       alignItems: 'center',
// //       backgroundColor: article.rank <= 3 ? '#fff3cd' : '#fff'
// //     }}>
// //       <div style={{
// //         fontSize: '1.5em',
// //         fontWeight: 'bold',
// //         marginRight: '20px',
// //         color: article.rank === 1 ? 'gold' : article.rank === 2 ? 'silver' : article.rank === 3 ? 'bronze' : '#333'
// //       }}>
// //         #{article.rank}
// //       </div>
// //       <img
// //         src={article.imgUrl || 'placeholder.jpg'}
// //         alt={article.title}
// //         style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
// //       />
// //       <div style={{ flexGrow: 1 }}>
// //         <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{article.title}</h3>
// //         <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>
// //           Lokasi: **{article.location}**
// //         </p>
// //         <p style={{ margin: '0', fontSize: '0.9em', color: '#999' }}>
// //           Tanggal: {new Date(article.createdAt).toLocaleDateString()}
// //         </p>
// //       </div>
// //       <div style={{ textAlign: 'right', minWidth: '150px' }}>
// //         <p style={{ margin: '0', fontWeight: 'bold', color: 'darkblue' }}>
// //           ⭐ Score: {article.score.toFixed(2)}
// //         </p>
// //         <p style={{ margin: '0', fontSize: '0.8em', color: 'red' }}>
// //           ❤️ Like: {article.likesCount} | 💬 Komen: {article.commentsCount}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default RankingCard;
