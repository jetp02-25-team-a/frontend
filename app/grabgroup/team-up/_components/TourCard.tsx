"use client";

interface TourCardProps {
  title: string;
  description: string;
  avatar: string;
  user_name: string;
  image: string;
}

export default function TourCard({
  title,
  description,
  avatar,
  user_name,
  image,
}: TourCardProps) {
  return (
    <>
      <div className="w-[303px] rounded-2xl customize_shadow bg-white overflow-hidden group">
        <div className="w-full h-[259px] object-cover overflow-hidden">
          <img
            src={image}
            className="w-full h-full bg-center bg-cover transition-all  duration-700 ease-in-out group-hover:scale-110"
          ></img>
        </div>
        <div className="w-full flex flex-col p-[12px] gap-[10px] mt-[-25px]">
          <div className="flex justify-start items-end gap-[10px]">
            <img
              src={avatar}
              className="rounded-full border-2 border-white w-[73px] h-[73px] z-50"
              alt=""
            />
            <div>
              <p className="text-base">{user_name}</p>
              <p className="text-2xl">{title}</p>
            </div>
          </div>
          <p className="text-sm">{description.slice(0, 100)}</p>
        </div>
      </div>
    </>
  );
}
