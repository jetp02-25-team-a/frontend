'use client';

import { faXmark, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import RagularButton from '../../../../components/ui/regular-button';
import PanelCard from './_panel-card';
import { useFetch } from '@/hooks/useFetch';
import { useItinerary } from '@/hooks/use-itinerart';
import { ItineraryData } from '../../_types/itineraryTypes';
import { API_SERVER } from '../../../config/api-path';

interface IframeProps {
  visible: boolean;
  onSend: (msg: boolean) => void; // 關閉面板用：onSend(false)
  currentId: number; // 可能是 day.id 或 day 的索引
  // 可選：如果你想讓父層自己處理新增，也可以提供這個
  onAddNode?: (
    dayIndexOrId: number,
    node: { durationMinutes: number; Place: SearchData }
  ) => void;
}

interface SearchData {
  id: number;
  name: string;
  nameZh: string;
  addrCity: string;
  addrDistrict: string;
  addrFull: string;
  lat: number;
  lng: number;
  image: string;
}

export default function PlacePanel({
  visible,
  onSend,
  currentId,
  onAddNode,
}: IframeProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [inputContent, setInputContent] = useState<string>('');
  const [url, setUrl] = useState<string | undefined>(undefined);

  const [searchData, setSearchData] = useState<SearchData[] | undefined>();
  const [placeData, setPlaceData] = useState<SearchData | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  const { data, loading } = useFetch(url);
  const { itineraryData, setItineraryData } = useItinerary();

  // 觸發搜尋
  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return;
    const finUrl = `${API_SERVER}/itineraries/search?place=${encodeURIComponent(
      keyword.trim()
    )}`;
    setUrl(finUrl);
    setIsSearching(true); // 明確切換到「列表」狀態
    setPlaceData(null); // 清掉詳情
  };

  // 顯示某個結果的詳情
  const handleDetailPanel = (id: number) => {
    if (!searchData) return;
    const found = searchData.find((n) => n.id === id) || null;
    setPlaceData(found);
    setIsSearching(false); // 進入詳情畫面
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

  const addNodeToDay = () => {
    if (!placeData) return;
    const dur = Number.isFinite(durationMinutes)
      ? Math.max(0, durationMinutes)
      : 0;

    const node = {
      durationMinutes: dur,
      Place: placeData,
    };

    // 如果父層提供 callback，就讓父層處理
    if (onAddNode) {
      onAddNode(currentId, node);
      onSend(false); // 關閉面板
      return;
    }

    // 否則在這裡直接更新 context
    setItineraryData((prev) => {
      const days = prev ? [...prev] : [];
      const idx = resolveDayIndex(days, currentId);
      if (idx === -1) return prev || [];

      const target = days[idx];
      const next = {
        ...target,
        Nodes: [...(target.Nodes || []), node],
      };
      days[idx] = next;
      return days;
    });

    onSend(false); // 關閉面板
  };

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
              <span>返回列表</span>
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
              handleSearch(inputContent);
            }
          }}
        />
      </div>

      {/* 搜尋結果列表 */}
      {isSearching && (
        <div className="w-full shrink-0 flex flex-col gap-2.5 my-2.5 overflow-y-auto max-h-160">
          {Array.isArray(searchData) && searchData.length > 0 ? (
            searchData.map((node) => (
              <PanelCard
                key={node.id}
                image={node.image}
                title={node.nameZh || node.name}
                address={node.addrFull}
                onClick={() => handleDetailPanel(node.id)}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 px-2">
              沒有找到結果，請換個關鍵字試試。
            </div>
          )}
        </div>
      )}

      {/* 詳情 + 加入行程 */}
      {placeData && !isSearching && (
        <>
          {placeData.image ? (
            <img
              src={placeData.image}
              alt={placeData.nameZh || placeData.name}
              width={400}
              height={400}
              className="w-full h-[244px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-[244px] flex items-center justify-center bg-gray-200 rounded-lg">
              <span className="text-gray-600 text-sm">這個地點沒有圖片</span>
            </div>
          )}

          <div className="mt-4">
            <label className="text-sm text-gray-600 mr-3">
              停留時間（分鐘）
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min={0}
              step={5}
              className="border rounded p-2 w-28 text-center"
              placeholder="分鐘"
            />
          </div>

          <div className="m-5">
            <h1 className="text-[20px] font-semibold">
              {placeData.nameZh || placeData.name}
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              位置：{placeData.addrFull}
            </p>
          </div>

          <RagularButton content="加入行程" onClick={addNodeToDay} />
        </>
      )}
    </div>
  );
}
