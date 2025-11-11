'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

export type DrawerPlace = {
  id: number;
  name: string;
  address?: string | null;
  introduce?: string | null;
  Photos?: { url: string }[];
  type?: string;
  ratingAvg?: number | string;
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

  // 小工具：把 0~5 分數轉成 5 顆星
  function renderStars(avg: number | undefined) {
    if (avg == null || Number.isNaN(Number(avg))) {
      return <span className="text-xs text-gray-500">尚無評分</span>;
    }
    const score = Math.max(0, Math.min(5, Number(avg)));
    const full = Math.floor(score);
    const hasHalf = score - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: full }).map((_, i) => (
          <FontAwesomeIcon
            key={`f-${i}`}
            icon={faStarSolid}
            className="h-4 w-4 text-amber-500"
          />
        ))}
        {hasHalf && (
          <FontAwesomeIcon icon={faStarHalfStroke} className="h-4 w-4" />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <FontAwesomeIcon
            key={`e-${i}`}
            icon={faStarRegular}
            className="h-4 w-4 text-amber-500"
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">{score.toFixed(1)}</span>
      </div>
    );
  }

  // 小工具：截斷介紹 10~15 字（這裡用 15）
  function brief(text?: string | null, len = 15) {
    if (!text) return '';
    const t = text.trim();
    return t.length > len ? `${t.slice(0, len)}…` : t;
  }

  return (
    <div className={cls}>
      <div
        className="h-full bg-white/95 rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex transition-all duration-300 ease-out pointer-events-auto hover:cursor-pointer"
        style={{ width: open ? widthOpen : widthClose }}
      >
        {/* 把手 */}
        <button
          onClick={onToggle}
          className="w-[44px] shrink-0 grid place-items-center hover:bg-black/5 hover:cursor-pointer"
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
              {places.map((p) => {
                const href = `/place/place-info/${p.id}`;
                const cover =
                  p.Photos?.[0]?.url ??
                  'https://picsum.photos/seed/drawer/640/360';

                return (
                  <Link
                    key={p.id}
                    href={href}
                    className="block rounded-xl border bg-white hover:bg-gray-50 shadow-sm overflow-hidden"
                    title={p.name}
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
                      <div className="mt-1">
                        {renderStars(
                          typeof p.ratingAvg === 'string'
                            ? Number(p.ratingAvg)
                            : p.ratingAvg
                        )}
                      </div>
                      {p.address && (
                        <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {p.address}
                        </div>
                      )}
                      {p.introduce && (
                        <div className="mt-1 text-sm text-gray-700">
                          {brief(p.introduce, 15)}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
