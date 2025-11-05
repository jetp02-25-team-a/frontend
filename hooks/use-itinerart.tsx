'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  Children,
} from 'react';

interface GoogleMapPlace {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoReference: string;
}

interface Node {
  id: number;
  durationMinutes: number;
  GoogleMapPlace: GoogleMapPlace;
  //                     "GoogleMapPlace": {
}
interface StayNode {
  id: number;
}

interface ItineraryData {
  //一天
  itineraryId: number;
  dayDate: string; //日期
  startTime: string;
  Nodes: Node[] | [];
  StayNodes: StayNode[] | [];
}
interface ItineraryContextType {
  itineraryData: ItineraryData[] | null;
  setItineraryData: React.Dispatch<
    React.SetStateAction<ItineraryData[] | null>
  >;
}

export const ItineraryContext = createContext<ItineraryContextType | null>(
  null
);

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
