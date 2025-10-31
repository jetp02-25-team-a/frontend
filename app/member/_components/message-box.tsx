'use client';
import Image from 'next/image';
import { formatTime12Hour } from '@/app/grabgroup/utils';

interface MessageBoxProps {
  title: string;
  image: string;
  content?: string;
  time: string;
}
export default function MessageBox({
  title,
  image,
  content,
  time,
}: MessageBoxProps) {
  return (
    <div className="w-full h-20 flex border-b-2 border-gray-600 bg-white px-2.5 py-2 gap-2">
      <div className="shrink-0 w-2.5 h-2.5 bg-[#61FF8B] rounded-full"></div>
      <Image
        width={64}
        height={64}
        src={image}
        alt=""
        className="rounded-full"
      />
      <div className="m-auto w-full">
        <p className="text-lg">{title}</p>
        <p className="text-base text-gray-400">{content}</p>
      </div>
      <div>{formatTime12Hour(time)}</div>
    </div>
  );
}
