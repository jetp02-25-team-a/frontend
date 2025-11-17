'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildImageUrl } from '@/config/image-path';

const INTERVAL = 4000;
const FALLBACK = 'https://loremflickr.com/800/600/food,noodles,ramen?lock=4';
const slogans = [
  '在旅途中相遇，讓故事交織。',
  '開始書寫屬於你的故事吧。',
  '旅行，讓回憶發光。',
  '帶著靈魂上路，遇見更多美好',
  '把足跡留在你想去的地方',
];

export default function HeroSlider() {
  const [images, setImages] = useState<{ url: string; caption: string }[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchImages() {
      try {
        const API_BASE = 'http://localhost:3005';
        const res = await fetch(`${API_BASE}/api/random-images`);
        const json = await res.json();

        if (json.success) {
          setImages(
            json.data.map((x: any) => ({
              url: buildImageUrl(x.url),
              caption: x.caption,
            }))
          );
        }
      } catch (err) {
        console.error('Fetch random images error:', err);
      }
    }

    fetchImages();
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [images.length]);

  if (!images.length)
    return <div className="h-[500px] w-full bg-gray-200 animate-pulse" />;

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-black">
      <motion.div
        className="flex h-full"
        animate={{ x: `-${current * 100}%` }}
        transition={{ ease: 'easeInOut', duration: 0.6 }}
      >
        {images.map((item, idx) => {
          const slogan = slogans[idx % slogans.length]; // 重點在這行

          return (
            <div key={idx} className="relative min-w-full h-full">
              <img
                src={item.url}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK;
                }}
              />

              {/* 遮罩 */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Slogan 文字，跟這一張 slide 綁在一起，會一起平移 */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-white text-3xl md:text-5xl font-bold tracking-wide drop-shadow-lg text-center">
                  {slogan}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* 小圓點指示器 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === current ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
