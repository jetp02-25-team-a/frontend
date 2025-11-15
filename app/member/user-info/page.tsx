'use client';
import MessageBox from '../_components/message-box';
import FriendCard from '../_components/friend-card';
import ChatBox from '../_components/chat-box';
import { useState, useEffect } from 'react';
//引入hooks(自定義)
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '../../../hooks/use-Auth';
import ListButton from './_components/list-button';
import Checklist from './_components/checklist';
import ContactList from './_components/contactlist';
import OpenChatWindows from './_components/open-chat-windows';
import UserCard from '../_components/user-card';
import { ApiResponse } from '../_interfaces/userData';
import { API_SERVER } from '../../config/api-path';
import { IMAGE_PATH, AVATAR_PATH } from '../../config/image-path';
import FriendRecommend from './_components/friend-recommend';
import { useRouter } from 'next/navigation';

// const friend_data = [
//   { id: 1, user_name: '王小美', avatar: 'image.png', address: '台北' },
//   { id: 2, user_name: '大衝名', avatar: 'image.png', address: '新北產業園區' },
// ];

//
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

interface InviteMessage {
  received: [
    {
      id: number;
      itineraryId: number;
      senderId: number;
      receiverId: number;
      status: number;
      createdAt: string;
      updatedAt: string;
      itinerary: {
        userId: number;
        title: string;
      };
      sender: {
        id: number;
        nickname: string;
        fullName: string;
        avatar: null;
      };
    },
    {
      id: number;
      itineraryId: number;
      senderId: number;
      receiverId: number;
      status: number;
      createdAt: string;
      updatedAt: string;
      itinerary: {
        userId: number;
        title: string;
      };
      sender: {
        id: number;
        nickname: string;
        fullName: string;
        avatar: null;
      };
    },
  ];
  sent: [
    {
      id: number;
      itineraryId: number;
      senderId: number;
      receiverId: number;
      status: number;
      createdAt: string;
      updatedAt: string;
      itinerary: {
        userId: number;
        title: string;
      };
      receiver: {
        id: number;
        nickname: string;
        fullName: string;
        avatar: string;
      };
    },
  ];
}

const userDataInit: ApiResponse = {
  success: false,
  data: {
    id: 0,
    email: '',
    nickname: null,
    fullName: null,
    avatar: null,
    description: null,
    point: 0,
  },
};

