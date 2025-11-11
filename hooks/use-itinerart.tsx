'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Children,
} from 'react';
import {
  ItineraryContextType,
  ItineraryData,
  Node,
  StayNode,
  GoogleMapPlace,
} from '../app/grabgroup/_types/itineraryTypes';

export const ItineraryContext = createContext<ItineraryContextType | null>(
  null
);
ItineraryContext.displayName = 'trip_content';

export function ItineraryProvider({ children }: { children: React.ReactNode }) {
  const [itineraryData, setItineraryData] = useState<ItineraryData[] | null>(
    null
  );

  return (
    <ItineraryContext.Provider value={{ itineraryData, setItineraryData }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary 必須在 ItineraryProvider 內使用');
  }
  return context;
}
