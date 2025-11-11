'use client';

import { useEffect, useState } from 'react';

interface Coords {
  lat: number;
  lng: number;
}

/**
 * Hook: 取得使用者定位
 * @returns coords (lat, lng) 或 null
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('定位失敗:', err);
      }
    );
  }, []);

  return coords;
}
