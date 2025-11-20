// app/trip/_components/types.ts
export type TripType =
  | 'solo'
  | 'couple'
  | 'friends'
  | 'family'
  | 'group'
  | 'personal';

export interface TripSummary {
  id: number;
  title: string;
  destinationName?: string | null;
  destinationImageUrl?: string | null; // 新增：城市的圖片 URL
  startDate: string;
  endDate: string;
  type: TripType | string;
  coverUrl?: string | null;
}

export interface TripPlan {
  id: number;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  destinationName?: string | null;
}

export type TripDetailItemType = 'spot' | 'hotel' | 'custom';

export interface TripDetailItem {
  id: number;
  type: TripDetailItemType | string;
  title: string;
  address?: string | null;
  url?: string | null;
  startDate: string;
  endDate: string;
  stayHour?: number | null;
  stayMin?: number | null;
  order?: number | null;
}

export interface TripPlanDetail {
  trip: TripPlan;
  details: TripDetailItem[];
}

// Packing
export interface PackingItem {
  id: number;
  TripPlanId: number;
  userId: number;
  templateId?: number | null;
  name: string;
  isChecked: boolean;
}

// Expense
export interface ExpenseItem {
  id: number;
  tripId: number;
  typeId: number;
  typeName?: string; // 後端如果有 join 出來的類別名稱就放這
  title: string;
  place?: string | null;
  date: string;
  amount: number;
  note?: string | null;
}
