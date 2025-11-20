// app/trip/_components/TripUserCard.tsx
'use client';

import { API_URL } from '@/config/api-path';
import { useAuth } from '@/hooks/use-Auth';

export default function TripUserCard() {
  const { user } = useAuth();

  const userName = user?.nickname || user?.name || '旅人';
  const avatarUrl = user?.avatar ? `${API_URL}/${user.avatar}` : '/avatar.png';

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
