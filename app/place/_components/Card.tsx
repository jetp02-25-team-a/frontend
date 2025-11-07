'use client';
import React from 'react';
import Link from 'next/link';

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
  return (
    <>
      <Link
        href={`place/place-info/${spot?.id}`}
        className="w-full rounded-2xl customize_shadow bg-white overflow-hidden group"
      >
        <div className="w-full h-[240px] object-cover overflow-hidden">
          <img
            src={cover}
            alt={name}
            className="w-full h-full bg-center bg-cover transition-all  duration-700 ease-in-out group-hover:scale-110"
            onError={(e) =>
              ((e.currentTarget as HTMLImageElement).style.display = 'none')
            }
          ></img>
        </div>
        <div className="w-full flex flex-col p-[12px] gap-[10px] ">
          <div className="flex justify-start items-end gap-[10px]">
            <div>
              <p className="text-[16px]">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < Math.round(ratingAvg) ? 'text-amber-500' : 'text-gray-300'
                }
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-500 ml-1">
              ({ratingAvg.toFixed(1)})
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">{address}</p>
          <p className="text-sm">{desc.slice(0, 30)}...</p>
        </div>
      </Link>
    </>
  );
}
