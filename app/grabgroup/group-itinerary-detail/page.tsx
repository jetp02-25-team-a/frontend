'use client';
import {
  faChevronLeft,
  faChevronRight,
  faHouse,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DayCard from './_components/day-card';
import { useEffect, useRef, useState } from 'react';
import NodeCard from './_components/node-card';

import AddItineraryButton from './_components/addItinerary-button';
import PlacePanel from './_components/place-panel';
import { useFetch } from '@/hooks/useFetch';

import { useAuth } from '@/hooks/use-Auth';

import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import { ItineraryContextType, ItineraryData } from '../_types/itineraryTypes';
import Map from '../_components/GoogleMap';

import { addDays, addMinutes } from 'date-fns';
import { ItineraryEditor } from '../_components/ItineraryEditor';
import { useSearchParams } from 'next/navigation';
import { API_SERVER } from '../../config/api-path';
import MapWithNearby from '../_components/GoogleMapWithNearby';
import NearbyAttractionsPanel from './_components/NearbyAttractionsPanel';

export interface mapPoint {
  latitude: number; //預設台北101
  longitude: number;
}
interface DisplayStatus {
  state: 'stay' | 'attraction' | '';
}

export default function GroupItineraryDetailPage() {
  const params = useSearchParams().get('itineraryId');
  const itineraryId = params;
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>({
    state: '',
  });
  const { user } = useAuth();

  //處理滑動
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: 'pre' | 'next') => {
    if (!scrollRef) return;
    const scrollAmount = 90;
    scrollRef.current?.scrollBy({
      left: direction === 'pre' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };
  //state-------------------
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  //設定經緯度 預設101
  const [mapPoint, setMapPoint] = useState<mapPoint>({
    latitude: 25.033964,
    longitude: 121.564468,
  });
  //日期bar 用來顯示點選的天
  const [activeId, setActiveId] = useState<number>(0);

  // 🔄 拖拽狀態管理
  const [draggedItem, setDraggedItem] = useState<{
    dayIndex: number;
    nodeIndex: number;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{
    dayIndex: number;
    nodeIndex: number;
  } | null>(null);

  const { itineraryData, setItineraryData } = useItinerary(); //公共

  const url = `${API_SERVER}/itineraries/detail?itineraryId=${itineraryId}`;
  const { data, error, refetch } = useFetch(url);

  useEffect(() => {
    if (data && data.success) {
      const datas = data.data;
      // 住宿資料型別轉換
      const transformed = datas.map((day: any) => ({
        ...day,
        StayNodes: Array.isArray(day.StayNodes)
          ? day.StayNodes.map((stay: any) => ({
              id: stay.id,
              accommodationId: stay.accommodationId || stay.Accommodation?.id,
              Accommodation: stay.Accommodation,
            }))
          : [],
      }));
      setItineraryData((prev) => [...transformed]); //設定context
    }
  }, [data]);

  //日期自動往前補
  const normalizeDays = (days: ItineraryData[]): ItineraryData[] => {
    return days.map((d, i) => {
      if (i === 0) return d;
      const prevDay = new Date(days[i - 1].dayDate);
      return { ...d, dayDate: addDays(prevDay, 1).toISOString() };
    });
  };

  //公共資料更新後刷新
  useEffect(() => {
    // if (itineraryData) setDays(itineraryData);
    let newItineraryData: ItineraryData[] = [];
    if (itineraryData) {
      newItineraryData = normalizeDays(itineraryData);
    }
    if (JSON.stringify(newItineraryData) !== JSON.stringify(itineraryData)) {
      setItineraryData(newItineraryData);
    }
    console.log('itineraryData===>', itineraryData);
  }, [itineraryData]);

  // 控制iframe顯示
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  // 這個函式會傳給子組件
  const handleIframeVisible = (show: boolean) => {
    setIsIframeVisible(show);
    // 當面板關閉時，重置 displayStatus
    if (!show) {
      setDisplayStatus({ state: '' });
    }
  };

  // 🔄 拖拽處理函數
  const handleDragStart = (dayIndex: number, nodeIndex: number) => {
    setDraggedItem({ dayIndex, nodeIndex });
    console.log('🔄 開始拖拽:', { dayIndex, nodeIndex });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (dayIndex: number, nodeIndex: number) => {
    setDragOverItem({ dayIndex, nodeIndex });
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (
    targetDayIndex: number,
    targetNodeIndex: number
  ) => {
    if (!draggedItem || !itineraryData) return;

    const { dayIndex: sourceDayIndex, nodeIndex: sourceNodeIndex } =
      draggedItem;

    // 如果拖拽到同一個位置，不做任何處理
    if (
      sourceDayIndex === targetDayIndex &&
      sourceNodeIndex === targetNodeIndex
    ) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    console.log('🔄 拖拽完成:', {
      from: { dayIndex: sourceDayIndex, nodeIndex: sourceNodeIndex },
      to: { dayIndex: targetDayIndex, nodeIndex: targetNodeIndex },
    });

    // 🔄 重新排序邏輯
    let updatedData: ItineraryData[] = [];

    setItineraryData((prev) => {
      if (!prev) return prev;

      const newData = [...prev];

      // 取得要移動的節點
      const draggedNode = newData[sourceDayIndex].Nodes[sourceNodeIndex];

      // 從原位置移除節點
      newData[sourceDayIndex] = {
        ...newData[sourceDayIndex],
        Nodes: newData[sourceDayIndex].Nodes.filter(
          (_, i) => i !== sourceNodeIndex
        ),
      };

      // 插入到新位置
      const targetNodes = [...newData[targetDayIndex].Nodes];
      targetNodes.splice(targetNodeIndex, 0, draggedNode);

      newData[targetDayIndex] = {
        ...newData[targetDayIndex],
        Nodes: targetNodes,
      };

      updatedData = newData;
      return newData;
    });

    // 🔄 自動保存到資料庫
    try {
      console.log('🔄 拖拽排序後自動保存...');

      const response = await fetch(`${API_SERVER}/itineraries/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itineraryData: updatedData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ 拖拽排序已保存到資料庫');
      } else {
        console.error('❌ 拖拽排序保存失敗:', response.statusText, result);
      }
    } catch (error) {
      console.error('❌ 拖拽排序保存時發生錯誤:', error);
    }

    // 清理拖拽狀態
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleAddNode = async (dayId: number, nodeData: any) => {
    let updatedData: any = null;

    // 根據 nodeData 型別判斷是住宿還是景點
    const isStayNode =
      nodeData?.Place?.latitude !== undefined &&
      nodeData?.Place?.longitude !== undefined &&
      nodeData?.Place?.address !== undefined;

    setItineraryData((prev) => {
      if (!prev) return prev;
      const newData = prev.map((d, index) => {
        if (index === dayId) {
          if (isStayNode) {
            // 住宿節點加到 StayNodes
            return {
              ...d,
              StayNodes: [...(d.StayNodes || []), nodeData],
            };
          } else {
            // 景點節點加到 Nodes
            return {
              ...d,
              Nodes: [...d.Nodes, nodeData],
            };
          }
        }
        return d;
      });
      updatedData = newData;
      return newData;
    });

    // 打印即將送出的資料
    console.log(
      '🚩 發送 save 前的 itineraryData:',
      JSON.stringify(updatedData, null, 2)
    );

    try {
      const response = await fetch(`${API_SERVER}/itineraries/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itineraryData: updatedData,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('✅ 節點已保存到資料庫');
      } else {
        console.error('❌ 保存失敗:', response.statusText, result);
      }
    } catch (error) {
      console.error('❌ 保存時發生錯誤:', error);
    }
  };
  //---------------------------

  // 🗺️ 附近景點功能狀態
  const [showNearbyMode, setShowNearbyMode] = useState(false);
  const [searchRadius, setSearchRadius] = useState(2); // 預設 2 公里
  const [nearbyAttractions, setNearbyAttractions] = useState<any[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  // 處理附近景點點擊
  const handleNearbyAttractionClick = (attraction: any) => {
    console.log('🎯 點擊附近景點:', attraction);
    setMapPoint({
      latitude: attraction.lat,
      longitude: attraction.lng,
    });
  };

  // 將附近景點加入行程
  const handleAddNearbyToItinerary = (attraction: any) => {
    if (activeId === null) {
      alert('請先選擇要加入的天數');
      return;
    }

    const nodeData = {
      durationMinutes: 60, // 預設停留 1 小時
      Attraction: {
        id: attraction.id,
        name: attraction.name,
        nameZh: attraction.nameZh,
        lat: attraction.lat,
        lng: attraction.lng,
        addrFull: attraction.addrFull,
        image: attraction.image,
      },
    };

    handleAddNode(activeId, nodeData);
    console.log('✅ 已將景點加入行程:', attraction.nameZh || attraction.name);
  };

  // 處理附近景點載入完成
  const handleAttractionsLoaded = (attractions: any[]) => {
    setNearbyAttractions(attractions);
    setIsLoadingNearby(false);
  };

  // 當附近景點模式改變時重置狀態
  useEffect(() => {
    if (!showNearbyMode) {
      setIsLoadingNearby(true);
      setNearbyAttractions([]);
    } else {
      setNearbyAttractions([]);
      setIsLoadingNearby(false);
    }
  }, [showNearbyMode, mapPoint.latitude, mapPoint.longitude, searchRadius]);

  useEffect(() => {
    console.log('displayStatus', displayStatus.state);
  }, [displayStatus]);
  return (
    <>
      <ItineraryEditor itineraryData={itineraryData} />
      {/* map_area */}
      <div className="grid grid-cols-[40%_60%] h-screen">
        {/* area_zone */}
        <div className="bg-gray-200 p-[15px] space-y-3.5 overflow-scroll">
          <h3 className="text-3xl">行程</h3>
          {/* date_bar area */}
          <div className="flex w-full ">
            <div
              className="bg-white border  border-gray-300 flex items-center px-2.5 rounded-tl-xl rounded-bl-xl"
              onClick={() => scroll('pre')}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <div
              className="flex bg-gray-400 w-full  overflow-x-auto scrollbar-hide"
              ref={scrollRef}
            >
              {itineraryData &&
                itineraryData.map((day: any, index: number) => (
                  <DayCard
                    key={index}
                    id={index + 1}
                    date={day.dayDate}
                    active={activeId === index}
                    onClick={() => setActiveId(index)}
                    onDelete={() => {
                      const newItineraryData = itineraryData.filter(
                        (d, i) => i !== index
                      );
                      setItineraryData(newItineraryData);
                    }}
                  />
                ))}
            </div>
            <div
              className="bg-white border  border-gray-300 flex items-center px-2.5 rounded-tr-xl rounded-br-xl"
              onClick={() => {
                scroll('next');
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
          <div className="flex gap-[37px] justify-end items-center">
            <p className="text-gray-600">活動天數上限為7天</p>
            <button
              className="cursor-pointer text-white yellow-orange px-[30px] py-2.5"
              onClick={async () => {
                if ((itineraryData?.length ?? 0) >= 7) return;

                const lastDay = itineraryData?.at(-1); // ES2022 新語法，取最後一個元素
                let dayString = new Date().toISOString(); // 假日期
                if (lastDay)
                  dayString = addDays(
                    new Date(lastDay.dayDate),
                    1
                  ).toISOString(); // 加一天

                //創建新天的資料 (注意：暫時用 undefined 當 id，後端會自動產生)
                const newDay = {
                  id: undefined, // ✅ 新天數沒有 ID，讓後端自動產生
                  itineraryId: Number(itineraryId),
                  dayDate: dayString,
                  startTime: lastDay?.startTime ?? '2025-11-06T08:53:23.234Z',
                  Nodes: [],
                  StayNodes: [],
                };

                // 1. 先更新本地狀態
                const updatedData = [...(itineraryData ?? []), newDay];
                setItineraryData(updatedData);

                // 新增天數後自動滾到最右
                setTimeout(() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: scrollRef.current.scrollWidth,
                      behavior: 'smooth',
                    });
                  }
                }, 300);

                // 2. 立即保存到資料庫
                try {
                  console.log('=== 新增天數，立即保存 ===');
                  console.log('要保存的資料:', updatedData);

                  const response = await fetch(
                    `${API_SERVER}/itineraries/save`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        itineraryData: updatedData,
                      }),
                    }
                  );

                  const result = await response.json();
                  console.log('新增天數後端回應:', result);

                  if (response.ok) {
                    console.log('✅ 新天數已保存到資料庫');
                    // 重新載入資料以獲取正確的 ID
                    refetch();
                  } else {
                    console.error(
                      '❌ 新增天數保存失敗:',
                      response.statusText,
                      result
                    );
                  }
                } catch (error) {
                  console.error('❌ 新增天數保存時發生錯誤:', error);
                }
              }}
            >
              新增
            </button>
          </div>

          {/* 顯示node區域 */}
          <div>
            {/* 顯示所有天數 */}

            {itineraryData &&
              itineraryData.map((day, index) => {
                let tmpTime = day.startTime;
                if (index !== activeId) return null;
                // 合併所有節點，並依照原順序混排
                const allNodes: Array<any> = [];
                // 景點
                if (Array.isArray(day.Nodes)) {
                  day.Nodes.forEach((node, idx) => {
                    allNodes.push({ ...node, _type: 'attraction', _idx: idx });
                  });
                }
                // 住宿
                if (Array.isArray(day.StayNodes)) {
                  day.StayNodes.forEach((node, idx) => {
                    allNodes.push({
                      ...node,
                      _type: 'stay',
                      _idx: (day.Nodes?.length ?? 0) + idx,
                    });
                  });
                }
                // 依照 _idx 排序（確保原順序）
                allNodes.sort((a, b) => a._idx - b._idx);

                return (
                  <div
                    className="flex flex-col items-center gap-3.5"
                    key={index}
                  >
                    <div className="w-full">
                      <h3 className="text-start text-[24px]">{`第${index + 1}天`}</h3>
                    </div>
                    {/* 節點區 */}
                    {allNodes.map((node, nodeIndex) => {
                      let start = '';
                      let end = '';
                      // 景點才計算時間
                      if (
                        node._type === 'attraction' &&
                        typeof node.durationMinutes === 'number'
                      ) {
                        start = tmpTime;
                        end = addMinutes(
                          new Date(tmpTime),
                          node.durationMinutes
                        ).toISOString();
                        tmpTime = end;
                      }
                      // 住宿不計算時間
                      return (
                        <div
                          key={node._type + '-' + node._idx}
                          className="w-full"
                        >
                          <NodeCard
                            image={
                              node._type === 'stay'
                                ? node.Accommodation?.Images?.[0]?.url ||
                                  '/default-place.jpg'
                                : node.Place?.image ||
                                  node.Attraction?.image ||
                                  '/default-place.jpg'
                            }
                            duration_minute={node.durationMinutes || 0}
                            title={
                              node._type === 'stay'
                                ? node.Accommodation?.name || '住宿'
                                : node.Place?.nameZh ||
                                  node.Place?.name ||
                                  node.Attraction?.nameZh ||
                                  node.Attraction?.name ||
                                  '未知地點'
                            }
                            address={
                              node._type === 'stay'
                                ? node.Accommodation?.address || '地址不詳'
                                : node.Place?.addrFull ||
                                  node.Attraction?.addrFull ||
                                  '地址不詳'
                            }
                            start_time={start}
                            end_time={end}
                            dayIndex={index}
                            nodeIndex={nodeIndex}
                            onDragStart={
                              node._type === 'attraction'
                                ? handleDragStart
                                : undefined
                            }
                            onDragOver={
                              node._type === 'attraction'
                                ? handleDragOver
                                : undefined
                            }
                            onDragEnter={
                              node._type === 'attraction'
                                ? handleDragEnter
                                : undefined
                            }
                            onDragLeave={
                              node._type === 'attraction'
                                ? handleDragLeave
                                : undefined
                            }
                            onDrop={
                              node._type === 'attraction'
                                ? handleDrop
                                : undefined
                            }
                            isDragging={
                              node._type === 'attraction'
                                ? draggedItem?.dayIndex === index &&
                                  draggedItem?.nodeIndex === nodeIndex
                                : false
                            }
                            isDragOver={
                              node._type === 'attraction'
                                ? dragOverItem?.dayIndex === index &&
                                  dragOverItem?.nodeIndex === nodeIndex
                                : false
                            }
                            onClick={() =>
                              setMapPoint({
                                latitude:
                                  node._type === 'stay'
                                    ? node.Accommodation?.latitude || 25.033964
                                    : node.Place?.lat ||
                                      node.Attraction?.lat ||
                                      25.033964,
                                longitude:
                                  node._type === 'stay'
                                    ? node.Accommodation?.longitude ||
                                      121.564468
                                    : node.Place?.lng ||
                                      node.Attraction?.lng ||
                                      121.564468,
                              })
                            }
                          />
                          <div
                            className={
                              node._type === 'attraction'
                                ? 'bg-gray-600 w-1 h-[43px] m-auto'
                                : 'bg-blue-400 w-1 h-[43px] m-auto'
                            }
                          ></div>
                        </div>
                      );
                    })}
                    {/* add btn  */}
                    <div className="flex gap-[30px]">
                      <AddItineraryButton
                        icon={faPlus}
                        btn_name="加入行程"
                        onClick={() => {
                          setCurrentDayIndex(index);
                          setDisplayStatus({ state: 'attraction' });
                          setIsIframeVisible(true);
                        }}
                      />
                      <AddItineraryButton
                        icon={faHouse}
                        btn_name="加入住宿"
                        onClick={() => {
                          setCurrentDayIndex(index);
                          setDisplayStatus({ state: 'stay' });
                          setIsIframeVisible(true);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* ------------------------------------------- */}
        {/* map_zone */}
        <div className="bg-amber-700 relative flex">
          {/* 附近景點側邊面板 */}
          {showNearbyMode && (
            <div className="w-80 bg-white h-full overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">附近景點</h3>
                  <button
                    onClick={() => setShowNearbyMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* 搜索半徑選擇 */}
                <div className="flex items-center gap-2">
                  <label className="text-sm">範圍:</label>
                  <select
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value={1}>1 公里</option>
                    <option value={2}>2 公里</option>
                    <option value={5}>5 公里</option>
                    <option value={10}>10 公里</option>
                  </select>
                </div>
              </div>

              {/* 景點列表 */}
              <div className="flex-1 overflow-hidden">
                <NearbyAttractionsPanel
                  attractions={nearbyAttractions}
                  isLoading={isLoadingNearby}
                  searchRadius={searchRadius}
                  onAddToItinerary={handleAddNearbyToItinerary}
                  onAttractionClick={handleNearbyAttractionClick}
                />
              </div>
            </div>
          )}

          {/* 地圖區域 */}
          <div className="flex-1 relative">
            {/* 地圖控制面板 */}
            <div className="absolute top-4 right-4 z-40 bg-white rounded-lg shadow-lg p-3">
              <div className="flex flex-col gap-2">
                {/* 附近景點開關 */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNearbyMode}
                      onChange={(e) => setShowNearbyMode(e.target.checked)}
                      className="rounded"
                    />
                    <span>附近景點</span>
                  </label>
                </div>
              </div>
            </div>

            {/* googlemap */}
            <div className="w-full h-full">
              <div className="w-full h-full">
                {showNearbyMode ? (
                  <MapWithNearby
                    latitude={mapPoint.latitude}
                    longitude={mapPoint.longitude}
                    showNearbyAttractions={true}
                    searchRadius={searchRadius}
                    onAttractionClick={handleNearbyAttractionClick}
                    onAttractionsLoaded={handleAttractionsLoaded}
                  />
                ) : (
                  <Map
                    latitude={mapPoint.latitude}
                    longitude={mapPoint.longitude}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <div className="w-full mx-auto my-auto ">
            <Map
              latitude={mapPoint.latitude}
              longitude={mapPoint.longitude}
              width={1000}
              height={1000}
            />
          </div> */}
          {/* 彈出視窗 */}
          {isIframeVisible &&
            currentDayIndex !== null &&
            displayStatus.state && (
              <div className="absolute inset-0 z-50 flex left-3 top-3">
                <PlacePanel
                  visible={isIframeVisible}
                  onSend={handleIframeVisible}
                  currentId={currentDayIndex}
                  onAddNode={handleAddNode}
                  displayStatus={displayStatus.state}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
}
