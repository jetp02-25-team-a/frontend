// /trip/data/mockTrips.ts

import { TripPlan } from '../../types/tripPlannerData';

export const mockTrips: TripPlan[] = [
  {
    id: 1,
    userId: 1,
    title: '台北三日遊',
    area: '台北',
    startDate: '2025-12-18',
    endDate: '2025-12-20',
    url: '/covers/taipei.jpg',
  },
  {
    id: 2,
    userId: 1,
    title: '花蓮兩日遊',
    area: '花蓮',
    startDate: '2025-11-10',
    endDate: '2025-11-11',
    url: '/covers/hualien.jpg',
  },
];
