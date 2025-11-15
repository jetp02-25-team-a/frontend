'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import { toast } from 'react-hot-toast';

// 🎯 引入我們的新工具和類型
import { apiFetch } from '../_api';
import { FetchError } from '../../_types';

// 引入業務數據結構 (假設統一匯出)
import {
  GetFavoritesResponseData,
  ToggleFavoriteResponseData,
} from '../../_types';
import { FavoritesHook } from '../_hooks';

type FavoriteState = Map<number, boolean>;

/**
 * [全局 Hook] 用於 Context Provider，專注於同步用戶所有收藏狀態。
 */
export function useSharedFavorites(): FavoritesHook {
  const { user, getAuthHeader, logout } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteState>(new Map());
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 1. 初始化：只從後端獲取用戶的全部收藏列表
  useEffect(() => {
    if (!user?.id) {
      setFavorites(new Map());
      return;
    }

    const fetchData = async () => {
      try {
        const headers = getAuthHeader();
        const data = await apiFetch<GetFavoritesResponseData>('/m3/favorite', {
          // 🎯 修正 3: 手動注入 Headers，並移除第三個參數
          headers: headers as HeadersInit,
        });

        const initialFavorites = new Map<number, boolean>();

        if (data.favoriteIds && Array.isArray(data.favoriteIds)) {
          data.favoriteIds.forEach((accId: number) =>
            initialFavorites.set(accId, true)
          );
          setFavorites(initialFavorites);
        } else {
          toast.error('伺服器返回的收藏列表格式錯誤');
        }
      } catch (error) {
        if (error instanceof FetchError) {
          if (error.status === 401) {
            setShowLoginModal(true);
            logout();
          } else {
            toast.error(error.message || '無法取得收藏清單');
          }
        } else {
          toast.error('網絡錯誤或服務器連接失敗');
        }
      }
    };

    fetchData();
  }, [user?.id, logout, getAuthHeader]);

  // 2. 切換收藏邏輯 (操作全局狀態，使用 apiFetch)
  const toggleFavorite = async (accId: number) => {
    if (!user?.id) {
      setShowLoginModal(true);
      return;
    }

    const isCurrentlyFavorite = favorites.get(accId) || false;
    const prevState = new Map(favorites);

    // 樂觀更新
    setFavorites((prev) => {
      const newFavorites = new Map(prev);
      newFavorites.set(accId, !isCurrentlyFavorite);
      return newFavorites;
    });

    try {
      const headers = getAuthHeader();

      const responseData = await apiFetch<ToggleFavoriteResponseData>(
        `/m3/favorite/${accId}/toggle`,
        {
          method: 'POST',
          headers: headers as HeadersInit,
        }
      );

      const actionText = responseData.isFavorite
        ? '已成功收藏'
        : '已從收藏中移除';

      // ⭐️ 狀態同步：以 API 返回的狀態為最終狀態
      setFavorites((prev) => {
        const finalFavorites = new Map(prev);
        finalFavorites.set(accId, responseData.isFavorite);
        return finalFavorites;
      });

      toast.success(actionText);
    } catch (error) {
      setFavorites(prevState); // 錯誤回滾

      if (error instanceof FetchError) {
        if (error.status === 401) {
          setShowLoginModal(true);
          logout();
        }
        toast.error(error.message);
      } else {
        toast.error('網路錯誤，請稍後再試');
      }
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
