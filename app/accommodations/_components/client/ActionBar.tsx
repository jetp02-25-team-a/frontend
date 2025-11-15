'use client';

import { JSX, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaHeart,
  FaShareAlt,
  FaExclamationTriangle,
  FaCalendarPlus,
} from 'react-icons/fa';

// 動作類型
export type ActionType = 'favorite' | 'share' | 'report' | 'plan';

// 通用 ActionItem
export interface ActionItem {
  type: ActionType; // 動作類型
  label: string; // 顯示文字
  icon: JSX.Element; // Icon 元件
  onClick: () => void; // 點擊事件
  enabled?: boolean; // 新增 flag
}

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
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const [isFavorite, setIsFavorite] = useState(initialIsFavorited);

  const handleGoBack = () => {
    if (from === 'list' && window.history.length > 1) {
      router.back(); // 從列表卡片進來 → 回上一頁
    } else {
      router.push('/accommodations'); // 不是 → 回預設列表頁
    }
  };

  // 收藏邏輯
  const handleFavoriteClick = async () => {
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);

    try {
      console.log(`[模擬] 後端請求: ${newStatus ? '收藏' : '取消收藏'}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.refresh();
    } catch (error) {
      setIsFavorite(!newStatus);
      alert(error + '更新收藏狀態失敗，已回滾。');
    }
  };

  // 其他動作邏輯
  const handleShareClick = () => {
    console.log(`[模擬] 分享住宿 ${accommodationId}`);
  };

  const handleReportClick = () => {
    console.log(`[模擬] 報錯住宿 ${accommodationId}`);
  };

  const handlePlanClick = () => {
    console.log(`[模擬] 加入行程 ${accommodationId}`);
  };

  // 配置化 actions
  const actions: ActionItem[] = [
    {
      type: 'favorite',
      label: '收藏',
      icon: (
        <FaHeart
          className={
            isFavorite
              ? 'text-xl text-red-500 cursor-pointer transition-colors'
              : 'text-xl text-gray-400 hover:text-red-400 cursor-pointer transition-colors'
          }
        />
      ),
      onClick: handleFavoriteClick,
      enabled: true, // 已完成 → 顯示
    },
    {
      type: 'share',
      label: '分享',
      icon: (
        <FaShareAlt className="text-xl text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
      ),
      onClick: handleShareClick,
      enabled: false, // 還沒做 → 不顯示
    },
    {
      type: 'report',
      label: '報錯',
      icon: (
        <FaExclamationTriangle className="text-xl text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
      ),
      onClick: handleReportClick,
      enabled: false,
    },
    {
      type: 'plan',
      label: '加入行程',
      icon: (
        <FaCalendarPlus className="text-xl text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
      ),
      onClick: handlePlanClick,
      enabled: false,
    },
  ];

  return (
    <div className="w-full flex justify-between px-8 py-4">
      {/* 左側 breadcrumb */}
      <div className="text-[20px] flex gap-2.5">
        <a
          className="px-2.5 cursor-pointer hover:underline transition-colors text-blue-600"
          onClick={(e) => {
            e.preventDefault();
            handleGoBack();
          }}
        >
          Go Back
        </a>
        <span className="px-2.5">/</span>
        <span className="px-2.5">{title}</span>
      </div>

      {/* 右側 actions */}
      <div className="text-[20px] flex items-center gap-6">
        {actions
          .filter((action) => action.enabled)
          .map((action) => (
            <div
              key={action.type}
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={action.onClick}
            >
              <span>{action.label}</span>
              {action.icon}
            </div>
          ))}
      </div>
    </div>
  );
}
