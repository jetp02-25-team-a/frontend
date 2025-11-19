import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  useJsApiLoader,
} from '@react-google-maps/api';
import { useState, useEffect, useCallback } from 'react';
import { API_SERVER } from '../../config/api-path';

let containerStyle = {
  width: '100%',
  height: '100%',
};

interface NearbyAttraction {
  id: number;
  name: string;
  nameZh: string;
  lat: number;
  lng: number;
  addrCity: string;
  addrDistrict: string;
  addrFull: string;
  image: string;
  distance: number;
  tourism?: boolean;
  natural?: boolean;
  historic?: boolean;
}

interface MapProps {
  latitude: number;
  longitude: number;
  width?: number;
  height?: number;
  showNearbyAttractions?: boolean;
  onAttractionClick?: (attraction: NearbyAttraction) => void;
  searchRadius?: number; // 搜索半徑（公里）
  onAttractionsLoaded?: (attractions: NearbyAttraction[]) => void; // 新增：回傳景點資料
}

const MapWithNearby = ({
  latitude,
  longitude,
  width,
  height,
  showNearbyAttractions = false,
  onAttractionClick,
  searchRadius = 2, // 預設 2 公里
  onAttractionsLoaded,
}: MapProps) => {
  const [nearbyAttractions, setNearbyAttractions] = useState<
    NearbyAttraction[]
  >([]);
  const [selectedAttraction, setSelectedAttraction] =
    useState<NearbyAttraction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchRadius, setShowSearchRadius] = useState(false);

  if (width && height) {
    containerStyle = { width: `${width}px`, height: `${height}px` };
  } else {
    containerStyle = { width: '100%', height: '100%' };
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API_KEY ?? '',
  });

  // 搜索附近景點
  const searchNearbyAttractions = useCallback(
    async (lat: number, lng: number, radius: number) => {
      if (!showNearbyAttractions) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_SERVER}/itineraries/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
        );
        const result = await response.json();

        if (result.success) {
          const attractions = result.data.attractions || [];
          setNearbyAttractions(attractions);
          onAttractionsLoaded?.(attractions);
          console.log(`🗺️ 找到 ${attractions.length} 個附近景點`);
        } else {
          console.error('❌ 搜索附近景點失敗:', result.message);
          setNearbyAttractions([]);
        }
      } catch (error) {
        console.error('❌ API 請求錯誤:', error);
        setNearbyAttractions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showNearbyAttractions]
  );

  // 當座標或半徑改變時，重新搜索
  useEffect(() => {
    if (showNearbyAttractions && latitude && longitude) {
      searchNearbyAttractions(latitude, longitude, searchRadius);
    }
  }, [
    latitude,
    longitude,
    searchRadius,
    showNearbyAttractions,
    searchNearbyAttractions,
  ]);

  // 處理景點標記點擊
  const handleAttractionClick = (attraction: NearbyAttraction) => {
    setSelectedAttraction(attraction);
    onAttractionClick?.(attraction);
  };

  // 獲取景點類型圖標顏色
  const getMarkerColor = (attraction: NearbyAttraction) => {
    if (attraction.tourism) return '#FF6B6B'; // 紅色 - 觀光景點
    if (attraction.natural) return '#4ECDC4'; // 青色 - 自然景觀
    if (attraction.historic) return '#45B7D1'; // 藍色 - 歷史古蹟
    return '#FFA726'; // 橘色 - 其他
  };

  if (!isLoaded) return <div>Loading...</div>;

  const center = { lat: latitude, lng: longitude };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={showNearbyAttractions ? 14 : 17}
      onLoad={() => setShowSearchRadius(true)}
    >
      {/* 主要位置標記 */}
      <Marker position={center} />

      {/* 搜索範圍圓圈 */}
      {showNearbyAttractions && showSearchRadius && (
        <Circle
          center={center}
          radius={searchRadius * 1000} // 轉換為公尺
          options={{
            fillColor: '#4285F4',
            fillOpacity: 0.1,
            strokeColor: '#4285F4',
            strokeOpacity: 0.3,
            strokeWeight: 2,
          }}
        />
      )}

      {/* 附近景點標記 */}
      {showNearbyAttractions &&
        nearbyAttractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={{ lat: attraction.lat, lng: attraction.lng }}
            onClick={() => handleAttractionClick(attraction)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: getMarkerColor(attraction),
              fillOpacity: 0.8,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            }}
          />
        ))}

      {/* 景點資訊視窗 */}
      {selectedAttraction && (
        <InfoWindow
          position={{
            lat: selectedAttraction.lat,
            lng: selectedAttraction.lng,
          }}
          onCloseClick={() => setSelectedAttraction(null)}
        >
          <div className="max-w-sm">
            {selectedAttraction.image && (
              <img
                src={selectedAttraction.image}
                alt={selectedAttraction.nameZh || selectedAttraction.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
            )}
            <h3 className="font-semibold text-lg mb-1">
              {selectedAttraction.nameZh || selectedAttraction.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-red-500 mr-1"
              />
              {selectedAttraction.addrFull}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              距離約 {selectedAttraction.distance} 公里
            </p>
            {/* <div className="flex gap-1 mt-2">
              {selectedAttraction.tourism && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  觀光
                </span>
              )}
              {selectedAttraction.natural && (
                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">
                  自然
                </span>
              )}
              {selectedAttraction.historic && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  古蹟
                </span>
              )}
            </div> */}
          </div>
        </InfoWindow>
      )}

      {/* 載入指示器 */}
      {isLoading && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-lg">
          <span className="text-sm text-gray-600">🔍 搜索附近景點中...</span>
        </div>
      )}
    </GoogleMap>
  );
};

export default MapWithNearby;
