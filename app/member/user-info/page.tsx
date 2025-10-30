'use client';
import MessageBox from '../_components/message-box';
import FriendCard from '../_components/friend-card';
import ChatBox from '../_components/chat-box';
import { useState } from 'react';
const friend_data = [
  { id: 1, user_name: '王小美', avatar: 'image.png', address: '台北' },
  { id: 2, user_name: '大衝名', avatar: 'image.png', address: '新北產業園區' },
];

const data = [
  {
    id: 1,
    user_name: 'AAAAA',
    image: 'image.png',
    content: 'xxxxxx',
    time: '20:00:00',
  },
  {
    id: 2,
    user_name: 'BBBBB',
    image: 'image.png',
    content: 'aaaaaa',
    time: '21:00:00',
  },
];
export default function UserInfoPage() {
  const [openChats, setOpenChats] = useState<number[]>([1, 2]); //所有聊天室的id

  const closeChat = (id: number) => {
    const nextChats = openChats.filter((chatId) => chatId !== id);
    setOpenChats(nextChats);
  };

  return (
    <>
      <div className="grid grid-cols-[80%_20%]">
        <div className="bg-light-orange relative">
          userInfo
          <div className="absolute right-0 bottom-0 flex gap-2.5 items-end">
            {openChats.map((id) => {
              return <ChatBox key={id} id={id} onClose={() => closeChat(id)} />;
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
            return (
              <MessageBox
                key={index}
                title={message.user_name}
                image={`/${message.image}`}
                content={message.content}
                time={message.time}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
