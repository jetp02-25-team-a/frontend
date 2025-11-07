// 行程包 TripPlan
export interface TripPlan {
  id: number;
  userId: number;
  title: string;
  area: string;
  startDate: string; // ISO 格式，例如 "2025-12-18"
  endDate: string;
  url: string; // 封面圖片
}

// 單一景點 TripPlanDetail
export interface TripPlanDetail {
  id: number;
  TripPlanId: number;
  userId: number;
  title: string;
  address: string;
  stayTime: string; // 例如 "1小時"
  startDate: string; // ISO 格式，例如 "2025-12-18T09:00:00"
  endDate: string;
  url: string; // 景點圖片
  order: number; // 排序用
}

// 每日行程區塊
export interface TripDay {
  date: string; // 例如 "2025-12-18"
  details: TripPlanDetail[];
}

// TripPlanner 整體狀態
export interface TripPlannerState {
  tripPlan: TripPlan;
  days: TripDay[];
}
export type TripPlannerAction =
  | { type: 'ADD_DETAIL'; payload: TripPlanDetail }
  | { type: 'UPDATE_DETAIL'; payload: TripPlanDetail }
  | { type: 'DELETE_DETAIL'; payload: { id: number } }
  | {
      type: 'MOVE_DETAIL';
      payload: { fromDay: number; toDay: number; detail: TripPlanDetail };
    };
