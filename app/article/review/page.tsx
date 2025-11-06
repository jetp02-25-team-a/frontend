'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleForms from '../_components/ArticleForms';
import MessageBoard from '../_components/MessageBoard';

interface Article {
  userId: string;
  title: string;
  location: string;
  content: string;
  photos: string;
}

export default function WriteArticlePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [article, setArticle] = useState<Article>({
    userId: '',
    title: '',
    location: '',
    content: '',
    photos: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  const getArticle = async (pid: string) => {
    const URL = `http://localhost:3005/api/article/${pid}`;
    try {
      const res = await fetch(URL);
      console.log(res);
      const resData = await res.json();
      console.log(resData);

      if (resData.id) {
        setArticle(resData);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === 'string') {
      getArticle(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <main className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Loading article...</h2>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Article (SearchParams)</h1>
      <hr className="mb-6" />
      <h2 className="text-2xl mb-2">{article.title}</h2>
      <p className="text-gray-600 mb-4">Location: {article.location}</p>
      <p>{article.content}</p>
      <div className="mt-8">
        <ArticleForms />
        <MessageBoard />
      </div>
    </main>
  );
}
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
