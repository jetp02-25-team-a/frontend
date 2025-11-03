// components/spot/Hero.tsx
'use client';
import { useState } from 'react';
import Toast from '../../_components/Toast';

export default function Hero({
  spot,
  photos,
}: {
  spot: any;
  photos: string[];
}) {
  const [idx, setIdx] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    if (loading) return;
    setLoading(true);
    const next = !favorited;
    setFavorited(next);

    try {
      // 之後要串後端時打開
      // if (next) {
      //   await fetch('/api/favorites', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ placeId: spot.place_id }),
      //   });
      // } else {
      //   await fetch(`/api/favorites/${spot.place_id}`, { method: 'DELETE' });
      // }

      setToast({
        message: next ? '添加收藏成功' : '已取消收藏',
        type: 'success',
      });
    } catch {
      setFavorited(!next);
      setToast({ message: '操作失敗，請稍後再試', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

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
            {/* 收藏功能 */}
            <button
              onClick={toggleFavorite}
              disabled={loading}
              aria-label={favorited ? '取消收藏' : '加入收藏'}
              className="ml-5 shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1 transition hover:bg-amber-50 active:scale-95 disabled:opacity-50"
            >
              <img
                src={favorited ? '/filled-heart.png' : '/unfilled-heart.png'}
                alt={favorited ? '已收藏' : '未收藏'}
                className="h-6 w-6 object-contain hover:cursor-pointer"
              />
            </button>
          </div>
          {/* 景點描述 */}
          <div className="flex-1 flex flex-col w-full">
            <div>
              <p className="mt-2 text-sm opacity-80">{spot.description}</p>
            </div>
            {/* 景點輪播 */}
            <div className="mt-auto grid grid-cols-4 gap-2 relative">
              {photos.map((p, i) => (
                <img
                  key={p}
                  src={p}
                  onClick={() => setIdx(i)}
                  className={`h-16 w-full object-cover rounded-lg cursor-pointer ${i === idx ? 'ring-2 ring-yellow-500' : ''}`}
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
      {/* Toast 提示 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type ?? 'success'}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
