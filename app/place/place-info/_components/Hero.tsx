// components/spot/Hero.tsx
"use client";
import { useState } from "react";
export default function Hero({
  spot,
  photos,
}: {
  spot: any;
  photos: string[];
}) {
  const [idx, setIdx] = useState(0);
  return (
    <section>
      {/* <img
        src={spot.heroPhoto}
        className="w-full h-72 md:h-96 object-cover rounded-2xl"
      /> */}
      <div className="flex items-stretch">
        <div className="flex-1 h-full">
          <img src={photos[idx]} className="w-full rounded-xl" />
        </div>
        <div className="flex-1 flex flex-col pl-2 items-start justify-between gap-1">
          <div className="flex">
            <h1 className="text-3xl font-bold">{spot.name}</h1>
            <button className="shrink-0 rounded-full border px-3 ml-5 py-1">
              ♡
            </button>
          </div>
          <div className="flex-1 flex flex-col ">
            <div>
              <p className="mt-2 text-sm opacity-80">{spot.description}</p>
            </div>

            <div className="mt-auto grid grid-cols-4 gap-2 relative">
              {photos.map((p, i) => (
                <img
                  key={p}
                  src={p}
                  onClick={() => setIdx(i)}
                  className={`h-16 w-full object-cover rounded-lg cursor-pointer ${i === idx ? "ring-2 ring-yellow-500" : ""}`}
                />
              ))}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  onClick={() =>
                    setIdx((idx - 1 + photos.length) % photos.length)
                  }
                  className="m-2 rounded-full bg-white/80 px-2 py-1"
                >
                  ‹
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={() => setIdx((idx + 1) % photos.length)}
                  className="m-2 rounded-full bg-white/80 px-2 py-1"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
