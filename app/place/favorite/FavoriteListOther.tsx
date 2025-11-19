'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-Auth';
import {
  getFavoritePlaces,
  removeFavorite,
} from '@/app/place/lib/favoriteAdaptor';
import Toast from '@/app/place/_components/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
// ⭐ 新增：用同一套工具組出完整圖片網址
import { buildImageUrl } from '@/config/image-path';
import { useParams } from 'next/navigation';

export default function FavoriteListOther() {
  const params = useParams();
  const userId = Number(params.userId);

  // 載入收藏列表
  const [loadingList, setLoadingList] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  // 取得收藏清單
  useEffect(() => {
    if (!userId) return;

    async function fetchFav() {
      setLoadingList(true);
      try {
        const list = await getFavoritePlaces(userId);
        setData(list);
      } catch (err) {
        console.error(err);
        setToast({
          message: '收藏載入失敗，請稍後再試',
          type: 'error',
        });
      } finally {
        setLoadingList(false);
      }
    }

    fetchFav();
  }, [userId]);

  if (!userId)
    return <div className="p-4 text-gray-500">請先登入以查看收藏</div>;
  if (loadingList)
    return <div className="p-4 text-gray-500">收藏載入中...</div>;
  if (!data.length)
    return <div className="p-4 text-gray-500">目前沒有收藏景點～</div>;

  return (
    <div className="pt-4">
      {/* Toast 顯示區 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type ?? 'success'}
          onClose={() => setToast(null)}
        />
      )}

      {/* 收藏小卡列表 */}
      <div className="flex flex-col gap-3">
        {data.map((p, idx) => {
          const id: number | undefined = p.id ?? p.place_id;
          const key = id ?? `${p.name}-${idx}`;

          // ✅ 先從回傳物件裡撈出「第一張照片」的 url
          const rawPhotos = p.Photos ?? p.photos ?? [];
          const first =
            Array.isArray(rawPhotos) && rawPhotos.length
              ? typeof rawPhotos[0] === 'string'
                ? rawPhotos[0]
                : rawPhotos[0]?.url
              : null;

          // ✅ 再用 buildImageUrl 補上 API_BASE / 判斷 http / fallback
          const cover =
            buildImageUrl(first) ||
            'https://picsum.photos/seed/default/400/300';

          // ✅ 星等分數
          const rawScore =
            typeof p.avgScore === 'number'
              ? p.avgScore
              : typeof p.score === 'number'
                ? p.score
                : 0;
          const score = Math.max(0, Math.min(5, rawScore));
          const starCount = Math.round(score);

          return (
            <Link
              key={key}
              href={`/place/place-info/${id}`}
              className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-3 py-2
                         hover:shadow-md transition-all duration-150 cursor-pointer"
            >
              {/* 左邊小圖 */}
              <div className="w-[77px] h-[77px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={cover}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://picsum.photos/seed/default/400/300';
                  }}
                />
              </div>

              {/* 中間：名稱＋星等＋地址＋簡介 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{p.name}</h3>

                <div className="flex items-center text-xs mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={i < starCount ? faStarSolid : faStarRegular}
                      className="mr-0.5 text-amber-400"
                    />
                  ))}
                  <span className="ml-1 text-gray-500">{score.toFixed(1)}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1 truncate">
                  {p.address}
                </p>
                {p.introduce && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {p.introduce}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
