'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useSharedFavorites } from '../_hooks'; // 🌟 導入全局 Hook

// 類型定義與 useSharedFavorites 返回值一致
type FavoritesHookReturn = ReturnType<typeof useSharedFavorites>;

const FavoriteContext = createContext<FavoritesHookReturn | undefined>(
  undefined
);

/**
 * 🌟 Context Consumer Hook，供子元件讀取全局收藏狀態
 */
export function useFavoritesContext(): FavoritesHookReturn {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error(
      'useFavoritesContext must be used within a FavoriteProvider'
    );
  }
  return context;
}

/**
 * 🌟 收藏狀態 Provider，用於包裹需要狀態同步的區塊
 */
export default function FavoriteProvider({
  children,
}: {
  children: ReactNode;
}) {
  // 呼叫全局 Hook，取得狀態和操作函數
  const favoritesValue = useSharedFavorites();

  return (
    <FavoriteContext.Provider value={favoritesValue}>
      {children}
    </FavoriteContext.Provider>
  );
}
