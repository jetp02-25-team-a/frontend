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

// 引入 Socket
import { useSocket } from '@/hooks/use-Socket';
import { useAuth } from '@/hooks/use-Auth';

import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import { ItineraryContextType, ItineraryData } from '../_types/itineraryTypes';
import Map from '../_components/GoogleMap';
import MapWithNearby from '../_components/GoogleMapWithNearby';
import NearbyAttractionsPanel from './_components/NearbyAttractionsPanel';
import SocketDebugPanel from './_components/SocketDebugPanel';

import { addDays, addMinutes } from 'date-fns';
import { ItineraryEditor } from '../_components/ItineraryEditor';
import { useSearchParams } from 'next/navigation';
import { API_SERVER } from '../../config/api-path';
import { faSave } from '@fortawesome/free-solid-svg-icons';

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

  // Socket 相關設置
  const { socket } = useSocket();
  const { user } = useAuth();
  useEffect(() => {
    if (!socket || !itineraryId || !user?.id || !user?.nickname) return;
    // 加入房間
    const itineraryRoomData = {
      itineraryId: Number(itineraryId),
      userId: user.id,
      userName: user.nickname,
    };

    socket.emit('itinerary:join', itineraryRoomData);
    console.log('🏠 加入房間資料:', itineraryRoomData);

    // 監聽房間加入確認
    socket.on('itinerary:joined', (data) => {
      console.log('✅ 成功加入房間:', data);
    });

    //新增Day監聽
    const handleAddDay = (data: any) => {
      if (data.userId !== user?.id?.toString()) {
        setItineraryData((prev) => {
          if (!prev) return prev;
          return [...prev, data.dayData];
        });
      }
    };

    socket?.on('itinerary:addDay', (data) => {
      console.log('收到新增天數資料:', data);
      handleAddDay(data);
    });

    //刪除Day監聽
    const handleDeleteDay = (data: any) => {
      if (data.userId !== user?.id?.toString()) {
        setItineraryData((prev) => {
          console.log('刪除天數:', data.dayIndex);
          if (!prev) return prev;
          return prev.filter((_, index) => index !== data.dayIndex);
        });
      }
    };
    socket.on('itinerary:deleteDay', (data) => {
      console.log('收到刪除天數資料:', data);
      handleDeleteDay(data);
    });

    //增加節點監聽
    const handleSocketAddNode = (data: any) => {
      console.log('收到增加節點資料:', data);
      if (data.userId !== user?.id?.toString()) {
        setItineraryData((prev) => {
          if (!prev) return prev;
          const newData = prev.map((d, index) => {
            if (index === data.dayIndex) {
              return { ...d, Nodes: [...d.Nodes, data.nodeData] };
            }
            return d;
          });
          return newData;
        });
      }
    };
    socket.on('itinerary:addNode', (data) => {
      console.log('收到資料增加節點:', data);
      handleSocketAddNode(data);
    });

    //刪除節點監聽
    const handleSocketDeleteNode = (data: any) => {
      // 新增住宿監聽
      const handleSocketAddStayNode = (data: any) => {
        console.log('收到增加住宿資料:', data);
        if (data.userId !== user?.id?.toString()) {
          setItineraryData((prev) => {
            if (!prev) return prev;
            const newData = prev.map((d, index) => {
              if (index === data.dayIndex) {
                return {
                  ...d,
                  StayNodes: [...(d.StayNodes || []), data.stayNodeData],
                };
              }
              return d;
            });
            return newData;
          });
        }
      };
      socket.on('itinerary:addStayNode', (data) => {
        console.log('收到資料增加住宿:', data);
        handleSocketAddStayNode(data);
      });
      console.log('收到刪除節點資料:', data);
      // 不需要檢查 userId，因為後端已經排除了發送者
      setItineraryData((prev) => {
        if (!prev) return prev;
        const newData = prev.map((d, index) => {
          if (index === data.dayIndex) {
            const newNodes = d.Nodes.filter((_, i) => i !== data.nodeIndex);
            return { ...d, Nodes: newNodes };
          }
          return d;
        });
        console.log('刪除節點後更新的資料:', newData);
        return newData;
      });
    };
    socket.on('itinerary:nodeDeleted', (data) => {
      console.log('收到刪除節點事件:', data);
      handleSocketDeleteNode(data);
    });

    //拖曳節點監聽
    const handleSocketNodeDragged = (data: any) => {
      console.log('收到拖曳節點資料:', data);
      const {
        sourceDayIndex,
        sourceNodeIndex,
        targetDayIndex,
        targetNodeIndex,
        nodeData,
      } = data;

      // 檢查資料完整性
      if (
        sourceDayIndex === undefined ||
        targetDayIndex === undefined ||
        !nodeData
      ) {
        console.error('拖曳資料不完整:', data);
        return;
      }

      setItineraryData((prev) => {
        if (!prev) return prev;
        const newData = [...prev];

        // 檢查索引有效性
        if (
          sourceDayIndex >= newData.length ||
          targetDayIndex >= newData.length
        ) {
          console.error('拖曳索引超出範圍:', {
            sourceDayIndex,
            targetDayIndex,
            dataLength: newData.length,
          });
          return prev;
        }

        // 從原位置移除節點
        const sourceDay = newData[sourceDayIndex];
        if (!sourceDay || sourceNodeIndex >= sourceDay.Nodes.length) {
          console.error('來源節點不存在:', {
            sourceDayIndex,
            sourceNodeIndex,
            sourceNodes: sourceDay?.Nodes?.length,
          });
          return prev;
        }

        newData[sourceDayIndex] = {
          ...newData[sourceDayIndex],
          Nodes: newData[sourceDayIndex].Nodes.filter(
            (_, i) => i !== sourceNodeIndex
          ),
        };

        // 插入到新位置
        const targetNodes = [...newData[targetDayIndex].Nodes];
        targetNodes.splice(targetNodeIndex, 0, nodeData);

        newData[targetDayIndex] = {
          ...newData[targetDayIndex],
          Nodes: targetNodes,
        };

        console.log('拖曳節點後更新的資料:', newData);
        return newData;
      });
    };
    socket.on('itinerary:nodeDragged', (data) => {
      console.log('收到拖曳節點事件:', data);
      handleSocketNodeDragged(data);
    });

    // 時間調整監聽
    const handleSocketTimeChanged = (data: any) => {
      console.log('收到時間調整資料:', data);
      if (data.userId !== user?.id?.toString()) {
        setItineraryData((prev) => {
          if (!prev) return prev;
          const newData = prev.map((d, index) => {
            if (index === data.dayIndex) {
              const newNodes = d.Nodes.map((node, i) => {
                if (i === data.nodeIndex) {
                  return { ...node, durationMinutes: data.newDuration };
                }
                return node;
              });
              return { ...d, Nodes: newNodes };
            }
            return d;
          });
          console.log('時間調整後更新的資料:', newData);
          return newData;
        });
      }
    };
    socket.on('itinerary:timeChanged', (data) => {
      console.log('收到時間調整事件:', data);
      handleSocketTimeChanged(data);
    });
  }, [socket]);
  // 加天數方式

  //

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
  const [itineraryTitle, setItineraryTitle] = useState<string>('');

  // 從後端抓行程資料
  useEffect(() => {
    if (data && data.success) {
      const datas = data.data;
      setItineraryData((prev) => [...datas]); //設定context
      // console.log('data==>', data);
      setItineraryTitle(datas?.[0]?.Itinerary?.title || '未命名行程');
      // console.log('itineraryTitle==>', itineraryTitle);
    }
  }, [data]);

  // useEffect(() => {}, [socket]);

  //日期自動往前補
  const normalizeDays = (days: ItineraryData[]): ItineraryData[] => {
    return days.map((d, i) => {
      if (i === 0) return d;
      const prevDay = new Date(days[i - 1].dayDate);
      return { ...d, dayDate: addDays(prevDay, 1).toISOString() };
    });
  };

  // 移除會造成無限循環的 useEffect
  // useEffect(() => {
  //   let newItineraryData: ItineraryData[] = [];
  //   if (itineraryData) {
  //     newItineraryData = normalizeDays(itineraryData);
  //   }
  //   if (JSON.stringify(newItineraryData) !== JSON.stringify(itineraryData)) {
  //     setItineraryData(newItineraryData);
  //   }
  // }, [itineraryData]);

  // 控制iframe顯示
  const [isIframeVisible, setIsIframeVisible] = useState(false);
  // 這個函式會傳給子組件
  const handleIframeVisible = (show: boolean) => {
    setIsIframeVisible(show);
  };

  // 存檔狀態
  const [isSaving, setIsSaving] = useState(false);

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

  // 當開始搜索附近景點時
  const handleNearbySearchStart = () => {
    setIsLoadingNearby(true);
  };

  // 當附近景點模式改變時重置狀態
  useEffect(() => {
    if (showNearbyMode) {
      setIsLoadingNearby(true);
      setNearbyAttractions([]);
    } else {
      setNearbyAttractions([]);
      setIsLoadingNearby(false);
    }
  }, [showNearbyMode, mapPoint.latitude, mapPoint.longitude, searchRadius]);

  // 存檔功能
  const handleSave = async () => {
    if (!itineraryData || !itineraryId) return;

    setIsSaving(true);

    try {
      await fetch(`${API_SERVER}/itineraries/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itineraryData: itineraryData,
        }),
      });
      console.log('存檔完成');
    } catch (error) {
      console.error('存檔錯誤:', error);
    } finally {
      setIsSaving(false);
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
    let draggedNode: any = null;

    setItineraryData((prev) => {
      if (!prev) return prev;

      const newData = [...prev];

      // 取得要移動的節點
      draggedNode = newData[sourceDayIndex].Nodes[sourceNodeIndex];

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

      console.log('拖曳完成後的本地資料:', newData);
      return newData;
    });

    // 發送 Socket 事件給其他用戶
    const socketData = {
      itineraryId: Number(itineraryId),
      sourceDayIndex: sourceDayIndex,
      sourceNodeIndex: sourceNodeIndex,
      targetDayIndex: targetDayIndex,
      targetNodeIndex: targetNodeIndex,
      nodeData: draggedNode,
      // 為了向後兼容，也加入後端期望的格式
      dayIndex: targetDayIndex, // 後端可能需要這個
      newPosition: targetNodeIndex, // 後端可能需要這個
      userId: user?.id?.toString() || 'unknown',
      userName: user?.nickname || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    console.log('發送拖曳節點 Socket 資料:', socketData);
    socket?.emit('itinerary:nodeDragged', socketData);

    // 清理拖拽狀態
    setDraggedItem(null);
    setDragOverItem(null);
  };
  //給面板用的新增節點的函式（根據型別分流）
  const handleAddNode = async (dayIndex: number, nodeData: any) => {
    // 判斷是否為住宿型節點
    const isStayNode =
      nodeData?.Place?.latitude !== undefined &&
      nodeData?.Place?.longitude !== undefined &&
      nodeData?.Place?.address !== undefined;

    setItineraryData((prev) => {
      if (!prev) return prev;
      const newData = prev.map((d, index) => {
        if (index === dayIndex) {
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
      return newData;
    });

    // socket 廣播
    const socketData = {
      itineraryId: Number(itineraryId),
      dayIndex: dayIndex,
      nodeData: nodeData,
      userId: user?.id?.toString() || 'unknown',
      userName: user?.nickname || 'Anonymous',
      timestamp: new Date().toISOString(),
    };
    if (isStayNode) {
      socket?.emit('itinerary:addStayNode', {
        ...socketData,
        stayNodeData: nodeData,
      });
    } else {
      socket?.emit('itinerary:addNode', socketData);
    }
  };

  //處理刪除節點的函式
  const handleDeleteNode = async (dayIndex: number, nodeIndex: number) => {
    console.log('處理刪除節點 - dayIndex:', dayIndex, 'nodeIndex:', nodeIndex);

    // 先更新本地狀態
    setItineraryData((prev) => {
      if (!prev) return prev;
      const newData = prev.map((d, index) => {
        if (index === dayIndex) {
          const newNodes = d.Nodes.filter((_, i) => i !== nodeIndex);
          return { ...d, Nodes: newNodes };
        }
        return d;
      });
      console.log('刪除節點後的本地資料:', newData);
      return newData;
    });

    // 然後發送 socket 事件給其他用戶
    const socketData = {
      itineraryId: Number(itineraryId),
      dayIndex: dayIndex,
      nodeIndex: nodeIndex,
      userId: user?.id?.toString() || 'unknown',
      userName: user?.nickname || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    console.log('發送刪除節點 Socket 資料:', socketData);
    socket?.emit('itinerary:nodeDeleted', socketData);
  };

  // 處理時間調整的函式
  const handleTimeChange = async (
    dayIndex: number,
    nodeIndex: number,
    newDuration: number
  ) => {
    console.log(
      '處理時間調整 - dayIndex:',
      dayIndex,
      'nodeIndex:',
      nodeIndex,
      'newDuration:',
      newDuration
    );

    // 先更新本地狀態
    setItineraryData((prev) => {
      if (!prev) return prev;
      const newData = prev.map((d, index) => {
        if (index === dayIndex) {
          const newNodes = d.Nodes.map((node, i) => {
            if (i === nodeIndex) {
              return { ...node, durationMinutes: newDuration };
            }
            return node;
          });
          return { ...d, Nodes: newNodes };
        }
        return d;
      });
      console.log('時間調整後的本地資料:', newData);
      return newData;
    });

    // 發送 socket 事件給其他用戶
    const socketData = {
      itineraryId: Number(itineraryId),
      dayIndex: dayIndex,
      nodeIndex: nodeIndex,
      newDuration: newDuration,
      userId: user?.id?.toString() || 'unknown',
      userName: user?.nickname || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    console.log('發送時間調整 Socket 資料:', socketData);
    socket?.emit('itinerary:timeChanged', socketData);
  };

  return (
    <>
      {/* 暫時註解掉自動保存功能，使用手動存檔 */}
      {/* <ItineraryEditor itineraryData={itineraryData} /> */}
      {/* map_area */}
      <div className="grid grid-cols-[40%_60%] h-screen gap-6">
        {/* area_zone */}
        <div className="bg-gray-100 p-[15px] border-2 border-amber-300 rounded-3xl  space-y-3.5 overflow-scroll scrollbar-hide">
          {/* 標題和存檔按鈕區域 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-3xl mt-5">行程:{itineraryTitle}</h3>

            {/* 存檔按鈕 */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex mt-4 items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-600'
              }`}
            >
              <FontAwesomeIcon icon={faSave} />
              {isSaving ? '存檔中...' : '存檔'}
            </button>
          </div>
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
                itineraryData.map((day: any, index: number) => {
                  return (
                    <DayCard
                      key={index}
                      id={index + 1}
                      date={day.dayDate}
                      // date={dayTime}
                      active={activeId === index ? true : false}
                      onClick={() => setActiveId(index)}
                      onDelete={() => {
                        const newItineraryData = itineraryData.filter(
                          (d, i) => i !== index
                        );
                        setItineraryData(newItineraryData);
                        const data = {
                          itineraryId: Number(itineraryId),
                          dayIndex: index,
                          userId: user?.id,
                          userName: user?.nickname,
                          timestamp: new Date().toISOString(),
                        };
                        socket?.emit('itinerary:deleteDay', data);
                      }}
                    />
                  );
                })}
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
              className="cursor-pointer text-white bg-amber-400 px-[30px] py-2 rounded-lg"
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
                console.log('新增天數後的資料:', updatedData);
                // const { itineraryId, dayData, userId, userName, timestamp } = data;
                // 新增天數後自動滾到最右
                setTimeout(() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: scrollRef.current.scrollWidth,
                      behavior: 'smooth',
                    });
                  }
                }, 300);

                const data = {
                  itineraryId: Number(itineraryId),
                  dayData: newDay, // 只發送新增的那一天的資料
                  userId: user?.id?.toString() || 'unknown',
                  userName: user?.nickname || 'Anonymous',
                  timestamp: new Date().toISOString(),
                };
                socket?.emit('itinerary:addDay', data); //透過socket新增天數
                setItineraryData(updatedData);
              }}
            >
              新增
            </button>
          </div>

          {/* 顯示node區域 */}
          <div>
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
        <div className="bg-gray-200 relative flex">
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
          {/* 彈出視窗 */}
          {isIframeVisible && currentDayIndex !== null && (
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

      {/* Socket 調試面板 */}
      {/* <SocketDebugPanel itineraryId={itineraryId} /> */}
    </>
  );
}
