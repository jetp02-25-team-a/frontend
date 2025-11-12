// Detailbar.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart } from 'react-icons/fa';

export interface DetailbarProps {
  title: string;
  isFavorited: boolean;
  accommodationId: number;
}

export default function Detailbar({
  title,
  isFavorited: initialIsFavorited,
  accommodationId,
}: DetailbarProps) {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorited);

  const heartClass = isFavorite
    ? 'text-xl text-red-500 cursor-pointer transition-colors' // 已收藏
    : 'text-xl text-gray-400 hover:text-red-400 cursor-pointer transition-colors'; // 未收藏

  // 🚨 處理收藏點擊事件 (模擬後端)
  const handleFavoriteClick = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus); // 1. 樂觀更新

    try {
      // ⚠️ 模擬後端處理的延遲 (500 毫秒)
      console.log(
        `[模擬] 正在向後端發送 ${newStatus ? '收藏' : '取消收藏'} 請求...`
      );
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log('[模擬] 後端處理成功。');

      // 3. 成功後，強制 Server Component 重新執行 fetch
      router.refresh();
    } catch (error) {
      console.error('處理收藏失敗:', error);
      // 4. 失敗則回滾 UI 狀態
      setIsFavorite(!newStatus);
      alert('模擬更新收藏狀態失敗，已回滾。');
    }
  };

  return (
    <>
      <div className="w-full flex justify-between px-8">
        <div className="text-[20px] flex px-2.5">
          <a
            className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
          >
            Go Back
          </a>
          <div className="flex gap-5 px-2.5">
            <span>/</span>
            <span>{title}</span>
          </div>
        </div>

        <div
          className="text-[20px] flex items-center gap-2.5 px-2.5 cursor-pointer"
          onClick={handleFavoriteClick}
          role="button"
          tabIndex={0}
        >
          <div>收藏</div>
          <div>
            <FaHeart className={heartClass} />
          </div>
        </div>
      </div>
    </>
  );
}
