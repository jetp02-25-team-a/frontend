'use client';
import Image from 'next/image';
interface ChatProps {
  content: string;
  direction: 'left' | 'right';
  avatar: string;
}
export default function Chat({ content, direction, avatar }: ChatProps) {
  return (
    <div
      className={`flex ${direction === 'left' ? 'justify-start' : 'justify-end'} gap-2 my-2`}
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

      <div
        className={`relative max-w-[70%] ${direction === 'left' ? 'bg-gray-100' : 'bg-[#ebfdd1]'}  text-black px-4 py-2 rounded-xl`}
      >
        {content}
        {/* {direction === 'left' ? (
          <span
            className="absolute left-1.5 top-3 w-0 h-0
      border-y-[6px] border-y-transparent
      border-r-[6px] border-l-[#ebfdd1]"
            data-left
          ></span>
        ) : (
          <span
            className="absolute left-1.5 top-3 w-0 h-0
      border-y-[6px] border-y-transparent
      border-l-[6px] border-l-blue-500"
            data-dight
          ></span>
        )} */}
      </div>
    </div>
  );
}
