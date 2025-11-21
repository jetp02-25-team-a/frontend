// "use client";

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ArticleRankingItem } from '../_components/type';

// interface RankingCardProps {
//   id: number,
//   title: string,
//   location: string,
//   imageUrl: string,
//   likesCount: Number,
//   article: ArticleRankingItem;
// }
// const isValidUrl = (url?: string) => {
//   if (!url) return false;
//   return true;
// };

// export default function RankingCard({
//   id,
//   title,
//   location,
//   imageUrl,
//   likesCount,
// }: RankingCardProps) {
//   const url = isValidUrl(image) ? `${ARTICLE_PHOTOS_PATH}${image}` : '';
//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
//       {isValidUrl(image) ? (
//         <Image
//           src={url}
//           alt={title}
//           width={100}
//           height={140}
//           className="object-cover w-full h-64"
//         />
//       ) : (
//         <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
//           No image available
//         </div>
//       )}

// const RankingCard: React.FC<RankingCardProps> = ({ article }) => {
//   const isTopThree = article.rank <= 3;

//   return (
//     <div
//       style={{
//         border: '1px solid #e0e0e0',
//         borderRadius: '12px',
//         padding: '20px',
//         marginBottom: '15px',
//         display: 'flex',
//         alignItems: 'center',
//         backgroundColor: isTopThree ? '#fefce8' : '#fff',
//         boxShadow: isTopThree ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
//         transition: 'transform 0.2s',
//       }}
//     >
//       {/* Rank */}
//       <div
//         style={{
//           fontSize: '2em',
//           fontWeight: 'extrabold',
//           marginRight: '20px',
//           width: '40px',
//           textAlign: 'center',
//           color:
//             article.rank === 1
//               ? '#FFD700'
//               : article.rank === 2
//               ? '#C0C0C0'
//               : article.rank === 3
//               ? '#CD7F32'
//               : '#333',
//         }}
//       >
//         #{article.rank}
//       </div>

//       {/* Image */}
//       <img
//         src={article.imgUrl || '/placeholder.jpg'}
//         alt={article.title}
//         style={{
//           width: '90px',
//           height: '90px',
//           objectFit: 'cover',
//           borderRadius: '8px',
//           marginRight: '20px',
//         }}
//       />

//       {/* Detail */}
//       <div style={{ flexGrow: 1 }}>
//         <h3
//           style={{
//             margin: '0 0 5px 0',
//             fontSize: '1.4em',
//             color: '#1a202c',
//           }}
//         >
//           {article.title}
//         </h3>

//         <p style={{ margin: 0, fontSize: '0.9em', color: '#4a5568' }}>
//           📍 {article.location} ｜ Dibuat:{' '}
//           {new Date(article.createdAt).toLocaleDateString()}
//         </p>
//       </div>

//       {/* Stats */}
//       <div style={{ textAlign: 'right', minWidth: '180px' }}>
//         <p
//           style={{
//             margin: '0 0 5px 0',
//             fontWeight: 'bold',
//             fontSize: '1.2em',
//             color: '#2b6cb0',
//           }}
//         >
//           ⭐ Score: {article.score.toFixed(2)}
//         </p>

//         <p style={{ margin: 0, fontSize: '0.8em', color: '#718096' }}>
//           ❤️ {article.likesCount} Likes | 💬 {article.commentsCount} Comments
//         </p>

//         {/* Link FIX */}
//         <Link
//           href={`/article/detail?id=${article.id}`}
//           className="mt-2 inline-block text-blue-600 hover:underline"
//         >
//           查看
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default RankingCard;

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-Auth';
import { API_SERVER } from '@/config/api-path';
import { IMAGE_PATH } from '@/config/image-path';

interface Article {
  id: number;
  image?: string;
  title: string;
  location: string;
  content: string;
}

const isValidUrl = (url?: string) => {
  return url && url.trim() !== '';
};

export default function MakeArticle() {
  const { user, getAuthHeader, isReady, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    const fetchArticles = async () => {
      try {
        const url = `${API_SERVER}/article/user`;

        const headers = {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        };

        const res = await fetch(url, { headers });
        const raw = await res.text();

        if (!res.ok) {
          const err = JSON.parse(raw);
          throw new Error(err.message || res.status.toString());
        }

        const result = JSON.parse(raw);
        setArticles(result.data || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [isReady, isAuthenticated, user?.id]);

  if (!isReady || loading) return <p>Loading articles...</p>;
  if (articles.length === 0) return <p>No articles found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => {
        // Perbaikan URL gambar
        const imgUrl = isValidUrl(article.image)
          ? `${IMAGE_PATH}/${article.image}`
          : '/placeholder.jpg';

        return (
          <div
            key={article.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden"
          >
            <Image
              src={imgUrl}
              alt={article.title}
              width={400}
              height={260}
              className="object-cover w-full h-64"
            />

            <div className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{article.title}</h3>

                {article.content && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {article.content}
                  </p>
                )}
              </div>

              <Link
                href={`/article/detail?id=${article.id}`}
                className="mt-4 text-blue-600 hover:underline self-start"
              >
                查看
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}


// // src/components/RankingCard.tsx
// import React from 'react';
// import Image from 'next/image';
// import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';
// import Link from 'next/link';

// import { ArticleRankingItem } from '../_components/type'; // Import Interface

// // 1. Definisikan Interface untuk Props
// interface RankingCardProps {
//   article: ArticleRankingItem;
// }

// const RankingCard: React.FC<RankingCardProps> = ({ article }) => {
//   return (
//     <div style={{
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       padding: '15px',
//       marginBottom: '10px',
//       display: 'flex',
//       alignItems: 'center',
//       backgroundColor: article.rank <= 3 ? '#fff3cd' : '#fff'
//     }}>
//       <div style={{
//         fontSize: '1.5em',
//         fontWeight: 'bold',
//         marginRight: '20px',
//         color: article.rank === 1 ? 'gold' : article.rank === 2 ? 'silver' : article.rank === 3 ? 'bronze' : '#333'
//       }}>
//         #{article.rank}
//       </div>
//       <img
//         src={article.imgUrl || 'placeholder.jpg'}
//         alt={article.title}
//         style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }}
//       />
//       <div style={{ flexGrow: 1 }}>
//         <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{article.title}</h3>
//         <p style={{ margin: '0', fontSize: '0.9em', color: '#666' }}>
//           Lokasi: **{article.location}**
//         </p>
//         <p style={{ margin: '0', fontSize: '0.9em', color: '#999' }}>
//           Tanggal: {new Date(article.createdAt).toLocaleDateString()}
//         </p>
//       </div>
//       <div style={{ textAlign: 'right', minWidth: '150px' }}>
//         <p style={{ margin: '0', fontWeight: 'bold', color: 'darkblue' }}>
//           ⭐ Score: {article.score.toFixed(2)}
//         </p>
//         <p style={{ margin: '0', fontSize: '0.8em', color: 'red' }}>
//           ❤️ Like: {article.likesCount} | 💬 Komen: {article.commentsCount}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RankingCard;
