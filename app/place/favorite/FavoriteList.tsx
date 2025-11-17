'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import { getFavoritePlaces } from '@/app/place/lib/favoriteAdaptor';
import Card from '@/app/place/_components/Card';

export default function FavoriteList() {
  const { user, isReady } = useAuth();
  const userId = user?.id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!isReady || !userId) return;

    async function fetchFav() {
      setLoading(true);
      try {
        const list = await getFavoritePlaces(userId);
        setData(list);
      } finally {
        setLoading(false);
      }
    }

    fetchFav();
  }, [isReady, userId]);

  if (!isReady) return <div className="p-4 text-gray-500">載入中...</div>;
  if (!userId)
    return <div className="p-4 text-gray-500">請先登入以查看收藏</div>;
  if (loading) return <div className="p-4 text-gray-500">收藏載入中...</div>;
  if (!data.length)
    return <div className="p-4 text-gray-500">目前沒有收藏景點～</div>;

  return (
    <div className="pt-4">
      {/* ⭐ 只在會員中心用的排版，不動原本 Grid */}
      <div className="flex flex-wrap gap-6 justify-center">
        {data.map((p, idx) => {
          const key =
            p?.id ??
            p?.place_id ??
            `${p?.type ?? 'x'}-${p?.name ?? 'n'}-${idx}`;

          const cover =
            Array.isArray(p.photos) && p.photos.length
              ? p.photos[0]
              : 'https://picsum.photos/seed/default/400/300';

          return (
            <div
              key={key}
              className="w-[210px] shadow-md rounded-3xl overflow-hidden bg-white"
            >
              {/* 直接沿用共用 Card，只是外層包一層固定寬度 + 陰影 */}
              <Card spot={p} photo={cover} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
