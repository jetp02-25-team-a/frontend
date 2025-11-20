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
          ? 'opacity-50 scale-95 rotate-2 z-50 shadow-2xl' 
          : 'opacity-100 scale-100 rotate-0'
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
      {/* 時間軸連接點 */}
      <div className="absolute left-[-11px] top-6 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm z-10" />

      {/* 卡片內容 */}
      <div className="flex gap-4 bg-white rounded-xl p-4 border border-neutral-200 hover:shadow-md transition-shadow">
        {/* 左側：時間 */}
        <div className="flex-shrink-0 w-20 text-right">
          <div className="text-sm font-semibold text-neutral-900">{startTime}</div>
          <div className="text-xs text-neutral-500 mt-1">{endTime}</div>
        </div>

        {/* 中間：內容 */}
        <div className="flex-1 min-w-0">
          {/* 圖片 */}
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-neutral-100">
            <img
              src={imageUrl}
              alt={detail.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/trip_sample.jpg';
              }}
            />
          </div>

          {/* 標題和地址 */}
          <div className="mb-2">
            <h3 className="font-semibold text-neutral-900 mb-1">{detail.title}</h3>
            {detail.address && (
              <div className="flex items-start gap-1 text-sm text-neutral-600">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="line-clamp-2">{detail.address}</span>
              </div>
            )}
          </div>

          {/* 標籤和停留時間 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
              {detail.type === 'spot'
                ? '景點'
                : detail.type === 'hotel'
                  ? '住宿'
                  : detail.type === 'food'
                    ? '美食'
                    : '其他'}
            </span>
            {duration && (
              <span className="text-xs text-neutral-500">{duration}</span>
            )}
          </div>
        </div>

        {/* 右側：操作按鈕 */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            title="編輯"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('確定要刪除此行程項目嗎？')) {
                onDelete?.();
              }
            }}
            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="刪除"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
