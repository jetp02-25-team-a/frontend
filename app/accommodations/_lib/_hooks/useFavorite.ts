'use client';

import { useState, useEffect } from 'react';
import { API_SERVER } from '@/config/api-path';
import { useAuth } from '@/hooks/use-Auth';
import { toast } from 'react-hot-toast';

type FavoriteState = Map<number, boolean>;

export function useFavorites(data: { id: number }[]) {
  const { user, getAuthHeader, logout } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteState>(new Map());
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 初始化收藏狀態
  useEffect(() => {
    const initial = new Map<number, boolean>();
    data.forEach((item) => initial.set(item.id, false));
    setFavorites(initial);

    // 只有在 user.id 存在時才執行
    if (!user?.id) {
      setFavorites(new Map()); // 用戶登出時，清空收藏狀態
      return;
    }
    const fetchFavorites = async () => {
      const res = await fetch(`${API_SERVER}/m3/favorite`, {
        headers: { ...getAuthHeader() },
      });

      if (res.status === 401) {
        // Token 失效 → 登出 + 提示登入
        setShowLoginModal(true);
        logout();
        return;
      }

      if (!res.ok) {
        toast.error('無法取得收藏清單，請稍後再試');
        return;
      }

      const json = await res.json();
      const initialFavorites = new Map<number, boolean>();
      json.data.forEach((fav: any) => {
        initialFavorites.set(fav.accommodationId, true);
      });

      setFavorites(initialFavorites);
    };

    fetchFavorites();
  }, [user?.id, data]);

  // 切換收藏
  const toggleFavorite = async (accId: number) => {
    const isCurrentlyFavorite = favorites.get(accId) || false;

    // 1. 儲存舊狀態
    const prevState = new Map(favorites);

    // 2. 樂觀更新
    setFavorites((prev) => {
      const newFavorites = new Map(prev);
      newFavorites.set(accId, !isCurrentlyFavorite);
      return newFavorites;
    });

    try {
      // 3. 呼叫後端 API
      const res = await fetch(`${API_SERVER}/m3/favorite/${accId}/toggle`, {
        method: 'POST',
        headers: { ...getAuthHeader() },
      });

      if (res.status === 401) {
        setFavorites(prevState); // 回滾
        setShowLoginModal(true); // 顯示登入提示
        logout();
        return;
      }

      if (!res.ok) {
        setFavorites(prevState);
        toast.error('收藏失敗，請稍後再試');
      }

      // 4. 成功處理
      const actionText = isCurrentlyFavorite ? '已取消收藏' : '已成功收藏';
      // 🌟 修正點：API 呼叫成功且 res.ok 時，發出成功提示
      toast.success(actionText);
    } catch (error) {
      // 5. 網路錯誤時回滾
      setFavorites(prevState);
      toast.error('網路錯誤，請稍後再試');
    }
  };

  const isFavorite = (id: number) => favorites.get(id) || false;

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    showLoginModal,
    setShowLoginModal,
  };
}
