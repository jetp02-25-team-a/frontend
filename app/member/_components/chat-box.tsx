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
import { useState } from 'react';
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
  id: number;
  onClose: () => void;
}

export default function ChatBox({ id, onClose }: ChatBoxProps) {
  const [isHide, setIsHide] = useState(true);
  return (
    <div
      className={`overflow-hidden transition-all duration-300 w-[384px] shadow-[0_4px_4px_rgba(0,0,0,0.8)]  ${
        isHide ? 'max-h-[1000px]' : 'max-h-12'
      }`}
    >
      <h2 className="text-[20px] px-[15px] py-2.5 flex  items-center justify-between bg-amber-300">
        {messages.title}
        {id}
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
          <div className="h-auto bg-gray-300 py-5 px-[15px] flex flex-col">
            <Chat content={'xxx'} direction="left" avatar="/image.png" />
            <Chat content={'xxx'} direction="right" avatar="/image.png" />
          </div>
          {/* 輸入框 */}
          <div className="bg-gray-100 px-3 py-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faPaperclip} className="cursor-pointer" />
            <textarea
              placeholder="輸入訊息"
              className="border border-gray-400 rounded-xl px-2 py-[5px] w-full resize-none"
              rows={1}
            />
            <button className="py-2 w-26 rounded-2xl bg-gray-200 border border-gray-500  cursor-pointer ">
              送出
            </button>
          </div>
        </>
      )}
    </div>
  );
}
