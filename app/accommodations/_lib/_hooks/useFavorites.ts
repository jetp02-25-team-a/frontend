'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import { toast } from 'react-hot-toast';

import {
  GetFavoritesResponseData,
  ToggleFavoriteResponseData,
} from '../../_types';

import { useApiQuery } from './'; // 假設 useApiQuery 在同一目錄
import { apiFetch } from '../_api'; // 假設統一匯出
import { FetchError } from '../../_types'; // 假設統一匯出 FetchError

export interface FavoritesHook {
  favorites: FavoriteState;
  toggleFavorite: (accId: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type FavoriteState = Map<number, boolean>;

export function useFavorites(data: { id: number }[]): FavoritesHook {
  const { user, getAuthHeader, logout } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteState>(new Map());
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ************************************************************
  // 1. GET 請求：使用 useApiQuery
  // ************************************************************
  const {
    data: favoriteData,
    error: fetchError,
    loading: isLoadingFavorites,
  } = useApiQuery<GetFavoritesResponseData>(
    user?.id ? '/m3/favorite' : '', // 只有登入後且有 endpoint 才發送請求
    { withAuth: !!user?.id }
  );

  // 處理 useApiQuery 返回的錯誤和狀態
  useEffect(() => {
    // 1. 如果沒登入，清空狀態
    if (!user?.id) {
      setFavorites(new Map());
      return;
    }

    // 2. 處理 401/登入失效錯誤
    if (fetchError instanceof FetchError && fetchError.status === 401) {
      setShowLoginModal(true);
      logout();
      return;
    }

    // 3. 處理其他錯誤 (400, 404, 500, 網路錯誤)
    if (fetchError) {
      // 確保只在數據正在載入或錯誤變更時顯示
      if (!isLoadingFavorites) {
        toast.error(fetchError.message || '無法取得收藏清單');
      }
      return;
    }

    // 4. 數據準備好，初始化 favorites Map
    if (favoriteData?.favoriteIds) {
      const favoriteIdSet = new Set(favoriteData.favoriteIds);
      const initialFavorites = new Map<number, boolean>();

      // 只設置當前列表中的收藏狀態
      data.forEach((item) => {
        if (favoriteIdSet.has(item.id)) {
          initialFavorites.set(item.id, true);
        }
      });
      setFavorites(initialFavorites);
    }

    // 依賴於 user.id, fetchError, favoriteData, data, isLoadingFavorites
    // 注意：這裡 user, data 等的變化會觸發 useApiQuery 重新運行
    // 所以我們依賴 useApiQuery 的輸出 (favoriteData, fetchError)
  }, [user?.id, logout, fetchError, favoriteData, data, isLoadingFavorites]);

  // ************************************************************
  // 2. POST 請求：使用 apiFetch (不需要 useCallback)
  // ************************************************************
  const toggleFavorite = async (accId: number) => {
    if (!user?.id) {
      setShowLoginModal(true);
      return;
    }

    const isCurrentlyFavorite = favorites.get(accId) || false;
    const prevState = new Map(favorites);

    // 樂觀更新 (使用 setFavorites 的函式式更新是安全的)
    setFavorites((prev) => {
      const newFavorites = new Map(prev);
      newFavorites.set(accId, !isCurrentlyFavorite);
      return newFavorites;
    });

    try {
      // 🎯 關鍵：使用通用的 apiFetch 函式
      const headers = getAuthHeader();
      const responseData = await apiFetch<ToggleFavoriteResponseData>(
        `/m3/favorite/${accId}/toggle`,
        {
          method: 'POST',
          // 🎯 使用類型斷言，確保 headers 類型正確
          headers: headers as HeadersInit,
        }
      );

      // 成功處理：apiFetch 保證 responseData 是乾淨的 ToggleFavoriteResponseData
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

      // 🎯 錯誤處理：只需處理 FetchError
      if (error instanceof FetchError) {
        if (error.status === 401) {
          setShowLoginModal(true);
          logout();
        }
        // 顯示後端傳來的 400/404/500 訊息
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
