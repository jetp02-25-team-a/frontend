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
// import { io } from 'socket.io-client';
import { useSocket } from '@/hooks/use-Socket';
import { useAuth } from '../../../hooks/use-Auth';
import { useFetch } from '../../../hooks/useFetch';

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
  const [allMessage, setAllMessage] = useState<any[]>([]); //歷史所有訊息
  const [message, setMessage] = useState<string>(''); //發送的訊息textarea內容
  // const [socket, setSocket] = useState<any>(null);

  // const textAreaRef = useRef<HTMLTextAreaElement>(null); //dom
  const messagesRef = useRef<HTMLDivElement>(null); //dom訊息卷軸
  const { user, login, logout, getAuthHeader, isReady } = useAuth();

  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    console.log('chat 連線 id=>', socket.id);
    if (roomId) {
      //發送房間號碼
      socket.emit('joinRoomId', roomId);
    }
    if (userId) {
      //發送對方id
      socket.emit('friendID', userId);
    }
    return () => {
      socket.off('public');
    };
  }, [socket, roomId, userId]);

  //開啟時讀取所有歷史訊息
  const roomUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/chat/allmessage?roomId=${roomId}`;
  const receiverUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/chat/allmessage?receiverId=${userId}`;
  const { data, refetch } = useFetch(roomId ? roomUrl : receiverUrl);

  useEffect(() => {
    if (data?.data) setAllMessage(data.data);
  }, [data]);

  //訊息有變動會把訊息會顯示在底部
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [allMessage]);

  //1.確保訊息有清空 2渲染畫面
  useEffect(() => {
    refetch();
  }, [message]);

  //發送訊息
  const sendMessage = (msg: string) => {
    if (!socket || msg.length < 1) return; //輸入為空
    // setMessage(''); //清空輸入欄位state
    // console.log('現在的message', message);
    socket.emit(
      'chat',
      roomId
        ? { providerId: user?.id, roomId: roomId, content: msg } // 發送給後端 判斷是room還是單人
        : { providerId: user?.id, acceptId: userId, content: msg },
      (response: { success: boolean; message?: string }) => {
        // 伺服器確認已收到
        if (response.success) {
          console.log('訊息已成功送出');
          setMessage(''); //清空輸入欄位state
        } else {
          console.error('訊息送出失敗：', response.message);
        }
      }
    );
    // setMessage(''); //清空輸入欄位state
    // if (textAreaRef.current) textAreaRef.current.value = ''; //清空輸入欄位
    // setTimeout(() => refetch(), 200);//延遲發送
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
          {roomId && (
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
          )}

          {/* 訊息內容 */}
          <div
            className=" bg-gray-300 py-5 px-[15px] flex flex-col min-h-10  max-h-80 overflow-y-auto"
            ref={messagesRef}
          >
            {/* 訊息 */}

            {Array.isArray(allMessage) &&
              allMessage.map((message, index) => {
                return (
                  <Chat
                    key={index}
                    content={message.content}
                    direction={message.senderId === user?.id ? 'right' : 'left'}
                    avatar="/image.png"
                    updatedAt={message.updatedAt}
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
              // ref={textAreaRef}
              value={message}
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
