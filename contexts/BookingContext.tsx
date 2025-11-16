import { createContext, useContext } from 'react';
import useSWR from 'swr';
import { apiFetch } from '@/app/accommodations/_lib/_api';

type BookingContextType = {
  bookings: any[] | undefined;
  createBooking: (payload: any) => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const { data: bookings, mutate } = useSWR('/m3/bookings', apiFetch);

  async function createBooking(payload: any) {
    await apiFetch('/m3/bookings', {
      method: 'POST',
      body: payload,
    });
    mutate();
  }

  async function cancelBooking(bookingId: number) {
    await apiFetch(`/m3/bookings/${bookingId}`, {
      method: 'DELETE',
    });
    mutate();
  }

  return (
    <BookingContext.Provider value={{ bookings, createBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking 必須在 BookingProvider 內使用');
  return ctx;
}
