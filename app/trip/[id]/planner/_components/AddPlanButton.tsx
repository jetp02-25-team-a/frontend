'use client';

import { useState } from 'react';
import NewPlanForm from '../../_components/NewPlanForm';

export default function AddPlanButton({
  tripId,
  day,
  onSaved,
}: {
  tripId: number;
  day: string;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg"
      >
        ＋ 加入活動
      </button>

      {open && (
        <NewPlanForm
          tripId={tripId}
          day={day}
          onClose={() => setOpen(false)}
          onSaved={onSaved}
        />
      )}
    </>
  );
}
