'use client';
import MessageBox from '../_components/message-box';
import FriendCard from '../_components/friend-card';
import ChatBox from '../_components/chat-box';
import { useState, useEffect } from 'react';

//引入hooks(自定義)
import { useFetch } from '@/hooks/useFetch';
import { useAuth } from '../../../hooks/use-Auth';

const friend_data = [
  { id: 1, user_name: '王小美', avatar: 'image.png', address: '台北' },
  { id: 2, user_name: '大衝名', avatar: 'image.png', address: '新北產業園區' },
];

//使用者好友 團體 假資料
const datax = [
  {
    id: 1,
    user_name: null,
    image: 'image.png',
    content: 'xxxxxx',
    time: '20:00:00',
    room_name: '台北一日遊',
    room_id: 6,
  },
  {
    id: 2,
    user_name: null,
    image: 'image.png',
    content: 'aaaaaa',
    time: '21:00:00',
    room_name: '台北一日遊',
    room_id: 2,
  },
  {
    id: 3,
    user_name: 'BBBBB',
    image: 'image.png',
    content: 'aaaaaa',
    time: '21:00:00',
    room_name: null,
    room_id: null,
  },
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
  LatestMessage: string;
  roomData: RoomData;
}
interface friendData {
  avatar: string | null;
  id: number;
  nickname: string;
}

interface PersonMessage {
  LatestMessage: string;
  friendData: friendData;
}

// interface contactFetchData {
//   data: Data;
//   loading: boolean;
//   error: Error;
//   refetch: () => Promise<void>;
// }

export default function UserInfoPage() {
  const [openChats, setOpenChats] = useState<ChatInterface[]>([]); //所有聊天室資訊 小視窗
  const [contact, setContact] = useState<any>({
    allRoomsLatestMessages: [],
    allFriendLatestMessage: [],
  }); //通訊錄所有使用者
  const { user, isReady } = useAuth(); //使用者資訊
  //搜索有好有房間最新訊息
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/friendships/allmessage`;
  //取得後放入state
  const { data, loading, error } = useFetch(url);

  //打印出來
  useEffect(() => {
    if (data) {
      setContact(data.data);
      console.log('📦 contact data:', data.data); // ✅ 打印在 console
    }
  }, [data]);
  useEffect(() => {
    console.log(contact);
  }, [contact]);

  //關閉聊天室
  const closeChat = (index: number) => {
    const nextChats = openChats.filter((room) => room !== openChats[index]);
    setOpenChats(nextChats);
  };

  return (
    <>
      <div className="grid grid-cols-[80%_20%]">
        <div className="bg-light-orange relative">
          userInfo{openChats.length}
          <div className="absolute right-0 bottom-0 flex gap-2.5 items-end">
            {openChats.map((chatroom, index) => {
              return (
                <ChatBox
                  key={index}
                  roomId={chatroom.room_id}
                  userId={chatroom.user_id}
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
                content: message.LatestMessage ?? null,
                time: new Date().toISOString(), // 或 null
                room_name: message.roomData.roomName,
                room_id: message.roomData.id,
              };
              return (
                <MessageBox
                  key={index}
                  title={message.roomData.roomName}
                  content={
                    message.LatestMessage ? message.LatestMessage : '還沒有訊息'
                  }
                  image={null}
                  time={null}
                  // time={message.time}
                  onClick={() => {
                    const exists = openChats.find(
                      (room) => room.room_id === newChat.room_id
                    );
                    if (exists) return;
                    else setOpenChats((prev) => [...prev, newChat]);
                  }}
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
                content: message.LatestMessage ?? null,
                time: new Date().toISOString(), // 或 null
                room_name: null,
                room_id: null,
              };
              return (
                <MessageBox
                  key={index}
                  title={message.friendData.nickname}
                  content={
                    message.LatestMessage ? message.LatestMessage : '還沒有訊息'
                  }
                  image={message.friendData.avatar}
                  time={null}
                  onClick={() => {
                    const exists = openChats.find(
                      (room) => room.room_id === newChat.room_id
                    );
                    if (exists) return;
                    else setOpenChats((prev) => [...prev, newChat]);
                  }}
                />
              );
            }
          )}

          {/* {datax.map((message, index) => {
            const newChat = {
              user_name: message.user_name,
              user_id: message.id,
              image: message.image,
              content: message.content,
              time: message.time,
              room_name: message.room_name,
              room_id: message.room_id,
            };
            return (
              <MessageBox
                key={index}
                title={message.user_name}
                image={`/${message.image}`}
                content={message.content}
                time={message.time}
                onClick={() => {
                  const exists = openChats.find(
                    (room) => room.room_id === newChat.room_id
                  );
                  if (exists) return;
                  else setOpenChats((prev) => [...prev, newChat]);
                }}
              />
            );
          })} */}
        </div>
      </div>
    </>
  );
}
