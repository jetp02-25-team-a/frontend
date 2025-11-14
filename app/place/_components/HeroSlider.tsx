'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroImages } from '../lib/fixtures';

const INTERVAL = 4000; // 每張停留時間
const FALLBACK = 'https://loremflickr.com/800/600/food,noodles,ramen?lock=4';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const total = heroImages.length || 0;

  useEffect(() => {
    if (!total) return;
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [total]);

  if (!total)
    return <div className="h-[500px] w-full bg-gray-200 animate-pulse" />;

  return (
    <div className="relative w-full h-[500px] md:h-[500px] overflow-hidden bg-black">
      {/* slider track：不要設定總寬，靠 child 的 min-w-full 來卡版 */}
      <motion.div
        className="flex h-full"
        animate={{ x: `-${current * 100}%` }}
        transition={{ ease: 'easeInOut', duration: 0.6 }}
      >
        {heroImages.map((item, idx) => (
          <div key={item.id ?? idx} className="relative min-w-full h-full">
            {/* 用 contain 讓整張圖完整顯示；外層 bg-black 當 letterbox */}
            <img
              src={item.url || FALLBACK}
              alt={item.caption || 'hero'}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK;
              }}
              loading={idx === current ? 'eager' : 'lazy'}
            />

            {/* 輕微遮罩，別太暗以免壓過圖片 */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* 文字疊在同張 slide 上，會跟著一起平移 */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="text-white/95 text-2xl md:text-4xl font-semibold tracking-wider text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {item.caption ?? ''}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 可選：小圓點指示器 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === current ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
