'use client';

import { useState } from 'react';
import AttractionCard from './AttractionCard';
import EditAttractionModal from './EditAttractionModal';
import { TripPlanDetail } from '../types/tripPlannerData';

interface Props {
  date: string;
  details: TripPlanDetail[];
  dayIndex: number;
  setPlanner: React.Dispatch<any>;
  dispatch: (action: {
    type: 'UPDATE_DETAIL';
    payload: TripPlanDetail;
  }) => void;
}

export default function DayColumn({
  date,
  details,
  dayIndex,
  setPlanner,
  dispatch,
}: Props) {
  const [editingDetail, setEditingDetail] = useState<TripPlanDetail | null>(
    null
  );

  return (
    <div className="bg-white rounded-xl p-4 shadow relative">
      <h3 className="text-lg font-semibold mb-2">
        第 {dayIndex + 1} 天（{date}）
      </h3>

      <div className="flex flex-col gap-4">
        {details.map((detail) => (
          <div
            key={detail.id}
            onClick={() => setEditingDetail(detail)}
            className="cursor-pointer hover:shadow-md transition"
          >
            <AttractionCard detail={detail} dispatch={dispatch} />
          </div>
        ))}
      </div>

      {editingDetail && (
        <EditAttractionModal
          detail={editingDetail}
          onClose={() => setEditingDetail(null)}
          onSave={(updated) => {
            dispatch({ type: 'UPDATE_DETAIL', payload: updated });
            setEditingDetail(null);
          }}
        />
      )}
    </div>
  );
}
