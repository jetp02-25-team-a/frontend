'use client';

import React from 'react';

export default function Card({ spot, photo }: { spot: any; photo: string }) {
  const name = spot.name;
  const ratingAvg = spot.ratingAvg;
  const desc = spot.description;
  const address = spot.address;
  return (
    <>
      <div className="w-[303px] rounded-2xl customize_shadow bg-white overflow-hidden group">
        <div className="w-full h-[259px] object-cover overflow-hidden">
          <img
            src={photo}
            className="w-full h-full bg-center bg-cover transition-all  duration-700 ease-in-out group-hover:scale-110"
          ></img>
        </div>
        <div className="w-full flex flex-col p-[12px] gap-[10px] ">
          <div className="flex justify-start items-end gap-[10px]">
            <div>
              <p className="text-2xl">{name}</p>
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
          <p className="text-sm">{desc.slice(0, 100)}</p>
        </div>
      </div>
    </>
  );
}
