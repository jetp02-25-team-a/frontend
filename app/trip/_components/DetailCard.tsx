'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { TripDetailItem } from './types';

interface DetailCardProps {
  detail: TripDetailItem;
  index: number;
  onDragStart?: (index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (index: number) => void;
  onDragLeave?: () => void;
  onDrop?: (index: number) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  previousIndex?: number;
}

export default function DetailCard({
  detail,
  index,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onEdit,
  onDelete,
  isDragging = false,
  isDragOver = false,
  previousIndex,
}: DetailCardProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const isFirstRender = useRef(true);

  // 格式化時間
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '下午' : '上午';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${period}${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  // 計算停留時間
  const getDuration = () => {
    if (!detail.stayHour && !detail.stayMin) return null;
    const hours = detail.stayHour || 0;
    const mins = detail.stayMin || 0;
    if (hours > 0 && mins > 0) return `${hours}小時${mins}分鐘`;
    if (hours > 0) return `${hours}小時`;
    if (mins > 0) return `${mins}分鐘`;
    return null;
  };

  // 動畫效果
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (previousIndex !== undefined && previousIndex !== index && cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
      cardRef.current.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transition = '';
        }
      }, 300);
    }
  }, [index, previousIndex]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(index);
    
    if (cardRef.current) {
      cardRef.current.style.opacity = '0.5';
      cardRef.current.style.transform = 'rotate(2deg) scale(0.98)';
    }
  };

  const handleDragEnd = () => {
    if (cardRef.current) {
      cardRef.current.style.opacity = '';
      cardRef.current.style.transform = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(e);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnter?.(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (cardRef.current && !cardRef.current.contains(e.relatedTarget as Node)) {
      onDragLeave?.();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(index);
  };

  const startTime = formatTime(detail.startDate);
  const endTime = formatTime(detail.endDate);
  const duration = getDuration();
  const imageUrl = detail.url || '/trip_sample.jpg';

  return (
    <li
      ref={cardRef}
      className={`relative group transition-all duration-300 ease-out ${
        isDragging 
          ? 'opacity-50 scale-95 z-50 shadow-2xl' 
          : 'opacity-100 scale-100'
      } ${
        isDragOver 
          ? 'ring-2 ring-amber-400 shadow-xl rounded-lg translate-y-[-4px]' 
          : 'ring-0 shadow-none'
      }`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        willChange: isDragging ? 'transform' : 'auto',
      }}
    >
      {/* M5 風格的垂直時間軸 */}
      <div className="flex items-center gap-3 w-full">
        {/* 左側：時間軸 */}
        <div className="flex flex-col items-center flex-shrink-0 w-[100px] px-3 gap-1">
          <p className="text-sm text-neutral-400">{startTime}</p>
          <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white shadow-sm flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-neutral-400">{endTime}</p>
        </div>

        {/* 中間：卡片內容 */}
        <div className="flex-1 bg-white rounded-lg p-3 border border-neutral-200 hover:shadow-md transition-shadow">

          <div className="flex gap-2.5">
            {/* 圖片 */}
            <div className="w-[77px] h-[77px] shrink-0 relative rounded overflow-hidden bg-neutral-100">
              <img
                src={imageUrl}
                alt={detail.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/trip_sample.jpg';
                }}
              />
            </div>

            {/* 內容 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">{detail.title}</h3>
              {detail.address && (
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {detail.address.length > 20 ? detail.address.substring(0, 20) + '...' : detail.address}
                </p>
              )}
            </div>

            {/* 右側：操作按鈕 */}
            <div className="flex-shrink-0 flex flex-col justify-between items-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('確定要刪除此行程項目嗎？')) {
                    onDelete?.();
                  }
                }}
                className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                title="刪除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </li>
  );
}
