'use client';

import Image from 'next/image';
import { IMAGE_PATH } from '../../../config/image-path';

interface PanelCardProps {
  image?: string;
  title: string;
  address?: string;
  onClick: () => void;
  description?: string;
  displayStatus: 'stay' | 'attraction' | '';
}

export default function PanelCard({
  image,
  title,
  address,
  onClick,
  description,
  displayStatus,
}: PanelCardProps) {
  return (
    <>
      <div
        className="w-full bg-white  h-auto flex gap-2.5 p-2.5 active:shadow-[0_0_15px_5px_rgba(250,250,250,0.7)] shadow-[0_4px_10px_rgba(0,0,0,0.4)] "
        onClick={onClick}
      >
        <div className="w-[100px] h-[100px] shrink-0 relative overflow-hidden">
          {image && displayStatus === 'attraction' ? (
            <Image
              fill
              src={image}
              alt=""
              className="object-cover"
              sizes="100px"
            />
          ) : (
            <div className="flex bg-gray-300 w-full h-full justify-center items-center ">
              <p className="text-gray-500 text-sm">沒有照片</p>
            </div>
          )}
          {image && displayStatus === 'stay' ? (
            <Image
              fill
              src={`${IMAGE_PATH}${image}`}
              alt=""
              className="object-cover"
              sizes="100px"
            />
          ) : (
            <div className="flex bg-gray-300 w-full h-full justify-center items-center ">
              <p className="text-gray-500 text-sm">沒有照片</p>
            </div>
          )}
        </div>

        <div className="w-full">
          <h2 className="text-xl">{title}</h2>
          <p>{address && address.length > 20 ? address + '...' : address}</p>
          {/* 有描述顯示描述 */}
          {description && description.length > 50 && (
            <p>{description.slice(0, 50) + '...'}</p>
          )}
        </div>
      </div>
    </>
  );
}
