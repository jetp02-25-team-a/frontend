'use client';

import { useEffect, useState } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

interface GeolocationState {
  coords: Coords | null;
  loading: boolean;
  error: GeolocationPositionError | string | null;
}
/**
 * Hook: 取得使用者定位
 * @returns coords (lat, lng) 或 null
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // 1. 檢查瀏覽器是否支援
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: '瀏覽器不支援地理定位 API。',
      }));
      return;
    }

    // 2. 請求定位
    navigator.geolocation.getCurrentPosition(
      // 成功回呼
      (pos) => {
        setState({
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      // 失敗回呼 (err 是 GeolocationPositionError 類型)
      (err) => {
        console.warn('定位失敗:', err);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err, // 傳遞錯誤物件
        }));
      },
      // 可選：設定選項，例如超時時間
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 秒超時
        maximumAge: 0, // 不使用緩存
      }
    );
  }, []);

  return state;
}
