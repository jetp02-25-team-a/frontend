// components/spot/Hero.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import Toast from '../../_components/Toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export default function Hero({
  spot,
  photos,
  userId = 10,
}: {
  spot: any;
  photos: string[];
  userId?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  const placeId = useMemo(() => spot?.id ?? spot?.place_id, [spot]); // 該景點的 id

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/favorite/check?userId=${userId}&placeId=${placeId}`,
          {
            cache: 'no-store',
          }
        );
        const json = await res.json();
        if (res.ok) setFavorited(Boolean(json.favorited));
      } catch (err) {
        console.error('收藏狀態檢查失敗', err);
      }
    };
    checkFavorite();
  }, [userId, placeId]);

  async function toggleFavorite() {
    if (loading) return;
    if (!userId) {
      setToast({ message: '請先登入', type: 'error' });
      return;
    }
    if (!placeId) return;
    setLoading(true);
    const next = !favorited;
    setFavorited(next);

    try {
      if (next) {
        // ✅ 正確：單數路由，且 body 要帶 userId + placeId
        const res = await fetch(`${API_BASE}/api/favorite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, placeId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || '新增收藏失敗');
        setToast({ message: '已加入收藏', type: 'success' });
      } else {
        // ✅ 正確：單數路由，且 query 要帶 userId
        const res = await fetch(
          `${API_BASE}/api/favorite/${placeId}?userId=${userId}`,
          {
            method: 'DELETE',
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || '取消收藏失敗');
        setToast({ message: '已取消收藏', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      setFavorited(!next); // 回滾
      setToast({ message: '操作失敗，請稍後再試', type: 'error' });
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
