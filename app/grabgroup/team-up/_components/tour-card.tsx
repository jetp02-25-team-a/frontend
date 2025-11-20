'use client';
import Image from 'next/image';

interface TourCardProps {
  title: string;
  description: string;
  avatar: string;
  user_name: string;
  image: string;
  onClick: () => void;
}

export default function TourCard({
  title,
  description,
  avatar,
  user_name,
  image,
  onClick,
}: TourCardProps) {
  return (
    <>
      <div
        className="w-[303px] rounded-2xl customize_shadow bg-white overflow-hidden group"
        onClick={onClick}
      >
        <div className="w-full h-[259px] overflow-hidden relative">
          <Image
            fill
            src={image}
            alt=""
            className="w-full h-full bg-center bg-cover transition-all  duration-700 ease-in-out group-hover:scale-110  object-cover"
          />
          {/* <img
            src={image}
            className="w-full h-full bg-center bg-cover transition-all  duration-700 ease-in-out group-hover:scale-110"
          ></img> */}
        </div>
        <div className="w-full flex flex-col p-3 gap-2.5 mt-[-25px]">
          <div className="flex justify-start items-end gap-2.5">
            <div className="w-[73px] h-[73px] rounded-full border-2 border-white  z-50 overflow-hidden relative">
              <Image
                fill
                src={avatar}
                alt=""
                className="object-cover bg-center  "
              />
            </div>

            <div>
              <p className="text-base">{user_name}</p>
              <p className="text-2xl">{`${title?.length > 7 ? title.slice(0, 7) + '..' : title}`}</p>
            </div>
          </div>
          <p className="text-sm">{description?.slice(0, 100)}</p>
        </div>
      </div>
    </>
  );
}
