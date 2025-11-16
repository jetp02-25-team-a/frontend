'use client';
import Image from 'next/image';

interface ChatImageProps {
  imageUrl: string;
  avatar: string;
  direction: 'right' | 'left';
  onPreview?: () => void;
}

export default function ChatImage({
  imageUrl,
  avatar,
  direction,
  onPreview,
}: ChatImageProps) {
  return (
    <div
      className={`flex gap-2 w-full ${direction === 'right' ? 'justify-end' : ''}`}
    >
      {/* 條件顯示頭像 */}
      {direction === 'left' && (
        <div className="w-[46px] h-[46px] overflow-hidden rounded-full relative">
          <Image fill src={avatar} alt="" className="object-cover" />
        </div>
      )}
      {/* 圖片顯示區塊 */}

      <div
        className={`${direction === 'left' ? 'bg-gray-100' : 'bg-[#ebfdd1]'} w-[150px] h-[150px] relative my-2 rounded-2xl overflow-hidden`}
        onClick={onPreview}
      >
        <Image
          src={imageUrl}
          fill
          alt="chat-image"
          sizes="100%"
          className="object-cover rounded"
        />
      </div>
    </div>
  );
}
