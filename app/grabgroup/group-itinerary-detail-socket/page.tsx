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

import { addDays, addMinutes } from 'date-fns';
import { ItineraryEditor } from '../_components/ItineraryEditor';
import { useSearchParams } from 'next/navigation';
import { API_SERVER } from '../../config/api-path';

export interface mapPoint {
  latitude: number; //預設台北101
  longitude: number;
}

export default function GroupItineraryDetailPage() {
  const params = useSearchParams().get('itineraryId');
  const itineraryId = params;

  // Socket 相關設置
  const { socket } = useSocket();
  const { user } = useAuth();

  //
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

  useEffect(() => {
    if (data && data.success) {
      const datas = data.data;
      setItineraryData((prev) => [...datas]); //設定context
      console.log('ItineraryData==>', itineraryData);
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
  //給面板用的新增節點的函式
  const handleAddNode = async (dayIndex: number, nodeData: any) => {
    console.log('處理新增節點 - dayIndex:', dayIndex, 'nodeData:', nodeData);

    // 先更新本地狀態
    setItineraryData((prev) => {
      if (!prev) return prev;
      const newData = prev.map((d, index) => {
        if (index === dayIndex) {
          return { ...d, Nodes: [...d.Nodes, nodeData] };
        }
        return d;
      });
      console.log('更新後的本地資料:', newData);
      return newData;
    });

    // 然後發送 socket 事件給其他用戶
    const socketData = {
      itineraryId: Number(itineraryId),
      dayIndex: dayIndex,
      nodeData: nodeData,
      userId: user?.id?.toString() || 'unknown',
      userName: user?.nickname || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    console.log('發送新增節點 Socket 資料:', socketData);
    socket?.emit('itinerary:addNode', socketData);
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
                console.log('新增天數後的資料:', updatedData);
                // const { itineraryId, dayData, userId, userName, timestamp } = data;
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
            {/* 顯示所有天數 */}

            {itineraryData &&
              itineraryData.map((day, index) => {
                let tmpTime = day.startTime;
                if (index !== activeId) return;
                return (
                  <div
                    className="flex flex-col items-center gap-3.5"
                    key={index}
                  >
                    <div className="w-full">
                      <h3 className="text-start text-[24px]">{`第${index + 1}天`}</h3>
                      {/* {itineraryData[0].startTime} */}
                      {/* <p className="text-start text-base">{day.dayDate}</p>
                    <p className="text-start text-base">{day.id}</p> */}
                    </div>

                    {/* 節點區 */}
                    {day.Nodes.map((node, nodeIndex) => {
                      let start;
                      let end;
                      if (nodeIndex === 0) {
                        start = new Date(tmpTime); //為第一個設定開始時間為最開始時間
                        end = addMinutes(start, node.durationMinutes); //結束時間設定為開始＋時長度
                        tmpTime = end.toISOString(); //在將暫存時間設定為end時間提供下一次作為開始時間讀取
                      } else {
                        start = new Date(tmpTime);
                        end = addMinutes(start, node.durationMinutes); //結束時間設定為開始＋時長度
                        tmpTime = end.toISOString(); //在將暫存時間設定為end時間提供下一次作為開始時間讀取
                      }

                      // 檢查是否為拖拽狀態
                      const isDragging =
                        draggedItem?.dayIndex === index &&
                        draggedItem?.nodeIndex === nodeIndex;
                      const isDragOver =
                        dragOverItem?.dayIndex === index &&
                        dragOverItem?.nodeIndex === nodeIndex;

                      return (
                        <div key={nodeIndex} className="w-full">
                          <NodeCard
                            image={
                              (node as any).Attraction?.image ||
                              node.Place?.image ||
                              '/default-place.jpg'
                            }
                            duration_minute={node.durationMinutes}
                            title={
                              (node as any).Attraction?.name ||
                              node.Place?.nameZh ||
                              '未知地點'
                            }
                            address={
                              (node as any).Attraction?.addrFull ||
                              node.Place?.addrFull ||
                              '地址不詳'
                            }
                            start_time={start.toISOString()}
                            end_time={end.toISOString()}
                            dayIndex={index}
                            nodeIndex={nodeIndex}
                            // 🔄 拖拽相關屬性
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            isDragging={isDragging}
                            isDragOver={isDragOver}
                            // 🗑️ 刪除節點功能
                            onDeleteNode={handleDeleteNode}
                            onClick={() =>
                              setMapPoint({
                                latitude:
                                  (node as any).Attraction?.lat ||
                                  node.Place?.lat ||
                                  25.033964,
                                longitude:
                                  (node as any).Attraction?.lng ||
                                  node.Place?.lng ||
                                  121.564468,
                              })
                            }
                          />
                          <div className="bg-gray-600 w-1 h-[43px] m-auto"></div>
                        </div>
                      );
                    })}

                    {/* add btn  */}
                    <div className="flex gap-[30px]">
                      <AddItineraryButton
                        icon={faPlus}
                        btn_name="加入行程"
                        onClick={() => {
                          setCurrentDayIndex(index); //設置當天日期，使用陣列索引
                          setIsIframeVisible(true);
                        }}
                      />
                      <AddItineraryButton icon={faHouse} btn_name="加入住宿" />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* ------------------------------------------- */}
        {/* map_zone */}
        <div className="bg-amber-700 relative">
          {/* googlemap */}
          <div className="w-full mx-auto my-auto ">
            <Map
              latitude={mapPoint.latitude}
              longitude={mapPoint.longitude}
              width={1000}
              height={1000}
            />
          </div>
          {/* 彈出視窗 */}
          {isIframeVisible && currentDayIndex !== null && (
            <div className="absolute inset-0 z-50 flex left-3 top-3">
              <PlacePanel
                visible={isIframeVisible}
                onSend={handleIframeVisible}
                currentId={currentDayIndex}
                onAddNode={handleAddNode}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
