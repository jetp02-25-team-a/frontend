'use client';

import { useMemo } from 'react';

export type DrawerPlace = {
  id: number;
  name: string;
  address?: string | null;
  Photos?: { url: string }[];
  type?: string;
  ratingAvg?: number;
  ratingCount?: number;
};

export default function LeftDrawer({
  open,
  onToggle,
  places,
  onCardClick,
}: {
  open: boolean;
  onToggle: () => void;
  places: DrawerPlace[];
  onCardClick: (p: DrawerPlace) => void;
}) {
  const widthOpen = 360; // 展開寬度
  const widthClose = 44; // 收合只留把手

  const cls = useMemo(
    () => `absolute top-3 bottom-3 left-3 z-[1000] pointer-events-none`,
    []
  );

  return (
    <div className={cls}>
      <div
        className="h-full bg-white/95 rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex transition-all duration-300 ease-out pointer-events-auto"
        style={{ width: open ? widthOpen : widthClose }}
      >
        {/* 把手 */}
        <button
          onClick={onToggle}
          className="w-[44px] shrink-0 grid place-items-center hover:bg-black/5"
          aria-label={open ? '收合列表' : '展開列表'}
          title={open ? '收合' : '展開'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-700 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* 內容（垂直卡片清單） */}
        <div
          className={`flex-1 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}
        >
          <div className="h-full flex flex-col">
            <div className="px-3 pt-3 pb-2 text-sm font-medium text-gray-800">
              搜尋結果
              <span className="ml-2 text-gray-500 font-normal">
                {places.length} 筆
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
              {places.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onCardClick(p)}
                  className="w-full text-left rounded-xl border bg-white hover:bg-gray-50 shadow-sm overflow-hidden"
                >
                  <div className="w-full aspect-[16/9] bg-gray-100">
                    <img
                      src={
                        p.Photos?.[0]?.url ||
                        'https://picsum.photos/seed/drawer/640/360'
                      }
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.display =
                          'none')
                      }
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold line-clamp-2">
                      {p.name}
                    </div>
                    {p.address && (
                      <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {p.address}
                      </div>
                    )}
                    {typeof p.ratingAvg === 'number' && (
                      <div className="text-xs text-gray-700 mt-1">
                        {'★'.repeat(Math.round(p.ratingAvg))}
                        {'☆'.repeat(5 - Math.round(p.ratingAvg))}
                        <span className="ml-1 text-[11px] text-gray-500">
                          ({p.ratingCount ?? 0})
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
