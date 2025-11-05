'use client';

import { faXmark, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useFetch } from '@/hooks/useFetch';
import PanelCard from './panel-card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import RagularButton from '../../../../components/ui/regular-button';
import { useContext } from 'react';
import { ItineraryContext, useItinerary } from '@/hooks/use-itinerart';
import {
  ItineraryContextType,
  ItineraryData,
  Node,
  StayNode,
  GoogleMapPlace,
} from '../../_types/itineraryTypes';

interface IframeProps {
  visible: boolean;
  dayData?: number;
  onSend: (msg: boolean) => void;
  currentId: number;
}
//googlePlace
interface GoogleNodeData {
  id: number;
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  photoReference: string;
  createdAt: string;
}

export default function PlacePanel({
  visible,
  onSend,
  currentId,
}: IframeProps) {
  // const router = useRouter();
  // const url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/grabgroup/panel?daydata=${dayData}`;
  const [isSearching, setIsSearching] = useState(false);
  const [inputContent, setInputContent] = useState<string | null>();
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [googlePlaceNodes, setGooglePlaceNodes] = useState<
    GoogleNodeData[] | undefined
  >(undefined);
  const [placeData, setPlaceData] = useState<GoogleNodeData | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  const { data, loading, error, refetch } = useFetch(url);

  const { itineraryData, setItineraryData } = useItinerary(); // 公共

  //觸發使用fetch 發送請求
  const handleSearch = (keyword: string) => {
    const finUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/search?place=${keyword}`;
    setUrl(finUrl);
  };

  //處理顯示詳細資訊
  const handleDetailPanel = (id: number) => {
    if (!googlePlaceNodes) return;
    const data = googlePlaceNodes.find((n) => n.id === id);
    if (data) setPlaceData(data);
    setIsSearching(!isSearching);
  };

  //處理資訊 存至於當天景點
  // const handelInsertToNodes = (placeData: any,dayDate:string) => {
  //   const data  = {
  //             itineraryId: 22,
  //             dayDate:dayDate
  //             // startTime: string;
  //             // Nodes: Node[] | [];
  //             // StayNodes: StayNode[] | [];
  //           }
  //   }
  // };

  //data 有變動值 設定至state
  useEffect(() => {
    if (data && !loading) setGooglePlaceNodes(data.data);
  }, [data]);

  return (
    <>
      <div
        className={`absolute bg-[#F7FAFC] w-[564px] h-[779px] rounded-2xl p-4  shadow-[0_4px_10px_rgba(0,0,0,0.4)] space-y-2.5 `}
      >
        {/* 按鈕 */}
        <div className="flex justify-end">
          {/* 回上一頁 */}
          <span className={` w-full m-auto`}>
            <FontAwesomeIcon icon={faAngleLeft} onClick={() => router.back()} />
          </span>
          {/* 關閉 */}
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => onSend(!visible)}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full flex items-center border-2 border-gray-300 rounded-full w-full space-x-[15px] px-5 py-2.5">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            className="w-full"
            placeholder="搜尋景點"
            value={inputContent || ''}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                inputContent &&
                inputContent.trim().length > 0
              ) {
                handleSearch(inputContent);
                setIsSearching(!isSearching);
              }
            }}
          ></input>
        </div>

        {/* 有輸入input 顯示 */}

        {isSearching && (
          <div className="w-full flex flex-col gap-2.5 my-2.5">
            {Array.isArray(googlePlaceNodes)
              ? googlePlaceNodes.map((node, index) => {
                  return (
                    <PanelCard
                      key={index}
                      image={node.photoReference}
                      title={node.name}
                      address={node.formattedAddress}
                      onClick={() => handleDetailPanel(node.id)} //設定googlePlaceNodes id 給 PlaceDetail
                    />
                  );
                })
              : ''}
          </div>
        )}
        {placeData ? <p>have</p> : <p>nono</p>}
        {placeData && (
          <>
            {placeData?.photoReference ? (
              <img
                src={placeData.photoReference}
                alt={placeData.name}
                width={400}
                height={400}
                className="w-full h-[244px]"
              />
            ) : (
              <p>這個地點沒有圖片</p>
            )}
            <div>
              <label htmlFor="">停留時間:</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={0}
                step={5} // 每次加減 5 分鐘
                className="border rounded p-2 w-24 text-center"
                placeholder="分鐘"
              />
            </div>
            <div className="m-5">
              <h1 className="text-[24px]">{placeData?.name}</h1>
              <p className="text-5">位置: {placeData?.formattedAddress}</p>
            </div>

            <RagularButton
              content="加入行程"
              onClick={() => {
                //創建節點
                const node = {
                  durationMinutes: durationMinutes,
                  GoogleMapPlace: placeData,
                };
                console.log('node=======>', node);
                //將節點放入該天底下的node節點後
                setItineraryData((prev) =>
                  prev
                    ? prev.map((day) =>
                        day.id === currentId
                          ? { ...day, Nodes: [...day.Nodes, node] }
                          : day
                      )
                    : []
                );
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
