'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHeart } from 'react-icons/fa';

interface ActionBarProps {
  title: string;
  isFavorited: boolean;
  accommodationId: number;
}

export default function ActionBar({
  title,
  isFavorited: initialIsFavorited,
  accommodationId,
}: ActionBarProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorited);

  const heartClass = isFavorite
    ? 'text-xl text-red-500 cursor-pointer transition-colors'
    : 'text-xl text-gray-400 hover:text-red-400 cursor-pointer transition-colors';

  const handleFavoriteClick = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);

    try {
      console.log(`[模擬] 後端請求: ${newStatus ? '收藏' : '取消收藏'}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.refresh();
    } catch (error) {
      setIsFavorite(!newStatus);
      alert('更新收藏狀態失敗，已回滾。');
    }
  };

  return (
    <div className="w-full flex justify-between px-8 py-4">
      <div className="text-[20px] flex gap-2.5">
        <a
          className="px-2.5 cursor-pointer hover:underline transition-colors text-blue-600"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          Go Back
        </a>
        <span className="px-2.5">/</span>
        <span className="px-2.5">{title}</span>
      </div>

      <div
        className="text-[20px] flex items-center gap-2.5 cursor-pointer"
        onClick={handleFavoriteClick}
      >
        <span>收藏</span>
        <FaHeart className={heartClass} />
      </div>
    </div>
  );
}
