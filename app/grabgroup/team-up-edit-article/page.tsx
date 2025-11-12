'use client';
import { useEffect, useState, useRef } from 'react';
// import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useSearchParams, useRouter } from 'next/navigation';
import RegularButton from '@/components/ui/regular-button';
import MDEditor from '@uiw/react-md-editor';
import { commands } from '@uiw/react-md-editor';
import { useAuth } from '@/hooks/use-Auth';
import { useFetch } from '@/hooks/useFetch';

// import { title } from 'process';
// import dynamic from 'next/dynamic';
// const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
//   ssr: false,
// });

export default function TeamUpEditArticlePage() {
  const [value, setValue] = useState('## 你好，開始編輯你的內文！'); // 文章內文
  const router = useRouter();
  const params = useSearchParams().get('itineraryId');
  const itineraryId = params;
  const { user, isReady } = useAuth();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/check-article?${itineraryId}`;
  const { data, loading, error, refetch } = useFetch(url);

  const handleSendArticle = async (
    itineraryId: number,
    content: string,
    title?: string
  ) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/create-article`;
    const data = {
      itineraryId: itineraryId,
      title: title ?? '',
      content: content,
    };
    try {
      //為了返回上頁用的功能 先找到有沒有該文章 如果有改用update
      refetch();
      console.log('data???=>', data);
      //改為更新

      //2創建文章
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (result.ok) {
        router.push(`/grabgroup/upload-photos?itineraryId=${itineraryId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>edit page</h1>

      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="edit" //  單視窗模式
        visibleDragbar={true}
        spellCheck={false}
        hideToolbar={false}
        commands={[
          commands.bold,
          commands.italic,
          commands.title,
          commands.divider,

          commands.orderedListCommand,
          commands.divider,
          commands.code,
          commands.quote,
        ]}
        extraCommands={[]}
      />

      <RegularButton
        content="送出"
        mode="solid"
        onClick={() => {
          console.log('按下', itineraryId);

          if (itineraryId) handleSendArticle(+itineraryId, value);
        }}
      />
      <pre>{value}</pre>
    </>
  );
}
