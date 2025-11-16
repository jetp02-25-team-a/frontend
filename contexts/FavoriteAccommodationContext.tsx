'use client';

import { createContext, useContext, useState } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/app/accommodations/_lib/_api';
import { FetchError } from '@/app/accommodations/_types';
import { useAuth } from '@/hooks/use-Auth';
import { toast } from 'react-hot-toast';

type FavoriteAccommodationResponse = {
  favoriteAccIds: number[];
  count: number;
};

type FavoriteAccommodationContextType = {
  favoriteData: FavoriteAccommodationResponse | undefined;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (accommodationId: number) => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
};

const FavoriteAccommodationContext =
  createContext<FavoriteAccommodationContextType | null>(null);

export function FavoriteAccommodationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, getAuthHeader } = useAuth();
  const { data: favoriteData, mutate } = useSWR<FavoriteAccommodationResponse>(
    user?.id ? '/m3/favorite' : null,
    (url: string) =>
      apiFetch<FavoriteAccommodationResponse>(url, {
        headers: getAuthHeader() as HeadersInit,
      })
  );

  const isFavorite = (id: number) =>
    favoriteData?.favoriteAccIds.includes(id) ?? false;

  const [showLoginModal, setShowLoginModal] = useState(false);

  async function toggleFavorite(accommodationId: number) {
    try {
      if (!user?.id) {
        setShowLoginModal(true);
        return;
      }
      await apiFetch(`/m3/favorite/${accommodationId}/toggle`, {
        method: 'POST',
        headers: getAuthHeader() as HeadersInit,
      });
      mutate(); // 更新快取
      toast.success('收藏狀態已更新');
    } catch (error) {
      if (error instanceof FetchError && error.status === 401) {
        setShowLoginModal(true);
      }
      toast.error('操作失敗，請稍後再試');
    }
  }

  return (
    <FavoriteAccommodationContext.Provider
      value={{
        favoriteData,
        isFavorite,
        toggleFavorite,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </FavoriteAccommodationContext.Provider>
  );
}

export function useFavoriteAccommodation() {
  const ctx = useContext(FavoriteAccommodationContext);
  if (!ctx)
    throw new Error(
      'useFavoriteAccommodation 必須在 FavoriteAccommodationProvider 內使用'
    );
  return ctx;
}
