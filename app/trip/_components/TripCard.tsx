'use client';

import { useRouter } from 'next/navigation';
import { TripCardProps } from '../types/props';

export default function TripCard({
  id,
  title,
  area,
  date,
  image,
}: TripCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/trip/${id}/planner`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-[303px] rounded-2xl customize_shadow bg-white overflow-hidden group cursor-pointer hover:shadow-lg transition"
    >
      <div className="w-full h-[259px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm customize_text_gray">{area}</p>
        <p className="text-sm customize_text_gray">{date}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="yellow-orange text-white px-3 py-2 rounded-lg text-sm hover:opacity-90 transition mt-2"
        >
          查看詳情
        </button>
      </div>
    </div>
  );
}
