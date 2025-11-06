'use client';
import { numberToChinese, formatDateToChinese } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan,
  faEllipsis,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
interface dayCardProps {
  id: number;
  date: string;
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function DayCard({
  id,
  date,
  active,
  onClick,
  onDelete,
}: dayCardProps) {
  return (
    <div
      className={`${active ? 'bg-gray-200' : 'bg-white'} flex shrink-0 justify-center items-center gap-4  border border-gray-300 px-5 py-2.5`}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <p>{formatDateToChinese(date)}</p>
        <p>{`第${numberToChinese(id)}天`}</p>
      </div>
      {active && (
        <div className="flex flex-col justify-between h-full">
          <FontAwesomeIcon
            icon={faEllipsis}
            className="text-gray-400 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-gray-400 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </div>
      )}
    </div>
  );
}
