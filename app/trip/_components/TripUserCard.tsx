// app/trip/_components/TripUserCard.tsx
'use client';

import { AVATAR_PATH } from '@/config/image-path';
import { useAuth } from '@/hooks/use-Auth';

export default function TripUserCard() {
  const { user } = useAuth();

  const userName = user?.nickname || user?.name || '旅人';
  // 處理頭像路徑，避免雙斜線
  const getAvatarUrl = (avatar: string | undefined): string => {
    if (!avatar) return '/avatar.png';
    // 如果已經是完整 URL，直接返回
    if (avatar.startsWith('http')) return avatar;
    
    // 移除開頭和結尾的斜線，統一處理
    let cleanPath = avatar.replace(/^\/+/, '').replace(/\/+$/, '');
    
    // 如果路徑已經包含 images/avatars，直接構建完整 URL
    if (cleanPath.startsWith('images/avatars/')) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
      return `${API_URL}/${cleanPath}`;
    }
    
    // 否則使用 AVATAR_PATH（已經包含結尾斜線）
    return `${AVATAR_PATH}${cleanPath}`;
  };
  const avatarUrl = getAvatarUrl(user?.avatar);

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white shadow-sm rounded-2xl border border-neutral-100 px-8 py-6 flex items-center gap-6 w-full max-w-md">
        {/* 頭像 - 標準尺寸 80x80px */}
        <div className="w-20 h-20 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center flex-shrink-0">
          <img
            src={avatarUrl}
            className="w-full h-full object-cover"
            alt={userName}
            onError={(e) => {
              e.currentTarget.src = '/avatar_default.png';
            }}
          />
        </div>

        {/* 名稱與狀態 */}
        <div className="flex-1 min-w-0">
          <div className="text-xl font-semibold text-neutral-900 truncate">
            {userName}
          </div>
          <div className="text-sm text-neutral-500 mt-1">私人行程</div>
        </div>
      </div>
    </div>
  );
}
