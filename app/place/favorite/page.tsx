// app/place/favorite/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import { getFavoritePlaces } from '@/app/place/lib/favoriteAdaptor';
import Grid from '../_components/Grid';
import Link from 'next/link';

export default function FavoritePage() {
  const { user, isReady } = useAuth();
  const isLoggedIn = !!user?.email;
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Front[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ✅ 只有登入後才去抓收藏
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn || !userId) {
      setData([]);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFavoritePlaces(userId);
        setData(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || '載入收藏失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isReady, isLoggedIn, userId]);

  // 🟡 還在判斷登入狀態
  if (!isReady) {
    return (
      <main className="px-6 py-8">
        <p>載入中...</p>
      </main>
    );
  }

  // 🔒 沒登入：提示去登入
  if (!isLoggedIn) {
    return (
      <main className="px-6 py-8">
        <h1 className="text-2xl font-semibold mb-4">我的收藏</h1>
        <div className="rounded-2xl border px-4 py-6 bg-white">
          <p className="mb-3 text-sm text-neutral-700">
            只有登入會員才能查看收藏的景點喔～
          </p>
          <Link
            href="/member/login"
            className="inline-flex items-center rounded-full bg-amber-400 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            前往登入
          </Link>
        </div>
      </main>
    );
  }

  // ✅ 已登入：顯示收藏清單
  return (
    <main className="px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">我的收藏</h1>

      {loading && (
        <p className="mb-3 text-sm text-neutral-600">載入收藏中...</p>
      )}
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      {data.length === 0 && !loading ? (
        <p className="text-sm text-neutral-600">目前還沒有收藏任何景點～</p>
      ) : (
        <Grid data={data} />
      )}
    </main>
  );
}
