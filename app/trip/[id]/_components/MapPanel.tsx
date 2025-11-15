'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useMemo } from 'react';

interface MapPanelProps {
  latitude?: number;
  longitude?: number;
}

const DEFAULT_CENTER = { lat: 25.033, lng: 121.5654 }; // 台北101

export default function MapPanel({ latitude, longitude }: MapPanelProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY ?? '',
  });

  const center = useMemo(
    () =>
      latitude && longitude
        ? { lat: latitude, lng: longitude }
        : DEFAULT_CENTER,
    [latitude, longitude]
  );

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center text-gray-400 bg-white rounded-2xl shadow-md w-full h-[600px]">
        地圖載入中...
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '600px',
          borderRadius: '16px',
        }}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
          mapId: process.env.NEXT_PUBLIC_GOOGLEMAP_MAP_ID, // optional custom styling
        }}
      >
        <Marker
          position={center}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
            scaledSize: new google.maps.Size(48, 48),
          }}
        />
      </GoogleMap>
    </div>
  );
}
