'use client';
import MessageBox from '../_components/message-box';
import FriendCard from '../_components/friend-card';
import ChatBox from '../_components/chat-box';
import { useState } from 'react';

//引入hooks(自定義)
import { useFetch } from '@/hooks/useFetch';
const friend_data = [
  { id: 1, user_name: '王小美', avatar: 'image.png', address: '台北' },
  { id: 2, user_name: '大衝名', avatar: 'image.png', address: '新北產業園區' },
];

const data = [
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
  image: string;
  content: string | null;
  time: string;
  room_name: string | null;
  room_id: number | null;
}

export default function UserInfoPage() {
  const [openChats, setOpenChats] = useState<ChatInterface[]>([]); //所有聊天室資訊
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
          {data.map((message, index) => {
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
          })}
        </div>
      </div>
    </>
  );
}
