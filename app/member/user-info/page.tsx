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

const friend_data = [
  { id: 1, user_name: '王小美', avatar: 'image.png', address: '台北' },
  { id: 2, user_name: '大衝名', avatar: 'image.png', address: '新北產業園區' },
];

//
interface ChatInterface {
  user_name: string | null;
  user_id: number | null;
  image: string | null;
  content: string | null;
  time: string | null;
  room_name: string | null;
  room_id: number | null;
}

interface RoomData {
  createdAt: string;
  id: number;
  roomName: string;
}
interface RoomMessage {
  LatestMessage: {
    content: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
  };
  roomData: RoomData;
}
interface friendData {
  avatar: string | null;
  id: number;
  nickname: string;
}

interface PersonMessage {
  LatestMessage: {
    content: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
  };
  friendData: friendData;
}

// interface InviteMessage {
//   id: number;
//   itineraryId: number;
//   senderId: number;
//   receiverId: number;
//   status: number;
//   createdAt: string;
//   updatedAt: string;
//   itinerary: {
//     userId: number;
//     title: string;
//   };
//   sender: {
//     id: number;
//     nickname: string;
//     fullName: string;
//     avatar: string | null;
//   };

// }

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

export default function UserInfoPage() {
  const [openChats, setOpenChats] = useState<ChatInterface[]>([]); //所有聊天室資訊 小視窗
  const [options, setOptions] = useState<string>('通知');
  const [allInviteMessage, setAllInviteMessage] = useState<InviteMessage>();
  //分romms 跟 all_friends
  const [contact, setContact] = useState<any>({
    allRoomsLatestMessages: [],
    allFriendLatestMessage: [],
  }); //通訊錄所有使用者
  const { user, isReady } = useAuth(); //使用者資訊
  //搜索有好朋友房間最新訊息
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/friendships/allmessage`;
  //取得後放入state
  const { data, loading, error } = useFetch(url);
  //有訊息印出東西
  useEffect(() => {
    console.log('contact=>', contact);
  }, [contact]);

  //打印出來
  useEffect(() => {
    if (data) {
      setContact(data.data);
    }
  }, [data]);

  //關閉聊天室
  const closeChat = (index: number) => {
    const nextChats = openChats.filter((room) => room !== openChats[index]);
    setOpenChats(nextChats);
  };

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
  const getALlInviteMessageUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/all-invite/${user?.id}`;

  const handelAllInviteMessage = async () => {
    console.log('dwon');
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
  //一開啟網頁就抓取資料
  useEffect(() => {
    if (user?.id) handelAllInviteMessage();
  }, [user]);

  useEffect(() => {
    console.log('setAllInviteMessage==>', allInviteMessage);
  }, [allInviteMessage]);

  return (
    <>
      <div className="grid grid-cols-[80%_20%]">
        {/* 個人資訊區 */}
        <div className="bg-light-orange relative">
          <div className="flex flex-col items-center py-16">
            {/* 個人資訊區 */}
            <div>pppppp</div>
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
                  {options === '好友' && <>好友區</>}
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
          {/*  */}
          <div className="absolute right-0 bottom-0 flex gap-2.5 items-end">
            {openChats.map((chatroom, index) => {
              return (
                <ChatBox
                  key={index}
                  roomId={chatroom.room_id}
                  roomTitle={chatroom.room_name}
                  userId={chatroom.user_id}
                  userNickname={chatroom.user_name}
                  onClose={() => closeChat(index)}
                />
              );
            })}
          </div>
        </div>
        <div className="bg-gray-300">
          <div className="p-2.5 space-y-2.5">
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
          </div>

          <h4 className="text-center text-[24px] py-2.5 border-b-2 border-gray-600 bg-white">
            聯絡人
          </h4>
          {/* 1.團體 */}
          {contact.allRoomsLatestMessages.map(
            (message: RoomMessage, index: number) => {
              const newChat = {
                user_name: null,
                user_id: null,
                image: null,
                content: message.LatestMessage?.content ?? null,
                time: new Date().toISOString(), // 或 null
                room_name: message.roomData.roomName,
                room_id: message.roomData.id,
              };
              return (
                <MessageBox
                  userId={user ? user.id : 0}
                  key={index}
                  title={message.roomData.roomName}
                  content={
                    message.LatestMessage
                      ? message.LatestMessage.content
                      : '還沒有訊息'
                  }
                  image={'/place-default_avatar.jpg'}
                  time={null}
                  // time={message.time}
                  onClick={() => existChat(openChats, newChat)}
                />
              );
            }
          )}
          {/* 2.個人 */}
          {contact.allFriendLatestMessage.map(
            (message: PersonMessage, index: number) => {
              const newChat = {
                user_name: message.friendData.nickname,
                user_id: message.friendData.id,
                image: message.friendData.avatar,
                content: message.LatestMessage?.content ?? null,
                time: new Date().toISOString(), // 或 null
                room_name: null,
                room_id: null,
              };
              return (
                <MessageBox
                  key={index}
                  userId={user ? user.id : 0}
                  receiverId={message.LatestMessage?.receiverId}
                  senderId={message.LatestMessage?.senderId}
                  isRead={message.LatestMessage?.isRead}
                  title={message.friendData.nickname}
                  content={
                    message.LatestMessage
                      ? message.LatestMessage.content
                      : '還沒有訊息'
                  }
                  image={
                    message.friendData.avatar
                      ? message.friendData.avatar
                      : '/avatar_default.png'
                  }
                  time={null}
                  onClick={() => existChat(openChats, newChat)}
                />
              );
            }
          )}
        </div>
      </div>
    </>
  );
}
