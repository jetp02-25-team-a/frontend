// components/spot/Hero.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import Toast from '../../_components/Toast';
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '@/app/place/lib/favoriteAdaptor';
import Link from 'next/link';

export default function Hero({
  spot,
  photos,
}: {
  spot: any;
  photos: string[];
}) {
  const { user, isReady } = useAuth();
  const isLoggedIn = !!user.email;
  const userId = user.id;

  const [idx, setIdx] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);
  const [loginHintOpen, setLoginHintOpen] = useState(false);

  const placeId = useMemo(() => spot?.id ?? spot?.place_id, [spot]); // 該景點的 id

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn || !userId || !placeId) {
      setFavorited(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const isFav = await checkFavorite(userId, placeId);
        if (!cancelled) setFavorited(isFav);
      } catch (err) {
        console.error('checkFavorite error', err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isReady, isLoggedIn, userId, placeId]);

  async function handleToggleFavorite() {
    if (!isReady) return;

    // ❗ 這裡做「要是會員才能收藏」的判斷
    if (!isLoggedIn || !userId) {
      setLoginHintOpen(true); // 開啟提示卡
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (favorited) {
        // 取消收藏
        await removeFavorite(userId, placeId);
        setFavorited(false);
        setToast({ message: '已取消收藏', type: 'success' });
      } else {
        // 新增收藏
        await addFavorite(userId, placeId);
        setFavorited(true);
        setToast({ message: '已加入收藏', type: 'success' });
      }
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err?.message || '操作失敗，請稍後再試',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="flex items-stretch">
        <div className="flex-1 h-full">
          <img
            src={photos[idx]}
            className="w-full h-80 md:h-96 object-cover rounded-xl"
          />
        </div>
        <div className="flex-1 flex flex-col pl-2 items-start justify-between gap-1">
          <div className="flex relative">
            <h1 className="text-3xl font-bold">{spot.name}</h1>
            {/* 收藏功能 */}
            <button
              onClick={handleToggleFavorite}
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
            {loginHintOpen && (
              <div className="absolute right-6 top-10 z-50 w-64 rounded-2xl border bg-white/95 shadow-lg p-3 text-sm">
                <div className="font-semibold mb-1">收藏景點</div>
                <p className="text-xs text-neutral-600 mb-2">
                  只有登入會員才能收藏景點喔～
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginHintOpen(false)}
                    className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-50"
                  >
                    稍後再說
                  </button>
                  <Link
                    href={`/member/login`}
                    className="inline-flex items-center rounded-full bg-amber-400 px-4 py-1.5 text-white text-sm hover:opacity-90"
                  >
                    前往登入
                  </Link>
                </div>
              </div>
            )}
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
                  key={`${p}-${i}`}
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
                  className="m-2 rounded-full bg-white/80 px-2 py-1 hover:cursor-pointer"
                >
                  ‹
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={() => setIdx((idx + 1) % photos.length)}
                  className="m-2 rounded-full bg-white/80 px-2 py-1 hover:cursor-pointer"
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
