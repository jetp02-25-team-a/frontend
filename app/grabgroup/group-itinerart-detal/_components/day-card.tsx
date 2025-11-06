'use client';
import { numberToChinese, formatDateToChinese } from '../../utils';
import { useState } from 'react';
interface dayCardProps {
  id: number;
  date: string;
  active: boolean;
  onClick: () => void;
}

export default function DayCard({ id, date, active, onClick }: dayCardProps) {
  return (
    <div
      className={`${active ? 'bg-gray-200' : 'bg-white'} flex shrink-0 flex-col justify-center items-center gap-2.5  border border-gray-300 px-5 py-2.5`}
      onClick={onClick}
    >
      <p>{formatDateToChinese(date)}</p>
      <p>{`第${numberToChinese(id)}天`}</p>
    </div>
  );
}