export default function UserInfoPage() {
  const [openChats, setOpenChats] = useState<ChatInterface[]>([]); //所有聊天室資訊 小視窗
  const [options, setOptions] = useState<string>('通知');
  const [allInviteMessage, setAllInviteMessage] = useState<InviteMessage>();
  const router = useRouter();
  //分romms 跟 all_friends
  const [contact, setContact] = useState<any>({
    allRoomsLatestMessages: [],
    allFriendLatestMessage: [],
  }); //通訊錄所有使用者
  const { user, isReady } = useAuth(); //使用者資訊
  //搜索有好朋友房間最新訊息
  const url = `${API_SERVER}/friendships/allmessage`;
  //取得後放入state
  const { data, loading, error } = useFetch(url);

  //使用者資料
  const [userData, setUserData] = useState(userDataInit);
  //資料拿取
  const getUserData = async () => {
    const response = await fetch(`${API_SERVER}/user/${user.id}`);
    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, [user.id]);

  //有資料設定contact
  useEffect(() => {
    if (data) {
      console.log('完整的 contact 資料:', data.data);
      console.log('allRoomsLatestMessages:', data.data.allRoomsLatestMessages);
      setContact(data.data);
    }
  }, [data]);

  //卻認是否存在於小視窗清單中
  const existChat = (chatsList: ChatInterface[], newChat: ChatInterface) => {
    const exists = chatsList.some(
      (chat) =>
        chat.room_id === newChat.room_id && chat.user_id === newChat.user_id
    );
    if (exists) return;
    else setOpenChats((prev) => [...prev, newChat]);
  };

  //取得所有行程邀請訊息
  const getALlInviteMessageUrl = `${API_SERVER}/itineraries/all-invite/${user?.id}`;

  const handelAllInviteMessage = async () => {
    try {
      const reult = await fetch(getALlInviteMessageUrl);
      if (reult.ok) {
        const r = await reult.json();

        setAllInviteMessage(r.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //取得所有持有行程 http://localhost:3005/api/itineraries/user-itineraries/7
  const [userItineraries, setUserItineraries] = useState<any[]>([]);
  const getUserItinerariesUrl = `${API_SERVER}/itineraries/user-itineraries`;

  const handelUserItineraries = async () => {
    try {
      const reult = await fetch(getUserItinerariesUrl, {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer ' +
            JSON.parse(localStorage.getItem('BackpackUserInfo') || '{}').token,
        },
      });
      if (reult.ok) {
        const r = await reult.json();
        console.log('userItineraries', r.data);
        setUserItineraries(r.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //一開啟網頁就抓取資料
  useEffect(() => {
    if (user?.id) handelAllInviteMessage();
  }, [user]);

  return (
    <>
      <div className="grid grid-cols-[80%_20%]">
        {/* 個人資訊區 */}
        <div className="bg-light-orange relative">
          <div className="flex flex-col items-center py-16 gap-[30px]">
            {/* 個人資訊區 */}

            <UserCard
              avatar={
                user.avatar
                  ? `${AVATAR_PATH}/${user.avatar}`
                  : '/avatar_default.png'
              }
              name={user.nickname || '尚未設定暱稱'}
              description={userData.data?.description || '向別人介紹你自己!'}
              id={user.id}
              state="self"
            />

            {/* btns */}
            <div className="w-[900px]">
              <div className="flex">
                <ListButton
                  name="發文"
                  active={false}
                  onClick={() => setOptions('發文')}
                />
                <ListButton
                  name="收藏景點"
                  active={false}
                  onClick={() => setOptions('收藏景點')}
                />
                <ListButton
                  name="好友"
                  active={false}
                  onClick={() => setOptions('好友')}
                />
                <ListButton
                  name="行程"
                  active={false}
                  onClick={() => {
                    setOptions('行程');
                    handelUserItineraries(); //按下後取得所有行程
                  }}
                />
                <ListButton
                  name="通知"
                  active={true}
                  onClick={() => {
                    setOptions('通知');
                    handelAllInviteMessage(); //按下後刷新
                  }}
                />
              </div>
              <div className=" px-5 pb-6 rounded-b-3xl bg-white ">
                {/* 顯示區域 */}
                <div>
                  {options === '發文' && <>發表文章</>}
                  {options === '收藏景點' && <>收藏景點</>}
                  {options === '好友' && <></>}
                  {options === '行程' && (
                    <>
                      {userItineraries && userItineraries.length > 0 ? (
                        userItineraries.map((itinerary, index) => (
                          <div
                            key={index}
                            className="border-b-2 border-gray-300 py-4 flex gap-3 items-center justify-between"
                          >
                            <div className="flex">
                              <p className="text-gray-600">
                                {itinerary.Itinerary?.area || '未指定區域'}
                              </p>
                              <h3 className="text-xl font-semibold">
                                {itinerary.Itinerary?.title || '無標題'}
                              </h3>
                            </div>
                            <div className="flex items-center gap-5">
                              <p>{itinerary.Itinerary?.figure} 人/團體</p>
                              <p className="text-xl font-semibold mr-40">
                                {(() => {
                                  const dateValue =
                                    itinerary.Itinerary?.Days?.[0]?.dayDate;
                                  if (!dateValue) return '無日期';

                                  const date = new Date(dateValue);
                                  if (isNaN(date.getTime())) return '無效日期';

                                  return date.toLocaleDateString('zh-TW');
                                })()}
                              </p>{' '}
                              <button
                                className="border-2 border-amber-600 p-2 rounded-xl"
                                onClick={() =>
                                  router.push(
                                    `/grabgroup/group-itinerary-detail-socket?itineraryId=${itinerary.Itinerary?.id}`
                                  )
                                }
                              >
                                詳細頁面
                              </button>
                            </div>

                            {/* 顯示更多行程資訊 */}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-500">
                          目前沒有行程資料
                        </div>
                      )}
                    </>
                  )}
                  {options === '通知' && (
                    <>
                      {/* 接收 */}
                      {allInviteMessage &&
                        allInviteMessage.received.map((e: any, i: number) => {
                          return (
                            <Checklist
                              key={i}
                              title={`申請加入${e.itinerary.title}`}
                              snederName={e.sender.nickname}
                              senderAvatar={e.sender.avatar}
                              invitationId={e.id}
                              refresh={handelAllInviteMessage}
                              type="agree"
                            />
                          );
                        })}
                      {/* 送出的請求 */}
                      {allInviteMessage &&
                        allInviteMessage.sent.map((e: any, i: number) => {
                          return (
                            <Checklist
                              key={i}
                              title={`申請${e.itinerary.title}`}
                              snederName={e.receiver.nickname}
                              senderAvatar={e.receiver.avatar}
                              refresh={handelAllInviteMessage}
                              type="answer"
                            />
                          );
                        })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* 訊息視窗區  */}
          <OpenChatWindows openChats={openChats} setOpenChats={setOpenChats} />
        </div>
        <div className="bg-gray-300">
          <FriendRecommend />
          {/* <div className="p-2.5 space-y-2.5">
            {friend_data.map((card, index) => {
              return (
                <FriendCard
                  key={index}
                  avatar={card.avatar}
                  name={card.user_name}
                  address={card.address}
                />
              );
            })}
          </div> */}

          <h4 className="text-center text-[24px] py-2.5 border-b-2 border-gray-600 bg-white">
            聯絡人
          </h4>
          {/* 所有聯絡人區 */}
          <ContactList
            contact={contact}
            userId={user ? user.id : 0}
            openChats={openChats}
            onOpenChat={(newChat) => existChat(openChats, newChat)}
          />
        </div>
      </div>
    </>
  );
}
