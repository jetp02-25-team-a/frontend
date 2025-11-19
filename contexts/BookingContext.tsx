'use client';

import { createContext, useContext } from 'react';
import useSWR from 'swr';
import { useAuth } from '../hooks/use-Auth';
import { apiFetch } from '../app/accommodations/_lib/_api';

// ---------------------------
// 類型定義 (保持不變)
// ---------------------------

interface Booking {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | string;
  bookingDate: string;
  Accommodation: {
    name: string;
  };
}

type BookingContextType = {
  bookings: Booking[] | undefined;
  isLoading: boolean;
  error: any;
  mutateBookings: () => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

// ---------------------------
// Context Provider 元件
// ---------------------------

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { getAuthHeader, isAuthenticated, isReady } = useAuth();

  const authHeader = isAuthenticated ? getAuthHeader() : {}; // 🌟 修正點：明確定義回傳類型為 Promise<Booking[]>

  const fetcher = async (url: string): Promise<Booking[]> => {
    // 假設 apiFetch 已經被泛型化，這裡使用 apiFetch<Booking[]>(url, ...)
    return apiFetch<Booking[]>(url, { headers: authHeader as HeadersInit });
  };

  const shouldFetch = isReady && isAuthenticated;

  const {
    data: bookings,
    isLoading,
    error,
    mutate: mutateBookings,
  } = useSWR<Booking[]>(shouldFetch ? '/m3/bookings' : null, fetcher); // 這裡不再報錯，因為 fetcher 的回傳類型匹配 useSWR 的 Data 類型

  const finalIsLoading = !isReady || isLoading;

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoading: finalIsLoading,
        error,
        mutateBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// ---------------------------
// Context Hook (保持不變)
// ---------------------------

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking 必須在 BookingProvider 內使用');
  return ctx;
}
