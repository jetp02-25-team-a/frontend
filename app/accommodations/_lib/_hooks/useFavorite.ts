'use client';

import { useState, useEffect } from 'react';
import { API_SERVER } from '@/config/api-path';
import { useAuth } from '@/hooks/use-Auth';
type FavoriteState = Map<number, boolean>;

export function useFavorites(data: { id: number }[]) {
  const { user, getAuthHeader, logout } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteState>(new Map());

  // 初始化收藏狀態
  useEffect(() => {
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
        // Token 失效，強制登出
        logout();
        return; // 終止後續處理
      }

      if (!res.ok) {
        // 其他非 401 的錯誤 (例如 500)，可以在此處加入錯誤訊息提示 (e.g. alert, toast)
        console.error('Failed to fetch favorites list:', res.status);
        return; // 終止後續處理
      }

      const json = await res.json();
      console.log(json);
      const initialFavorites = new Map<number, boolean>();
      json.data.forEach((fav: any) => {
        initialFavorites.set(fav.accommodationId, true);
      });

      setFavorites(initialFavorites);
    };

    fetchFavorites();
  }, [user?.id]);

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
        logout();
        // 4. API 失敗時回滾
        setFavorites(prevState);
      }

      if (!res.ok) {
        // 4. API 失敗時回滾
        setFavorites(prevState);
        console.error('Failed to toggle favorite.');
      }
    } catch (error) {
      // 4. 網路錯誤時回滾
      setFavorites(prevState);
      console.error('Network error during toggle.');
    }
  };

  return { favorites, toggleFavorite };
}
