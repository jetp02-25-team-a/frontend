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

interface NodeCardProps {
  duration_minute: number;
  title: string;
  address: string;
  image: string;
  start_time?: string | null;
  end_time?: string | null;
  dayIndex: number;
  nodeIndex: number;
  onClick?: () => void;
  // 新增拖拽相關 props
  onDragStart?: (dayIndex: number, nodeIndex: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (dayIndex: number, nodeIndex: number) => void;
  onDragLeave?: () => void;
  onDrop?: (dayIndex: number, nodeIndex: number) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
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
  onClick,
  // 新增拖拽相關參數
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDragging = false,
  isDragOver = false,
}: NodeCardProps) {
  const { setItineraryData } = useItinerary(); //公共

  const start = new Date(start_time || '');
  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const end = new Date(end_time || '');
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // 🔄 拖拽處理函數
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', `${dayIndex}-${nodeIndex}`);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(dayIndex, nodeIndex);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(e);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnter?.(dayIndex, nodeIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave?.();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(dayIndex, nodeIndex);
  };

  return (
    <div
      className={`flex items-center cursor-move transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isDragOver ? 'ring-2 ring-blue-400 shadow-lg' : ''}`}
      onClick={onClick}
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
