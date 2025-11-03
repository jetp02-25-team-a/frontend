'use client';
import Image from 'next/image';
import moment from 'moment';

interface ChatProps {
  content: string;
  direction: 'left' | 'right';
  avatar: string;
  updatedAt: string;
}
export default function Chat({
  content,
  direction,
  avatar,
  updatedAt,
}: ChatProps) {
  return (
    <div
      className={`flex items-center ${direction === 'left' ? 'justify-start' : 'justify-end'} gap-2 my-2`}
    >
      {direction === 'left' && (
        <Image
          width={46}
          height={46}
          src={avatar}
          alt=""
          className="w-[46px] h-[46px] rounded-full"
        />
      )}
      {direction === 'right' && (
        <p className="text-gray-500 text-sm">
          {' '}
          {moment(updatedAt).format('hh:mm A')}
        </p>
      )}

      <div
        className={`relative max-w-[70%] ${direction === 'left' ? 'bg-gray-100' : 'bg-[#ebfdd1]'}  text-black px-4 py-2 rounded-xl`}
      >
        {content}
      </div>
      {direction === 'left' && (
        <p className="text-gray-500 text-sm">
          {' '}
          {moment(updatedAt).format('hh:mm A')}
        </p>
      )}
    </div>
  );
}
