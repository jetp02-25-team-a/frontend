'use client';
import { numberToChinese, formatDateToChinese } from '../../utils';
interface dayCardProps {
  id: number;
  date: string;
}

export default function DayCard({ id, date }: dayCardProps) {
  return (
    <div className=" flex shrink-0 flex-col justify-center items-center gap-2.5 bg-white border border-gray-300 px-5 py-2.5">
      <p>{formatDateToChinese(date)}</p>
      <p>{`第${numberToChinese(id)}天`}</p>
    </div>
  );
}
