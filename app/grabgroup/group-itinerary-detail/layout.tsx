'use client';
import { useRouter } from 'next/navigation';
import Button from '../_components/Button';
import { ItineraryContext } from '@/hooks/use-itinerart';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OpenChatWindows from '../../member/user-info/_components/open-chat-windows';
import { API_SERVER } from '../../config/api-path';
import { ItineraryData } from '../_types/itineraryTypes';

interface Member {
  id: number;
  nickname: string;
  avatar: string;
}

interface ChatInterface {
  user_name: string | null;
  user_id: number | null;
  image: string | null;
  content: string | null;
  time: string | null;
  room_name: string | null;
  room_id: number | null;
  members?: Member[]; // 新增成員陣列
}

export default function GroupItineraryDetalPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState<ItineraryData[] | null>(
    null
  );
  const [previousPath, setPreviousPath] = useState<string>('');
  const params = useSearchParams().get('itineraryId');
  const itineraryId = params;
  const [openChats, setOpenChats] = useState<ChatInterface[]>([]); //所有聊天室資訊 小視窗

  // 追蹤來源頁面 - 使用更可靠的方法
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 🔄 方法1: 檢查 sessionStorage 中的來源標記
      const fromCreatePage = sessionStorage.getItem('fromCreateGroupItinerary');

      // 🔄 方法2: 檢查 URL 參數
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('source');

      // 🔄 方法3: 檢查 document.referrer (備用)
      const referrer = document.referrer;
      let referrerPath = '';

      if (referrer) {
        referrerPath = new URL(referrer).pathname;
      }

      console.log('🔍 SessionStorage fromCreatePage:', fromCreatePage);
      console.log('🔍 URL source 參數:', source);
      console.log('🔍 Document referrer:', referrer);
      console.log('🔍 Referrer path:', referrerPath);

      // 判斷是否來自建立頁面
      const isFromCreatePage =
        fromCreatePage === 'true' ||
        source === 'create-group-itinerary' ||
        referrerPath.includes('create-group-itinerary');

      setPreviousPath(
        isFromCreatePage ? 'create-group-itinerary' : referrerPath
      );

      console.log('🔍 最終判斷 - 是否來自建立頁面:', isFromCreatePage);

      // 使用完後清除 sessionStorage 標記
      if (fromCreatePage) {
        sessionStorage.removeItem('fromCreateGroupItinerary');
      }
    }
  }, []);

  // 抓取特定房間的所有對話訊息
  const fetchRoomMessages = async (roomId: number, roomName?: string) => {
    try {
      console.log(`開始抓取房間 ${roomId} 的對話訊息...`);

      // 檢查是否在瀏覽器環境
      if (typeof window === 'undefined') {
        console.log('伺服器端環境，無法訪問 localStorage');
        return;
      }

      // 正確獲取 token
      const userInfo = localStorage.getItem('BackpackUserInfo');
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) {
        console.error('未找到認證 token');
        return;
      }

      // 🔄 同時抓取房間訊息和房間成員資料
      const [messagesResponse, membersResponse] = await Promise.all([
        // 抓取房間訊息 - 使用與 chat-box 相同的 API
        fetch(`${API_SERVER}/chat/allmessage?roomId=${roomId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        // 抓取房間成員資料 (使用和 user-info 一樣的 API)
        fetch(`${API_SERVER}/friendships/allmessage`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (messagesResponse.ok) {
        const messagesResult = await messagesResponse.json();
        console.log('房間對話訊息:', messagesResult);

        // 初始化 members 為空陣列
        let roomMembers: Member[] = [];

        // 嘗試從成員 API 取得 members 資料
        if (membersResponse.ok) {
          const membersResult = await membersResponse.json();
          console.log('所有房間資料:', membersResult);

          // 在 allRoomsLatestMessages 中找到對應的房間
          const targetRoom = membersResult.data?.allRoomsLatestMessages?.find(
            (room: any) => room.roomData.id === roomId
          );

          if (targetRoom && targetRoom.members) {
            roomMembers = targetRoom.members;
            console.log('✅ 找到房間成員:', roomMembers);
          } else {
            console.log('⚠️ 未找到房間成員資料');
          }
        }

        if (messagesResult.success && messagesResult.data) {
          // 後端回應的是訊息陣列，取最新的一則作為預覽
          const messages = messagesResult.data;
          const latestMessage = messages[0]; // 最新訊息

          const chatRoom: ChatInterface = {
            room_id: roomId,
            room_name: roomName || `聊天室 ${roomId}`, // ✅ 使用傳入的房間名稱
            user_name: null,
            user_id: null,
            image: null,
            content: latestMessage?.content || '開始聊天吧！',
            time: latestMessage?.createdAt || new Date().toISOString(),
            members: roomMembers, // ✅ 使用從 API 取得的成員資料
          };

          // 檢查該聊天室是否已經開啟
          const exists = openChats.some((chat) => chat.room_id === roomId);
          if (!exists) {
            setOpenChats((prev) => [...prev, chatRoom]);
            console.log('✅ 聊天室已開啟:', chatRoom);
          }
        }
      } else {
        console.error('抓取房間訊息失敗:', messagesResponse.statusText);
      }
    } catch (error) {
      console.error('抓取房間訊息時發生錯誤:', error);
    }
  };

  // 根據 itineraryId 抓取對應的聊天室資訊 抓取房間id 和房間名稱
  const fetchItineraryChatRoom = async () => {
    if (!itineraryId) return;

    // 檢查是否在瀏覽器環境
    if (typeof window === 'undefined') {
      console.log('伺服器端環境，無法訪問 localStorage');
      return;
    }

    // 正確獲取 token
    const userInfo = localStorage.getItem('BackpackUserInfo');
    const token = userInfo ? JSON.parse(userInfo).token : null;

    if (!token) {
      console.error('未找到認證 token');
      return;
    }

    try {
      console.log(`根據行程 ID ${itineraryId} 尋找對應的聊天室...`);

      // 先獲取行程資訊以取得正確的房間名稱
      const itineraryResponse = await fetch(
        `${API_SERVER}/itineraries/detail?itineraryId=${itineraryId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (itineraryResponse.ok) {
        const itineraryResult = await itineraryResponse.json();
        console.log('行程資訊:', itineraryResult);

        // 假設有 API 可以根據 itineraryId 找到對應的 roomId
        const response = await fetch(
          `${API_SERVER}/chat/itineraries/${itineraryId}/room`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('行程聊天室資訊:', result);
          console.log('聊天室_id:', result.data.id);

          if (result.success && result.data.id) {
            // 使用行程標題作為房間名稱，或使用後端回傳的 roomName
            const roomName =
              result.data.roomName ||
              `行程: ${itineraryResult.data?.[0]?.title || ''}`;

            // 找到房間 ID 後，抓取該房間的所有對話
            await fetchRoomMessages(result.data.id, roomName);
          }
        }
      }
    } catch (error) {
      console.error('抓取行程聊天室失敗:', error);
    }
  };

  // 當 itineraryId 改變時，自動抓取對應的聊天室訊息
  useEffect(() => {
    if (itineraryId) {
      fetchItineraryChatRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itineraryId]);

  return (
    <ItineraryContext.Provider value={{ itineraryData, setItineraryData }}>
      <div className="flex flex-col px-16 py-16 gap-[30px]">
        <div className="space-y-2.5">
          <h1 className="text-center text-4xl">設定揪團行程</h1>
          <p className="text-center text-base">
            編輯你們想去的景點和規劃你的行程
          </p>
        </div>
        {/* 訊息視窗區  */}
        {/* <OpenChatWindows openChats={openChats} setOpenChats={setOpenChats} /> */}

        {previousPath.includes('create-group-itinerary') && (
          <>
            <div className="flex gap-x-[21px] justify-center w-full">
              <Button content="回上一頁" onClick={() => router.back()} />
              <Button
                content="下一頁"
                onClick={() =>
                  router.push(
                    `/grabgroup/team-up-edit-article?itineraryId=${itineraryId}`
                  )
                }
              />
            </div>
          </>
        )}

        {children}
      </div>
    </ItineraryContext.Provider>
  );
}
