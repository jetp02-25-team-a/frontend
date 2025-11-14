'use client';
import Image from 'next/image';
import { formatTime12Hour } from '@/app/grabgroup/utils';

interface MessageBoxProps {
  title: string | null;
  image: string | null;
  content: string | null;
  time: string | null;
  isRead?: boolean;
  onClick: () => void;
  userId: number;
  receiverId?: number;
  senderId?: number;
}
export default function MessageBox({
  title,
  image,
  content,
  time,
  isRead,
  onClick,
  userId,
  receiverId,
  senderId,
}: MessageBoxProps) {
  return (
    <div
      onClick={onClick}
      className="w-full h-20 flex border-b-2 border-gray-600 bg-white px-2.5 py-2 gap-2"
    >
      {/* 綠色球 如果沒有為假就是沒有讀 翻轉做判斷*/}
      {/* 發送者如果不是我 就會顯示綠球 */}
      {senderId !== userId && !isRead && (
        <div className="shrink-0 w-2.5 h-2.5 bg-[#61FF8B] rounded-full"></div>
      )}

      {image ? (
        <Image
          width={64}
          height={64}
          src={image}
          alt=""
          className="rounded-full"
        />
      ) : (
        <></>
      )}

      <div className="m-auto w-full">
        <p className="text-lg">{title}</p>
        <p className="text-base text-gray-400">{content}</p>
      </div>
      <div>{time ? formatTime12Hour(time) : ''}</div>
    </div>
  );
}
