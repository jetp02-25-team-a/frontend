import React from 'react';

export interface GoogleMapPlace {
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoReference: string;
}

export interface Node {
  id?: number;
  durationMinutes: number;
  placeId?: number;
  GoogleMapPlace: GoogleMapPlace;
  //                     "GoogleMapPlace": {
}
export interface StayNode {
  id: number;
}

export interface ItineraryData {
  //一天
  id?: number;
  itineraryId: number;
  dayDate: string; //日期
  startTime: string;
  Nodes: Node[] | [];
  StayNodes: StayNode[] | [];
}
export interface ItineraryContextType {
  itineraryData: ItineraryData[] | null;
  setItineraryData: React.Dispatch<
    React.SetStateAction<ItineraryData[] | null>
  >;
}

export interface ItineraryAreaCard {
  title: string;
  figure: number;
  User: {
    nickname: string;
  };
  Images: string[];
  Article: {
    title: string;
    content: string;
  };
}

// export interface ItineraryAreaContextType {
//   itineraryAreaCards: ItineraryAreaCard[] | undefined;
//   setItineraryAreaCards: React.Dispatch<
//     React.SetStateAction<ItineraryAreaCard[] | undefined>
//   >;
// }
// type ItineraryAreaContextType = {
//   itineraryAreaCards: ItineraryAreaCard[] | undefined;
//   setItineraryAreaCards: React.Dispatch<
//     React.SetStateAction<ItineraryAreaCard[] | undefined>
//   >;
// };
