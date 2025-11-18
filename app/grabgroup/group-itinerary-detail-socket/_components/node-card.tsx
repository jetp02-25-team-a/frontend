'use client';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faTrashCan,
  faEllipsis,
  faLocationDot,
  faClock,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import { useState, useRef, useEffect } from 'react';
import { IMAGE_PATH } from '../../../config/image-path';

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
  // 新增刪除節點 callback
  onDeleteNode?: (dayIndex: number, nodeIndex: number) => void;
  // 新增時間調整 callback
  onTimeChange?: (
    dayIndex: number,
    nodeIndex: number,
    newDuration: number
  ) => void;
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
  // 新增刪除回調
  onDeleteNode,
  // 新增時間調整回調
  onTimeChange,
}: NodeCardProps) {
  const { setItineraryData } = useItinerary(); //公共

  // 驗證圖片 URL 是否有效的輔助函數
  const isValidImageUrl = (url: string | undefined | null): string | null => {
    if (!url || typeof url !== 'string') return null;
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;

    // 檢查是否為有效的 URL 格式
    const isExternal = /^https?:\/\//i.test(trimmedUrl);
    const isRelative = trimmedUrl.startsWith('/');
    const isData = trimmedUrl.startsWith('data:');

    return isExternal || isRelative || isData ? trimmedUrl : null;
  };

  // 時間調整面板狀態
  const [showTimePanel, setShowTimePanel] = useState(false);
  const [tempDuration, setTempDuration] = useState(duration_minute);
  const panelRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setShowTimePanel(false);
      }
    };

    if (showTimePanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTimePanel]);

  // 處理時間調整確認
  const handleTimeConfirm = () => {
    if (onTimeChange) {
      onTimeChange(dayIndex, nodeIndex, tempDuration);
    } else {
      // 如果沒有提供回調，使用內部邏輯更新
      setItineraryData((prev) => {
        if (!prev) return prev;
        const updated = [...prev];
        const targetDay = updated[dayIndex];
        if (!targetDay) return prev;
        const newNodes = [...targetDay.Nodes];
        if (newNodes[nodeIndex]) {
          newNodes[nodeIndex] = {
            ...newNodes[nodeIndex],
            durationMinutes: tempDuration,
          };
        }
        updated[dayIndex] = { ...targetDay, Nodes: newNodes };
        return updated;
      });
    }
    setShowTimePanel(false);
  };

  // 處理時間調整取消
  const handleTimeCancel = () => {
    setTempDuration(duration_minute);
    setShowTimePanel(false);
  };

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
        <div className="w-[77px] h-[77px] shrink-0 relative ">
          {isValidImageUrl(image) ? (
            <Image
              fill
              sizes="100%"
              src={isValidImageUrl(image)!}
              alt=""
              className="object-cover"
            />
          ) : (
            // <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
            //   <span className="text-gray-500 text-xs">無圖片</span>
            // </div>
            <Image
              fill
              sizes="100%"
              src={`${IMAGE_PATH}${image}`}
              alt=""
              className="object-cover"
            />
          )}
        </div>
        {/* <Image width={77} height={77} src={image} alt=""></Image> */}
        {/* <img src={image} alt="" className="w-[77px] h-[77px]" /> */}
        <div className="w-full">
          {/* <p className="text-red-500">{getTimeCost(duration_minute)}</p> */}
          <h2>{title}</h2>
          <p>{address.length > 20 ? address + '...' : address}</p>
        </div>

        <div className="flex flex-col justify-between relative">
          {/* 三個小點按鈕 */}
          <FontAwesomeIcon
            icon={faEllipsis}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              setShowTimePanel(!showTimePanel);
            }}
          />

          {/* 時間調整面板 */}
          {showTimePanel && (
            <div
              ref={panelRef}
              className="absolute top-6 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 min-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                <span className="text-sm font-medium">調整停留時間</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">時間（分鐘）:</label>
                  <input
                    type="number"
                    value={tempDuration}
                    onChange={(e) => setTempDuration(Number(e.target.value))}
                    min="5"
                    step="5"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>

                <div className="text-xs text-gray-500">
                  目前: {duration_minute} 分鐘 → {tempDuration} 分鐘
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleTimeConfirm}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    確認
                  </button>
                  <button
                    onClick={handleTimeCancel}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* trash 刪除 */}
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-gray-400 cursor-pointer hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation(); // 防止觸發父元素的點擊事件
              if (onDeleteNode) {
                onDeleteNode(dayIndex, nodeIndex);
              } else {
                // 如果沒有提供回調函數，則使用原本的邏輯
                setItineraryData((prev) => {
                  if (!prev) return prev;
                  const updated = [...prev];
                  const targetDay = updated[dayIndex];
                  if (!targetDay) return prev;
                  const newNodes = targetDay.Nodes.filter(
                    (_, i) => i !== nodeIndex
                  );
                  updated[dayIndex] = { ...targetDay, Nodes: newNodes };
                  return updated;
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
