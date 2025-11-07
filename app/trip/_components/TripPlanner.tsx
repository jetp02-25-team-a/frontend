'use client';

import DayColumn from './DayColumn';
import { TripPlannerState, TripPlanDetail } from '../types/tripPlannerData';

interface TripPlannerProps {
  planner: TripPlannerState;
  setPlanner: React.Dispatch<React.SetStateAction<TripPlannerState>>;
}

export default function TripPlanner({ planner, setPlanner }: TripPlannerProps) {
  // ✅ dispatch 處理 UPDATE_DETAIL
  const dispatch = (action: {
    type: 'UPDATE_DETAIL';
    payload: TripPlanDetail;
  }) => {
    if (action.type === 'UPDATE_DETAIL') {
      const updatedDetail = action.payload;

      const updatedDays = planner.days.map((day) => {
        const updatedDetails = day.details.map((detail) =>
          detail.id === updatedDetail.id ? updatedDetail : detail
        );
        return { ...day, details: updatedDetails };
      });

      setPlanner({ ...planner, days: updatedDays });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{planner.tripPlan.title}</h2>
      <p className="text-sm text-gray-600 mb-6">
        {planner.tripPlan.area}｜{planner.tripPlan.startDate} ~{' '}
        {planner.tripPlan.endDate}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planner.days.map((day, index) => (
          <DayColumn
            key={day.date}
            date={day.date}
            details={day.details}
            dayIndex={index}
            setPlanner={setPlanner}
            dispatch={dispatch}
          />
        ))}
      </div>
    </div>
  );
}
