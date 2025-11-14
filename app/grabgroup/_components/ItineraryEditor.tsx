'use client';
import { useMemo, useEffect } from 'react';
import { debounce } from 'lodash';
import { API_SERVER } from '../../config/api-path';

interface itineraryData {
  itineraryData: any;
}
export function ItineraryEditor({ itineraryData }: itineraryData) {
  // 用 useMemo 建立「防抖後的儲存函式」，只在第一次建立
  const saveItinerary = useMemo(
    () =>
      debounce(async (itineraryData) => {
        console.log('發送儲存請求...', itineraryData);
        await fetch(`${API_SERVER}/itineraries/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itineraryData }),
        });
      }, 1500), // 延遲 1.5 秒
    []
  );

    // 監聽 itineraryData 改變 → 自動觸發儲存（防抖）
  useEffect(() => {
    console.log('重新載入.............!');
    if (itineraryData && itineraryData.length > 0) {
      // ✅ 只有當資料有 ID 且不是初始載入時才保存
      const hasValidIds = itineraryData.every((day: any) => day.id);
      const hasNodes = itineraryData.some((day: any) => day.Nodes && day.Nodes.length > 0);
      
      console.log('自動保存檢查:', { hasValidIds, hasNodes, dataLength: itineraryData.length });
      
      // 只有在有有效ID且有節點時才觸發保存，避免覆蓋資料
      if (hasValidIds && hasNodes) {
        console.log('✅ 觸發自動保存');
        saveItinerary(itineraryData);
      } else {
        console.log('❌ 跳過自動保存 - 避免資料丟失');
      }
    }
  }, [itineraryData, saveItinerary]);

  return <div>行程編輯中...</div>;
}
