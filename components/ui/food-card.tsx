'use client';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
interface FoodCardProps {
  imageUrl: string;
  title: string;
  avatarUrl: string;
  address: string;
}
export default function FoodCard({
  imageUrl,
  title,
  avatarUrl,
  address,
}: FoodCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 w-[300px] flex flex-col items-center border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
      {/* 美食照片 */}
      <div className="w-full h-full relative overflow-hidden rounded-2xl ">
        <Image fill src={imageUrl} alt={title} />
      </div>

      {/* 使用者資訊 */}
      <div className="flex">
        {/* avatar */}
        <div className="border-2 border-white rounded-full relative w-20 h-20 overflow-hidden -mt-20 flex-end">
          <Image fill src={avatarUrl} alt="Avatar" />
        </div>
      </div>
      <div className="flex">
        <FontAwesomeIcon icon={faLocationDot} className="text-[#FF4646]" />
        <p className="mt-4 text-center">{address}</p>
      </div>
      <p>{title}</p>
    </div>
  );
}
