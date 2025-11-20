// // 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth, useAuthRequired } from '@/hooks/use-Auth';
// import { API_SERVER1 } from '../../config/api-path';
// // import { ApiResponse } from './_interfaces/userData';
// import { IMAGE_PATH } from '../../config/image-path';

// interface Article {
//   id: number;
//   title: string;
//   location: string;
//   content: string;
// }

// // const response = await fetch(`${API_SERVER}/articles/user/${user.id}`, {
// //   headers: {
// //     'Content-Type': 'application/json',
// //     Authorization: `Bearer ${user.token}`,
// //   },
// // });
// export default function MyArticles() {
//   const { user, getAuthHeader, isReady, isAuthenticated } = useAuth();
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isReady || !isAuthenticated) return;

//     const fetchArticles = async () => {
//       try {
//         const res = await fetch(`${API_SERVER}/articles/user/${user.id}`, {
//           headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeader(),
//           },
//         });

//         if (!res.ok) {
//           throw new Error('Failed to fetch articles');
//         }

//         const result = await res.json();
//         setArticles(result.data || []);
//       } catch (err) {
//         console.error('Error fetching articles:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, [isReady, isAuthenticated, user.id]);

//   if (!isReady || loading) return <p>Loading articles...</p>;

//   if (articles.length === 0) return <p>No articles found.</p>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">My Articles</h1>
//       {articles.map((article) => (
//         <div key={article.id} className="border p-4 rounded shadow">
//           <h2 className="text-xl font-semibold">{article.title}</h2>
//           <p className="text-sm text-gray-500">📍 {article.location}</p>
//           <p className="mt-2">{article.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAuthRequired } from '@/hooks/use-Auth';
import { API_SERVER } from '@/config/api-path';
// import { ApiResponse } from './_interfaces/userData';
import { IMAGE_PATH } from '../../config/image-path';

interface Article {
  id: number;
  title: string;
  location: string;
  content: string;
}

export default function MyArticles() {
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

        console.log('Fetching:', url);
        console.log('Headers:', headers);

        const res = await fetch(url, { headers });

        const raw = await res.text();
        console.log('Response status:', res.status);
        console.log('Raw response:', raw);

        if (!res.ok) {
          const errorData = JSON.parse(raw);
          console.error('API Error:', errorData);
          throw new Error(`Failed to fetch articles: ${errorData.message || res.status}`);
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
  }, [isReady, isAuthenticated, user.id]);

  if (!isReady || loading) return <p>Loading articles...</p>;
  if (articles.length === 0) return <p>No articles found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Articles</h1>
      {articles.map((article) => (
        <div key={article.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{article.title}</h2>
          <p className="text-sm text-gray-500">📍 {article.location}</p>
          <p className="mt-2">{article.content}</p>
        </div>
      ))}
    </div>
  );
}