'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Children,
} from 'react';
import {
  ItineraryAreaCard,
  ItineraryAreaContextType,
} from '../app/grabgroup/_types/itineraryTypes';

//建立共享資料區
export const ItineraryAreaContext =
  createContext<ItineraryAreaContextType | null>(null);
ItineraryAreaContext.displayName = 'trip_areacard_content';

//只有被 <ItineraryAreaProvider> 包住的元件，才能透過這個 Context 存取或更新裡面的資料。
export function ItineraryAreaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itineraryAreaCards, setItineraryAreaCards] =
    useState<ItineraryAreaCard[]>();

  return (
    <ItineraryAreaContext.Provider
      value={{ itineraryAreaCards, setItineraryAreaCards }}
    >
      {children}
    </ItineraryAreaContext.Provider>
  );
}

// 自定義hooks
export function useItineraryArea() {
  const context = useContext(ItineraryAreaContext);
  if (!context) {
    throw new Error('useItineraryArea 必須在 ItineraryAreaProvider 內使用');
  }
  return context;
}
