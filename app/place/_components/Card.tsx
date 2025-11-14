'use client';
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

export default function Card({ spot, photo }: { spot: any; photo: string }) {
  const name: string = spot?.name ?? '';
  const address: string = spot?.address ?? '';
  const desc: string = spot?.description ?? '';
  const ratingRaw = spot?.ratingAvg ?? spot?.avgScore ?? 0;
  const ratingAvg: number = Number.isFinite(Number(ratingRaw))
    ? Number(ratingRaw)
    : 0;

  const cover =
    photo ||
    spot?.photos?.[0]?.url ||
    'https://picsum.photos/seed/default/400/300';

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
          <FontAwesomeIcon
            icon={faStarHalfStroke}
            className="h-4 w-4  text-amber-500"
          />
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

  return (
    <>
      <Link
        href={`place/place-info/${spot?.id}`}
        className="w-full bg-white overflow-hidden group "
      >
        <div className="w-full h-[240px] rounded-t-2xl object-cover overflow-hidden ">
          <img
            src={cover}
            alt={name}
            className="w-full h-full bg-center bg-cover transition-all  duration-700 ease-in-out group-hover:scale-110"
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).style.display = 'none')
            }
          ></img>
        </div>
        <div className="w-full flex flex-col p-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.4)] rounded-b-2xl">
          <div className="flex justify-start items-end gap-[10px]">
            <div>
              <p className="text-[16px]">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <div className="mt-1">
              {renderStars(
                typeof ratingAvg === 'string' ? Number(ratingAvg) : ratingAvg
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 truncate">{address}</p>
          <p className="text-sm">{desc.slice(0, 30)}...</p>
        </div>
      </Link>
    </>
  );
}
