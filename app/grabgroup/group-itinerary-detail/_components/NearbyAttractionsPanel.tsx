import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

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

interface NearbyAttractionsPanelProps {
  attractions: NearbyAttraction[];
  isLoading: boolean;
  searchRadius: number;
  onAddToItinerary: (attraction: NearbyAttraction) => void;
  onAttractionClick: (attraction: NearbyAttraction) => void;
}

const NearbyAttractionsPanel: React.FC<NearbyAttractionsPanelProps> = ({
  attractions,
  isLoading,
  searchRadius,
  onAddToItinerary,
  onAttractionClick,
}) => {
  const getTypeLabel = (attraction: NearbyAttraction) => {
    if (attraction.tourism) return { label: '觀光', color: 'bg-red-100 text-red-800' };
    if (attraction.natural) return { label: '自然', color: 'bg-teal-100 text-teal-800' };
    if (attraction.historic) return { label: '古蹟', color: 'bg-blue-100 text-blue-800' };
    return { label: '景點', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">附近景點</h3>
        <span className="text-sm text-gray-500">範圍 {searchRadius} 公里</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">🔍 搜索中...</div>
        </div>
      ) : attractions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">附近沒有發現景點</div>
        </div>
      ) : (
        <div className="space-y-3">
          {attractions.map((attraction) => {
            const typeInfo = getTypeLabel(attraction);
            return (
              <div
                key={attraction.id}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onAttractionClick(attraction)}
              >
                <div className="flex gap-3">
                  {/* 景點圖片 */}
                  {attraction.image ? (
                    <img
                      src={attraction.image}
                      alt={attraction.nameZh || attraction.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon 
                        icon={faMapMarkerAlt} 
                        className="text-gray-400 text-lg" 
                      />
                    </div>
                  )}

                  {/* 景點資訊 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm truncate">
                        {attraction.nameZh || attraction.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToItinerary(attraction);
                        }}
                        className="flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors flex-shrink-0"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        加入
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 truncate">
                      📍 {attraction.addrFull}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        📏 {attraction.distance} km
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyAttractionsPanel;