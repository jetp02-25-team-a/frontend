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
import { API_SERVER } from '../../../config/api-path';

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
  const [title, setTitle] = useState(''); // 新增標題狀態
  const [message, setMessage] = useState(''); // 訊息狀態
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>(''); // 訊息類型
  const { user, isReady } = useAuth();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/check-article?itineraryId=${itineraryId}`;
  const { data, loading, error, refetch } = useFetch(url);

  const handleSendArticle = async (
    itineraryId: number,
    content: string,
    articleTitle: string
  ) => {
    const createApiUrl = `${API_SERVER}/itineraries/create-article`;
    const updateApiUrl = `${API_SERVER}/itineraries/update-article`;
    const requestData = {
      itineraryId: itineraryId,
      title: articleTitle,
      content: content,
    };

    try {
      console.log('發送文章資料:', requestData);

      // 先嘗試創建文章
      let result = await fetch(createApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('API 回應狀態:', result.status);

      // 如果創建失敗且是因為文章已存在，則嘗試更新
      if (!result.ok) {
        const errorResponse = await result.json();
        console.log('創建失敗，錯誤回應:', errorResponse);

        if (
          errorResponse.message &&
          errorResponse.message.includes('該行程已有文章')
        ) {
          console.log('文章已存在，嘗試更新...');
          setMessage('文章已存在，正在更新...');
          setMessageType('success');

          // 嘗試更新文章
          result = await fetch(updateApiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          console.log('更新 API 回應狀態:', result.status);
        }
      }

      if (result.ok) {
        const response = await result.json();
        console.log('文章操作成功:', response);
        setMessage('文章儲存成功！');
        setMessageType('success');
        // 延遲跳轉讓使用者看到成功訊息
        setTimeout(() => {
          router.push(`/grabgroup/upload-photos?itineraryId=${itineraryId}`);
        }, 1500);
      } else {
        const errorResponse = await result.json();
        console.error('API 錯誤回應:', errorResponse);
        setMessage(`文章儲存失敗: ${errorResponse.message || '未知錯誤'}`);
        setMessageType('error');
      }
    } catch (err) {
      console.error('網路錯誤:', err);
      setMessage('網路連線錯誤，請檢查網路狀態後再試');
      setMessageType('error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">編輯文章</h1>

      {/* 訊息顯示區域 */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            messageType === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          文章標題 *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="請輸入文章標題"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文章內容 *
        </label>
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
      </div>

      <RegularButton
        content="送出"
        mode="solid"
        onClick={() => {
          console.log('按下送出按鈕, itineraryId:', itineraryId);

          // 清除之前的訊息
          setMessage('');
          setMessageType('');

          // 驗證必填欄位
          if (!title.trim()) {
            setMessage('請輸入文章標題');
            setMessageType('error');
            return;
          }

          if (!value.trim() || value.trim() === '## 你好，開始編輯你的內文！') {
            setMessage('請輸入文章內容');
            setMessageType('error');
            return;
          }

          if (!itineraryId) {
            setMessage('找不到行程 ID，請確認 URL 參數是否正確');
            setMessageType('error');
            return;
          }

          handleSendArticle(+itineraryId, value, title);
        }}
      />

      {/* 除錯資訊 */}
      {/* <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <p>
          <strong>除錯資訊：</strong>
        </p>
        <p>itineraryId: {itineraryId || '未找到'}</p>
        <p>標題長度: {title.length}</p>
        <p>內容長度: {value.length}</p>
      </div> */}
    </div>
  );
}
