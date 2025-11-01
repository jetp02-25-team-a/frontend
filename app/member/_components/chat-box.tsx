'use client';

import Chat from './chat';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperclip,
  faEllipsisVertical,
  faXmark,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const messages = {
  title: '台北一日遊',
  messages: [
    {
      id: 1,
      avatar: 'image.png',
      content: '?????',
    },
    {
      id: 2,
      avatar: 'image.png',
      content: '?????',
    },
  ],
};

interface ChatBoxProps {
  roomId: number | null; // 新增房間 ID
  roomTitle: string | null;
  userId: number | null;
  userNickname: string | null;

  onClose?: () => void;
}

export default function ChatBox({
  roomId,
  roomTitle,
  userId,
  userNickname,
  onClose,
}: ChatBoxProps) {
  const [isHide, setIsHide] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);
  //所有對話的訊息
  const [chatMessages, setChatMessages] = useState<{ content: string }[]>([]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}`;
    const socket = io(API_URL, { withCredentials: true });
    setSocket(socket); //把我創建的socket 放到react state 中 讓function 外面的可以使用

    //自動連線訊息
    socket.on('connect', () => {
      console.log('已連線:', socket.id);
    });

    //發送房間號碼
    socket.emit('joinRoom', roomId);

    // const content = '這是自己以外都可以看到的訊息';
    //發第一條訊息
    // socket.emit('chat', { roomId, content });

    //收到訊息時運作
    socket.on('chat', (msg) => {
      console.log('收到訊息:', msg);
      addMessage(msg.content);
    });

    // socket.on('chat', (msg) => {
    //   console.log(msg, msg.senderId, socket.id);
    //   // if (msg.senderId === socket.id) return; // 自己的訊息跳過
    //   // addMessage(msg.content, 'left'); // 別人訊息顯示左邊
    // });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = (msg: string) => {
    if (!socket || msg.length < 1) return;
    socket.emit('chat', { roomId, content: msg }); // 發送給後端
    setMessage(''); //清空輸入欄位state
    if (textAreaRef.current) textAreaRef.current.value = ''; //清空輸入欄位
  };
  //更新訊息至 react state 中的 chatMessages 讓畫面更新
  const addMessage = (msg: string) => {
    setChatMessages((prev) => [...prev, { content: msg }]);
  };

  return (
    <div
      className={`overflow-hidden transition-all duration-300 w-[384px] shadow-[0_4px_4px_rgba(0,0,0,0.8)]  ${
        isHide ? 'max-h-[1000px]' : 'max-h-12'
      }`}
    >
      <h2 className="text-[20px] px-[15px] py-2.5 flex  items-center justify-between bg-amber-300">
        {roomTitle ? roomTitle : ''}
        {userNickname ? userNickname : ''}

        <div className="space-x-2">
          <FontAwesomeIcon
            icon={faMinus}
            className="cursor-pointer hover:bg-amber-200 rounded-full p-1"
            onClick={() => setIsHide(!isHide)}
          />
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer hover:bg-amber-200 rounded-full p-1"
            onClick={onClose}
          />
        </div>
      </h2>
      {/*hidden 內容 */}
      {isHide && (
        <>
          {/* 所有參與者頭像 */}
          <div className="flex items-center justify-between bg-white py-3 px-2">
            <div className="flex gap-2.5">
              {messages.messages.map((message, index) => {
                return (
                  <Image
                    key={index}
                    width={46}
                    height={46}
                    src={`/${message.avatar}`}
                    alt=""
                    className=" rounded-full w-[46px] h-[46px] "
                  />
                );
              })}
            </div>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="cursor-pointer"
            />
          </div>

          {/* 訊息內容 */}
          <div
            className="h-auto bg-gray-300 py-5 px-[15px] flex flex-col"
            ref={messagesRef}
          >
            {chatMessages.map((message, index) => {
              return (
                <Chat
                  key={index}
                  content={message.content}
                  direction={message.direction}
                  avatar="/image.png"
                />
              );
            })}
          </div>
          {/* 輸入框 */}
          <div className="bg-gray-100 px-3 py-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faPaperclip} className="cursor-pointer" />
            <textarea
              placeholder="輸入訊息"
              className="border border-gray-400 rounded-xl px-2 py-[5px] w-full resize-none"
              rows={1}
              ref={textAreaRef}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage(message);
                }
              }}
            />
            <button
              className="py-2 w-26 rounded-2xl bg-gray-200 border border-gray-500  cursor-pointer "
              onClick={() => sendMessage(message)}
            >
              送出
            </button>
          </div>
        </>
      )}
    </div>
  );
}
