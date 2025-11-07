'use client';
import { useMemo, useEffect } from 'react';
import { debounce } from 'lodash';

interface itineraryData {
  itineraryData: any;
}
export function ItineraryEditor({ itineraryData }: itineraryData) {
  // 用 useMemo 建立「防抖後的儲存函式」，只在第一次建立
  const saveItinerary = useMemo(
    () =>
      debounce(async (itineraryData) => {
        console.log('發送儲存請求...', itineraryData);
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/save`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itineraryData }),
          }
        );
      }, 1500), // 延遲 1.5 秒
    []
  );

  // 監聽 itineraryData 改變 → 自動觸發儲存（防抖）
  useEffect(() => {
    console.log('重新載入.............!');
    if (itineraryData && itineraryData.length > 0) {
      saveItinerary(itineraryData);
    }
  }, [itineraryData, saveItinerary]);

  return <div>行程編輯中...</div>;
}
