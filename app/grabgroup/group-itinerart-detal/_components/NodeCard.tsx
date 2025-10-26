'use client';
import Image from 'next/image';
import { getTimeCost } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { reduceTimeWrap } from '../../utils';
import {
  faTrashCan,
  faEllipsis,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
interface NodeCardProps {
  duration_minute: string;
  title: string;
  address: string;
  image: string;
  start_time: string;
  end_time: string;
}
export default function NodeCard({
  image,
  duration_minute,
  title,
  address,
  start_time,
  end_time,
}: NodeCardProps) {
  return (
    <div className="flex items-center ">
      <div className="flex flex-col w-[100px] px-3 gap-1 items-center">
        <p className="text-gray-400">
          {Number(start_time?.slice(0, 2)) < 12
            ? `上午${start_time}`
            : `下午${reduceTimeWrap(start_time, '12:00')}`}
        </p>
        <FontAwesomeIcon
          icon={faLocationDot}
          className="text-red-700 text-4xl"
        />
        <p className="text-gray-400">
          {' '}
          {Number(end_time?.slice(0, 2)) < 12
            ? `上午${end_time}`
            : `下午${reduceTimeWrap(end_time, '12:00')}`}
        </p>
      </div>
      <div className="bg-white w-lg h-[97px] flex gap-2.5 p-2.5 ">
        <Image width={77} height={77} src={image} alt=""></Image>
        <div className="w-full">
          <p className="text-red-500">{getTimeCost(duration_minute)}</p>
          <h2>{title}</h2>
          <p>{address.length > 20 ? address + '...' : address}</p>
        </div>

        <div className="flex flex-col justify-between">
          <FontAwesomeIcon icon={faEllipsis} className="text-gray-400" />
          <FontAwesomeIcon icon={faTrashCan} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
