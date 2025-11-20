'use client';

import { useState, useEffect, useRef } from 'react';
import DetailCard from './DetailCard';
import type { TripDetailItem } from './types';
import { API_URL } from '@/config/api-path';

interface TripInfoPanelProps {
  details: TripDetailItem[];
  tripId: number;
  onUpdate?: () => void;
  startDate?: string;
  endDate?: string;
}

export default function TripInfoPanel({ 
  details, 
  tripId, 
  onUpdate,
  startDate,
  endDate 
}: TripInfoPanelProps) {
  const [localDetails, setLocalDetails] = useState<TripDetailItem[]>(details);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const previousDetailsRef = useRef<TripDetailItem[]>(details);
  const savedDetailsRef = useRef<TripDetailItem[]>(details); // 保存的版本，用於回滾

  // 當 props.details 更新時同步（避免覆蓋樂觀更新）
  useEffect(() => {
    // 只有在沒有進行中的拖曳操作時才同步
    if (draggedIndex === null && !isSaving) {
      setLocalDetails(details);
      previousDetailsRef.current = details;
      savedDetailsRef.current = details;
    }
  }, [details, draggedIndex, isSaving]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // 🎯 樂觀更新：立即更新 UI
    const newDetails = [...localDetails];
    const draggedItem = newDetails[draggedIndex];
    
    // 從原位置移除
    newDetails.splice(draggedIndex, 1);
    
    // 插入到新位置
    newDetails.splice(targetIndex, 0, draggedItem);
    
    // 更新 order 欄位
    const updatedDetails = newDetails.map((detail, index) => ({
      ...detail,
      order: index,
    }));

    // 記錄當前狀態用於回滾
    savedDetailsRef.current = localDetails;
    
    // 立即更新 UI（樂觀更新）
    setLocalDetails(updatedDetails);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // 背景保存到後端
    await saveOrderChanges(updatedDetails);
  };

  const saveOrderChanges = async (updatedDetails: TripDetailItem[]) => {
    setIsSaving(true);
    
    try {
      // 從 localStorage 讀取 token
      let token = '';
      try {
        const userInfoStr = localStorage.getItem('BackpackUserInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          token = userInfo?.token || '';
        }
      } catch (err) {
        console.error('讀取 token 失敗:', err);
        throw new Error('無法讀取認證資訊');
      }

      // 🚀 使用批量更新 API
      const updates = updatedDetails.map((detail, index) => ({
        id: detail.id,
        order: index,
      }));

      const response = await fetch(`${API_URL}/api/m2/plan/${tripId}/details/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || '保存失敗');
      }

      console.log('✅ 拖曳排序已保存:', result.message);
      
      // 更新保存的版本
      savedDetailsRef.current = updatedDetails;
      previousDetailsRef.current = updatedDetails;
      
      // 觸發父組件更新（可選，如果需要重新載入資料）
      onUpdate?.();
    } catch (error: any) {
      console.error('❌ 拖曳排序保存失敗:', error);
      
      // 🔄 回滾：恢復到保存的版本
      setLocalDetails(savedDetailsRef.current);
      
      // 顯示錯誤提示（可以整合 Toast 組件）
      alert(`保存失敗：${error.message || '未知錯誤'}\n已恢復原排序`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (detailId: number) => {
    try {
      let token = '';
      try {
        const userInfoStr = localStorage.getItem('BackpackUserInfo');
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          token = userInfo?.token || '';
        }
      } catch (err) {
        console.error('讀取 token 失敗:', err);
        return;
      }

      const response = await fetch(`${API_URL}/api/m2/plan/detail/${detailId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('刪除失敗');
      }

      // 更新本地狀態
      setLocalDetails(prev => prev.filter(d => d.id !== detailId));
      onUpdate?.();
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗，請重試');
    }
  };

  const handleEdit = (detail: TripDetailItem) => {
    // TODO: 打開編輯 modal 或導航到編輯頁面
    console.log('編輯行程項目:', detail);
    // 可以實作一個編輯 modal
  };

  // 計算日期範圍
  const getDateRange = () => {
    if (!startDate || !endDate) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const [selectedDay, setSelectedDay] = useState(0);
  const dates = getDateRange();
  const selectedDate = dates[selectedDay];

  // 過濾當天的行程
  const dayDetails = details.filter(detail => {
    if (!selectedDate) return true;
    const detailDate = detail.startDate.split('T')[0];
    return detailDate === selectedDate;
  });

  if (!localDetails || localDetails.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">行程內容</h2>
        <p className="text-neutral-500">尚未新增任何行程內容。</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* 日期切換欄 */}
      {dates.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {dates.map((date, index) => {
                const dateObj = new Date(date);
                const month = dateObj.getMonth() + 1;
                const day = dateObj.getDate();
                const isActive = selectedDay === index;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDay(index)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white font-semibold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {month}月{day}日 第{index + 1}天
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">活動天數上限為7天</span>
              <button
                type="button"
                className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 行程列表 */}
      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          {selectedDate ? `第${selectedDay + 1}天 ${selectedDate}` : '行程內容'}
        </h2>

        {!dayDetails || dayDetails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">尚未新增任何行程內容。</p>
            <button
              type="button"
              onClick={() => {
                // TODO: 打開新增 modal
                console.log('新增行程項目');
              }}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              新增第一個行程
            </button>
          </div>
        ) : (
          <>
            {isSaving && (
              <div className="mb-4 text-xs text-amber-600 flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                儲存中...
              </div>
            )}

            <ol className="border-l-2 border-dashed border-neutral-300 pl-6 space-y-4">
              {dayDetails.map((detail, index) => {
                const previousIndex = previousDetailsRef.current.findIndex(
                  d => d.id === detail.id
                );
                
                return (
                  <DetailCard
                    key={detail.id}
                    detail={detail}
                    index={index}
                    previousIndex={previousIndex !== -1 ? previousIndex : undefined}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onEdit={() => handleEdit(detail)}
                    onDelete={() => handleDelete(detail.id)}
                    isDragging={draggedIndex === index}
                    isDragOver={dragOverIndex === index}
                  />
                );
              })}
            </ol>
          </>
        )}
      </section>
    </div>
  );
}
