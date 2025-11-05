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
import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import {
  ItineraryContextType,
  ItineraryData,
  Node,
  StayNode,
  GoogleMapPlace,
} from '../../_types/itineraryTypes';

interface NodeCardProps {
  duration_minute: number;
  title: string;
  address: string;
  image: string;
  start_time?: string | null;
  end_time?: string | null;
  dayIndex: number;
  nodeIndex: number;
}
export default function NodeCard({
  image,
  duration_minute,
  title,
  address,
  start_time,
  end_time,
  dayIndex,
  nodeIndex,
}: NodeCardProps) {
  const { itineraryData, setItineraryData } = useItinerary(); //公共

  const start = new Date(start_time);
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const end = new Date(end_time);
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return (
    <div className="flex items-center ">
      <div className="flex flex-col w-[100px] px-3 gap-1 items-center">
        <p className="text-gray-400">{startTime}</p>
        <FontAwesomeIcon
          icon={faLocationDot}
          className="text-red-700 text-4xl"
        />
        <p className="text-gray-400">{endTime}</p>
      </div>
      <div className="bg-white w-lg h-[97px] flex gap-2.5 p-2.5 hover:shadow-[0_0_15px_5px_rgba(250,250,250,0.7)]">
        {/* <Image width={77} height={77} src={image} alt=""></Image> */}
        <img src={image} alt="" className="w-[77px] h-[77px]" />
        <div className="w-full">
          {/* <p className="text-red-500">{getTimeCost(duration_minute)}</p> */}
          <h2>{title}</h2>
          <p>{address.length > 20 ? address + '...' : address}</p>
        </div>

        <div className="flex flex-col justify-between">
          <FontAwesomeIcon
            icon={faEllipsis}
            className="text-gray-400 cursor-pointer"
          />
          {/* trash 刪除 */}
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-gray-400 cursor-pointer"
            onClick={() =>
              setItineraryData(
                // ItineraryContext[dayIndex][nodeIndex];
                (prev) => {
                  if (!prev) return prev;
                  //複製
                  const updated = [...prev];
                  //取到該天
                  const targetDay = updated[dayIndex];
                  if (!targetDay) return prev;
                  //比對該天的節點 並且過濾
                  const newNodes = targetDay.Nodes.filter(
                    (_, i) => i !== nodeIndex
                  );
                  //更新資料 更改key 為Nodes
                  updated[dayIndex] = { ...targetDay, Nodes: newNodes };
                  return updated;
                }
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
