'use client';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
interface FoodCardProps {
  imageUrl: string;
  title: string;
  avatarUrl: string;
  address: string;
  className?: string;
}
export default function FoodCard({
  imageUrl,
  title,
  avatarUrl,
  address,
  className,
}: FoodCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 w-[300px] h-[286px] flex flex-col  items-start gap-1.5 border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.2)] ${className ? className : ''}`}
    >
      {/* 美食照片 */}
      <div className="w-[267px] h-[250px] relative overflow-hidden rounded-2xl ">
        <Image
          fill
          sizes="100%"
          src={imageUrl}
          alt={title}
          className="object-cover"
        />
      </div>

      {/* 使用者資訊 */}
      <div className="flex w-full h-auto justify-end ">
        {/* avatar */}
        <div className="border-2 border-white rounded-full relative w-20 h-20 overflow-hidden -mt-10 flex-end">
          <Image fill src={avatarUrl} alt="Avatar" className="object-cover" />
        </div>
      </div>
      {/* 地標名稱 */}
      <div className="flex w-full h-auto items-center gap-2 -mt-7">
        <FontAwesomeIcon icon={faLocationDot} className="text-[#FF4646]" />
        <p className=" text-[13px] text-gray-500">{address}</p>
      </div>
      <p className="text-[16px]">{title}</p>
    </div>
  );
}
