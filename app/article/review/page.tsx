'use client';

import ArticleForm from '../_components/ArticleForms';
import MessageBoard from '../_components/MessageBoard';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { title } from 'process';
import { Content } from 'next/font/google';

export default function WriteArticlePage() {
  // 如果網址上設計為 ?pid=123

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [post, setPost] = useState<Post>({
    userId: '',
    title: '',
    location: '',
    Content: '',
    photos: '',
  });
  //定義控制載入指示動畫撥放的狀態

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1>
      <ArticleForm />
      <MessageBoard />
    </main>
  );
}
