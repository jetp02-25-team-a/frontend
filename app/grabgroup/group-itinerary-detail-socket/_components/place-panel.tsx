'use client';

import { faXmark, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import RagularButton from '../../../../components/ui/regular-button';
import PanelCard from './panel-card';
import { useFetch } from '@/hooks/useFetch';
import { useItinerary } from '@/hooks/use-itinerart';
import { ItineraryData } from '../../_types/itineraryTypes';
import Image from 'next/image';
import { API_SERVER } from '../../../config/api-path';
import { is } from 'date-fns/locale';
import { isSea } from 'node:sea';
import { IMAGE_PATH } from '../../../config/image-path';
import { image } from '@uiw/react-md-editor';

interface IframeProps {
  visible: boolean;
  onSend: (msg: boolean) => void; // 關閉面板用：onSend(false)
  currentId: number; // 可能是 day.id 或 day 的索引
  // 可選：如果你想讓父層自己處理新增，也可以提供這個
  onAddNode?: (
    dayIndexOrId: number,
    node: {
      durationMinutes: number;
      Place: SearchAttractionData | SearchStayData | NearbyAttraction;
    }
  ) => void;
  displayStatus: 'stay' | 'attraction' | '';
}
//檢索到的地點型別
interface SearchAttractionData {
  id: number;
  name: string;
  nameZh: string;
  addrCity?: string | '';
  addrDistrict?: string | '';
  addrFull: string;
  lat: number;
  lng: number;
  image: string;
}

//住宿照片們
interface StayImageUrl {
  url: string;
}

//檢索到的住宿型別
interface SearchStayData {
  id: number;
  City: {
    name: string;
  };
  Images: StayImageUrl[];
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

// 附近景點型別
interface NearbyAttraction {
  id: number;
  name: string;
  nameZh: string;
  lat: number;
  lng: number;
  addrFull: string;
  image: string;
  distance?: number;
}

export default function PlacePanel({
  visible,
  onSend,
  currentId,
  onAddNode,
  displayStatus,
}: IframeProps) {
  // 打印displayStatus
  console.log('PlacePanel displayStatus:', displayStatus);
  // 驗證圖片 URL 是否有效的輔助函數
  const isValidImageUrl = (url: string | undefined | null): string | null => {
    if (!url || typeof url !== 'string') return null;
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;

    // 檢查是否為有效的 URL 格式
    const isExternal = /^https?:\/\//i.test(trimmedUrl);
    const isRelative = trimmedUrl.startsWith('/');
    const isData = trimmedUrl.startsWith('data:');

    return isExternal || isRelative || isData ? trimmedUrl : null;
  };

  const [isSearching, setIsSearching] = useState(false);
  const [inputContent, setInputContent] = useState<string>('');
  const [url, setUrl] = useState<string | undefined>(undefined);

  const [searchData, setSearchData] = useState<
    SearchAttractionData[] | SearchStayData[] | undefined
  >(); //搜尋結果資料

  // 🔍 除錯：監控 displayStatus 變化
  // useEffect(() => {
  //   console.log('PlacePanel displayStatus changed:', displayStatus);
  // }, [displayStatus]);
  const [placeData, setPlaceData] = useState<
    SearchAttractionData | SearchStayData | NearbyAttraction | null
  >(null); // (主要點選的區域)詳細資料
  // const [stayData, setStayData] = useState<StayData[] | undefined>();
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  const { data, loading } = useFetch(url);
  const { itineraryData, setItineraryData } = useItinerary();

  const [nearbyAttractions, setNearbyAttractions] = useState<
    NearbyAttraction[]
  >([]); // 附近景點資料
  const [showNearby, setShowNearby] = useState(false); // 是否顯示附近景點

  // 觸發搜尋(住宿)
  const handleAttractionSearch = (keyword: string) => {
    if (!keyword.trim()) return;
    const finUrl = `${API_SERVER}/itineraries/search?place=${encodeURIComponent(
      keyword.trim()
    )}`;
    setUrl(finUrl);
    setIsSearching(true); // 明確切換到「列表」狀態
    setPlaceData(null); // 清掉詳情
  };

  // 定義型別守衛(住宿)
  const isSearchAttractionData = (item: any): item is SearchAttractionData => {
    return (
      item &&
      typeof item === 'object' &&
      'nameZh' in item &&
      'addrCity' in item &&
      'lat' in item &&
      'lng' in item
    );
  };

  // 觸發搜尋(景點)
  const handleStaySearch = (keyword: string) => {
    if (!keyword.trim()) return;
    const finUrl = `${API_SERVER}/itineraries/stay-nearby/${encodeURIComponent(
      keyword.trim()
    )}`;

    setUrl(finUrl);
    setIsSearching(true); // 明確切換到「列表」狀態
    setPlaceData(null); // 清掉詳情
  };

  // 定義型別守衛(住宿)
  const isSearchStayData = (item: any): item is SearchStayData => {
    return (
      item &&
      typeof item === 'object' &&
      'City' in item &&
      'latitude' in item &&
      'longitude' in item &&
      'address' in item &&
      'description' in item
    );
  };

  // 顯示某個結果的詳情
  const handleDetailPanel = (id: number) => {
    if (!searchData) return;
    const found = searchData.find((n) => n.id === id) || null;
    if (!found) return;
    setPlaceData(found);
    setIsSearching(false); // 進入詳情畫面

    // 根據資料型別獲取正確的座標
    const lat = 'lat' in found ? found.lat : found.latitude;
    const lng = 'lng' in found ? found.lng : found.longitude;

    searchNearbyPlaces(lat, lng, 2, found.id); // 傳入當前景點 ID
  };

  // 附近景點搜尋函數
  const searchNearbyPlaces = async (
    lat: number,
    lng: number,
    radius: number = 2, // 公里
    excludeId?: number // 要排除的景點 ID
  ) => {
    try {
      const response = await fetch(
        `${API_SERVER}/itineraries/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      const result = await response.json();

      if (result.success) {
        // console.log('excludeId', excludeId);
        const fileteredAttractions = result.data.attractions.filter(
          (m: NearbyAttraction) => {
            return m.id !== excludeId;
          }
        );
        setNearbyAttractions(fileteredAttractions || []);
        // console.log(`找到 ${result.data.attractions?.length || 0} 個附近景點`);
      }
    } catch (error) {
      console.error('搜索附近景點失敗:', error);
    }
  };

  // 後端回來資料 → 存進 state
  useEffect(() => {
    if (data && !loading) {
      setSearchData(Array.isArray(data.data) ? data.data : []);
    }
  }, [data, loading]);

  // 找到要新增節點的「day 索引」
  const resolveDayIndex = (
    days: ItineraryData[] | undefined,
    cid: number
  ): number => {
    if (!days || days.length === 0) return -1;

    // 優先把 currentId 視為 index（陣列索引）
    if (cid >= 0 && cid < days.length) return cid;

    // 找不到就嘗試把 currentId 視為 day.id
    const byId = days.findIndex((d) => Number(d.id) === Number(cid));
    if (byId !== -1) return byId;

    return -1;
  };

  // 轉換資料為 Place 格式
  const convertToPlace = (
    data: SearchAttractionData | SearchStayData | NearbyAttraction
  ) => {
    if ('latitude' in data && 'City' in data) {
      // SearchStayData
      const stayData = data as SearchStayData;
      return {
        id: stayData.id,
        name: stayData.name,
        nameZh: stayData.name, // 住宿沒有 nameZh，使用 name
        addrCity: stayData.City.name,
        addrDistrict: '',
        addrFull: stayData.address,
        lat: stayData.latitude,
        lng: stayData.longitude,
        image:
          stayData.Images && stayData.Images.length > 0
            ? stayData.Images[0].url
            : '',
      };
    } else if ('nameZh' in data && 'addrCity' in data) {
      // SearchAttractionData
      const attractionData = data as SearchAttractionData;
      return {
        id: attractionData.id,
        name: attractionData.name,
        nameZh: attractionData.nameZh,
        addrCity: attractionData.addrCity || '',
        addrDistrict: attractionData.addrDistrict || '',
        addrFull: attractionData.addrFull,
        lat: attractionData.lat,
        lng: attractionData.lng,
        image: attractionData.image,
      };
    } else {
      // NearbyAttraction
      const nearbyData = data as NearbyAttraction;
      return {
        id: nearbyData.id,
        name: nearbyData.name,
        nameZh: nearbyData.nameZh,
        addrCity: '',
        addrDistrict: '',
        addrFull: nearbyData.addrFull,
        lat: nearbyData.lat,
        lng: nearbyData.lng,
        image: nearbyData.image,
      };
    }
  };

  const addNodeToDay = () => {
    if (!placeData) return;
    const dur = Number.isFinite(durationMinutes)
      ? Math.max(0, durationMinutes)
      : 0;

    // 統一格式：都用 Place 屬性
    const node = {
      durationMinutes: displayStatus === 'stay' ? dur || 480 : dur,
      Place: convertToPlace(placeData),
    };

    // 如果父層提供 callback，就讓父層處理
    if (onAddNode) {
      onAddNode(currentId, node);
      onSend(false); // 關閉面板
      return;
    }

    setItineraryData((prev) => {
      const days = prev ? [...prev] : [];
      const idx = resolveDayIndex(days, currentId);
      if (idx === -1) return prev || [];

      const target = days[idx];
      let next;
      if (displayStatus === 'stay') {
        // 住宿節點轉換為 StayNode 型別
        const stayNode = {
          id: Date.now(), // 前端暫時產生，後端可自動生成
          accommodationId: node.Place.id,
          Accommodation: node.Place,
        };
        next = {
          ...target,
          StayNodes: [...(target.StayNodes || []), stayNode],
        };
      } else {
        next = {
          ...target,
          Nodes: [...(target.Nodes || []), node],
        };
      }
      days[idx] = next;
      return days;
    });

    onSend(false); // 關閉面板
  };
  //打印
  console.log('placeData:===>', placeData);
  return (
    <div
      className={`bg-[#F7FAFC] w-[564px] h-[779px] rounded-2xl p-4 shadow-[0_4px_10px_rgba(0,0,0,0.4)] space-y-2.5`}
    >
      {/* 頂部按鈕列 */}
      <div className="flex justify-end items-center">
        <span className="w-full">
          {/* 返回搜尋列表 */}
          {!isSearching && placeData && (
            <button
              className="inline-flex items-center gap-2 text-gray-700"
              onClick={() => {
                setIsSearching(true);
                setPlaceData(null);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
              <span>返回</span>
            </button>
          )}
        </span>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => onSend(false)}
          className="cursor-pointer"
        />
      </div>

      {/* 搜尋列 */}
      <div className="flex items-center border-2 border-gray-300 rounded-full w-full space-x-[15px] px-5 py-2.5">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder="搜尋景點"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputContent.trim().length > 0) {
              console.log('Enter pressed', displayStatus);
              if (displayStatus === 'attraction') {
                handleAttractionSearch(inputContent);
              } else if (displayStatus === 'stay')
                handleStaySearch(inputContent);
            }
          }}
        />
      </div>

      {/* 搜尋結果列表 */}
      {isSearching && (
        <div className="w-full shrink-0 flex flex-col gap-2.5 my-2.5 overflow-y-auto max-h-160">
          {Array.isArray(searchData) && searchData.length > 0 ? (
            isSearchAttractionData(searchData[0]) ? (
              // 景點資料
              (searchData as SearchAttractionData[]).map((node) => (
                <PanelCard
                  key={node.id}
                  image={node.image}
                  title={node.nameZh || node.name}
                  address={node.addrFull}
                  onClick={() => handleDetailPanel(node.id)}
                  displayStatus={displayStatus}
                />
              ))
            ) : isSearchStayData(searchData[0]) ? (
              // 住宿資料
              (searchData as SearchStayData[]).map((node) => (
                <PanelCard
                  key={node.id}
                  image={
                    node.Images && node.Images.length > 0
                      ? node.Images[0].url
                      : ''
                  }
                  title={node.name}
                  address={node.address}
                  description={node.description}
                  displayStatus={displayStatus}
                  onClick={() => handleDetailPanel(node.id)}
                />
              ))
            ) : (
              // 未知資料型別
              <div className="text-sm text-orange-500 px-2">未知的資料格式</div>
            )
          ) : (
            // 沒有資料
            <div className="text-sm text-gray-500 px-2">
              沒有找到結果，請換個關鍵字試試。
            </div>
          )}
        </div>
      )}

      {/* 詳情 + 加入行程 */}
      {placeData && !isSearching && (
        <div className="overflow-y-auto scroll-none max-h-[650px]">
          {/* 圖片顯示區塊，根據 displayStatus 分流 */}
          {(() => {
            switch (displayStatus) {
              case 'attraction':
                return ('image' in placeData && placeData.image) ||
                  ('Images' in placeData &&
                    placeData.Images &&
                    placeData.Images.length > 0) ? (
                  <div className="w-full h-[264px] relative">
                    <Image
                      src={(() => {
                        let imageUrl: string | null = null;
                        if ('image' in placeData && placeData.image) {
                          imageUrl = isValidImageUrl(placeData.image);
                        } else if (
                          'Images' in placeData &&
                          placeData.Images &&
                          placeData.Images.length > 0
                        ) {
                          imageUrl = isValidImageUrl(placeData.Images[0].url);
                        }
                        return imageUrl || '/images/place-default.jpg';
                      })()}
                      alt={
                        'nameZh' in placeData
                          ? placeData.nameZh || placeData.name
                          : placeData.name
                      }
                      fill
                      sizes="100%"
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[244px] flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-600 text-sm">
                      這個地點沒有圖片
                    </span>
                  </div>
                );
              case 'stay':
                return ('image' in placeData && placeData.image) ||
                  ('Images' in placeData &&
                    placeData.Images &&
                    placeData.Images.length > 0) ? (
                  <div className="w-full h-[264px] relative">
                    <Image
                      src={(() => {
                        let imageUrl: string | null = null;
                        if ('Images' in placeData && placeData.Images) {
                          imageUrl = placeData.Images[0].url;
                        }
                        return (
                          `${IMAGE_PATH}${imageUrl}` ||
                          '/images/place-default.jpg'
                        );
                      })()}
                      alt={
                        'nameZh' in placeData
                          ? placeData.nameZh || placeData.name
                          : placeData.name
                      }
                      fill
                      sizes="100%"
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[244px] flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-600 text-sm">
                      這個地點沒有圖片
                    </span>
                  </div>
                );
              default:
                return null;
            }
          })()}
          <div className="mt-4 flex items-center">
            <FontAwesomeIcon icon={faCalendar} className="text-2xl mr-3" />
            <label className="text-sm text-gray-600 mr-3">
              停留時間（分鐘）
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min={0}
              step={5}
              className="border rounded-2xl p-2 w-28 text-center"
              placeholder="分鐘"
            />
          </div>
          {/* 名稱和位置 */}
          <div className="m-5">
            <h1 className="text-[20px] font-semibold">
              {'nameZh' in placeData
                ? placeData.nameZh || placeData.name
                : placeData.name}
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              位置：
              {'addrFull' in placeData ? placeData.addrFull : placeData.address}
            </p>
          </div>
          {/* 住宿描述 */}
          {displayStatus === 'stay' &&
            'description' in placeData &&
            placeData.description && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  住宿描述
                </h4>
                <p className="text-sm text-gray-600">{placeData.description}</p>
              </div>
            )}
          <RagularButton
            content="加入行程"
            onClick={addNodeToDay}
            mode="solid"
            className="w-full"
          />
          {nearbyAttractions && displayStatus === 'attraction' && (
            <div>
              <h3 className="text-xl mt-6">其他推薦景點</h3>
              <hr />

              {nearbyAttractions.map((attraction, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between p-2 my-2.5 justify-items-center border-b border-gray-300 cursor-pointer"
                    onClick={() => {
                      setPlaceData(attraction);

                      //再次刷新新景點的周邊訊息
                      searchNearbyPlaces(
                        attraction.lat,
                        attraction.lng,
                        5,
                        attraction.id
                      );
                    }}
                  >
                    <div className="flex flex-col">
                      <h2 className="text-2xl">
                        {attraction.nameZh || attraction.name}
                      </h2>
                      <p className="text-gray-500">{attraction.addrFull}</p>
                    </div>
                    <div className="w-20 h-20 relative">
                      {isValidImageUrl(attraction.image) ? (
                        <Image
                          src={isValidImageUrl(attraction.image)!}
                          alt=""
                          fill
                          sizes="100%"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                          <span className="text-gray-500 text-xs">無圖片</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
