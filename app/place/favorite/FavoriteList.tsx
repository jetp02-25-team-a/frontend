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

export default function FavoriteList() {
  const { user, isReady } = useAuth();
  const userId = user?.id;

  // 載入收藏列表
  const [loadingList, setLoadingList] = useState(false);
  const [data, setData] = useState<any[]>([]);

  // 單筆刪除 loading（避免同時重複刪）
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  // ⭐ 用來記錄「準備刪除」的那一筆（第一次點愛心）
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);

  // 取得收藏清單
  useEffect(() => {
    if (!isReady || !userId) return;

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
  }, [isReady, userId]);

  // 真正執行取消收藏
  async function executeRemove(placeId: number) {
    if (!isReady || !userId) return;

    setMutatingId(placeId);
    try {
      await removeFavorite(userId, placeId);

      // 從清單中移除
      setData((prev) => prev.filter((p) => (p.id ?? p.place_id) !== placeId));

      // ✅ 成功刪除後的 Toast
      setToast({ message: '已取消收藏', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err?.message || '操作失敗，請稍後再試',
        type: 'error',
      });
    } finally {
      setMutatingId(null);
      setPendingRemoveId(null);
    }
  }

  // 點愛心：第一次 → 警告 Toast；第二次 → 直接刪除 + 成功 Toast
  function handleHeartClick(placeId: number) {
    // 第一次點這個 id
    if (pendingRemoveId !== placeId) {
      setPendingRemoveId(placeId);
      setToast({
        message: '再次點擊愛心即可取消收藏',
        type: 'error',
      });

      // 幾秒後自動清掉 pending 狀態，避免卡太久
      setTimeout(() => {
        setPendingRemoveId((prev) => (prev === placeId ? null : prev));
      }, 4000);

      return;
    }

    // 第二次點同一個 id → 直接刪
    if (mutatingId === null) {
      executeRemove(placeId);
    }
  }

  if (!isReady) return <div className="p-4 text-gray-500">載入中...</div>;
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

          // ✅ cover：安全處理 + 預設圖片
          const cover =
            Array.isArray(p.photos) && p.photos.length > 0
              ? typeof p.photos[0] === 'string'
                ? p.photos[0]
                : p.photos[0].url
              : 'https://picsum.photos/seed/default/400/300';

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

              {/* 右側：愛心（兩段式刪除） */}
              <button
                type="button"
                className="ml-2 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                           hover:bg-orange-50"
                onClick={(e) => {
                  e.preventDefault(); // 不讓 Link 跳頁
                  e.stopPropagation();
                  if (!id) return;
                  handleHeartClick(id);
                }}
                disabled={mutatingId === id}
              >
                <img
                  src={'/filled-heart.png'}
                  alt={'已收藏'}
                  className="h-6 w-6 object-contain hover:cursor-pointer"
                />
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
