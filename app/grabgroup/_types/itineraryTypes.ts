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
