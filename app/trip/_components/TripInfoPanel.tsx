'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import DetailCard from './DetailCard';
import AddPlaceToDetailModal from './AddPlaceToDetailModal';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const dates = getDateRange();
  const selectedDate = dates[selectedDay];

  // 過濾當天的行程
  const dayDetails = localDetails.filter(detail => {
    if (!selectedDate) return true;
    const detailDate = detail.startDate.split('T')[0];
    return detailDate === selectedDate;
  });

  // 即使沒有資料也要顯示日期切換欄和加入按鈕

  // M5 風格：按天分組顯示
  const daysData = useMemo(() => {
    const daysMap = new Map<string, TripDetailItem[]>();
    
    dates.forEach((date) => {
      const dayItems = localDetails.filter(detail => {
        const detailDate = detail.startDate.split('T')[0];
        return detailDate === date;
      });
      daysMap.set(date, dayItems);
    });
    
    return dates.map((date, index) => ({
      date,
      index,
      items: daysMap.get(date) || [],
    }));
  }, [dates, localDetails]);

  // 如果沒有日期範圍，顯示提示
  if (dates.length === 0) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">行程內容</h2>
        <p className="text-neutral-500">請先設定行程的開始和結束日期。</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* 日期切換欄（M5 風格：橫向滾動，放在最上方） */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
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
      </div>

      {/* M5 風格：顯示選中的天數 */}
      {daysData.map((dayData, dayIndex) => {
        const dayItems = dayData.items;
        const isActiveDay = selectedDay === dayIndex;
        
        // 只顯示選中的天數
        if (!isActiveDay) return null;
        
        return (
          <div key={dayData.date} className="flex flex-col items-center gap-3.5">
            {/* 天數標題 */}
            <div className="w-full">
              <h3 className="text-start text-2xl font-semibold text-neutral-900">
                第{dayIndex + 1}天
              </h3>
            </div>

            {/* 節點區 */}
            {dayItems.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 w-full">
                <p className="mb-4">尚未新增任何行程內容</p>
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

                {dayItems.map((detail, itemIndex) => {
                  const previousIndex = previousDetailsRef.current.findIndex(
                    d => d.id === detail.id
                  );
                  const isLast = itemIndex === dayItems.length - 1;
                  
                  return (
                    <div key={detail.id} className="w-full flex flex-col items-center">
                      <DetailCard
                        detail={detail}
                        index={itemIndex}
                        previousIndex={previousIndex !== -1 ? previousIndex : undefined}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onEdit={() => handleEdit(detail)}
                        onDelete={() => handleDelete(detail.id)}
                        isDragging={draggedIndex === itemIndex}
                        isDragOver={dragOverIndex === itemIndex}
                      />
                      {/* 連接線（除了最後一個項目） */}
                      {!isLast && (
                        <div className="w-1 h-[43px] bg-neutral-300" />
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {/* M5 風格：加入按鈕 */}
            <div className="flex gap-[30px] mt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedDay(dayIndex);
                  setShowAddModal(true);
                }}
                className="flex flex-col gap-2.5 items-center cursor-pointer"
              >
                <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
                  <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-700">加入行程</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: 實作加入住宿功能
                  alert('加入住宿功能開發中');
                }}
                className="flex flex-col gap-2.5 items-center cursor-pointer"
              >
                <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
                  <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-700">加入住宿</p>
              </button>
            </div>
          </div>
        );
      })}

      {/* 新增景點 Modal */}
      {showAddModal && selectedDate && (
        <AddPlaceToDetailModal
          tripId={tripId}
          selectedDate={selectedDate}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            onUpdate?.();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
