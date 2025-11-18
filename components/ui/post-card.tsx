'use client';
import Image from 'next/image';
import { Roboto, Plus_Jakarta_Sans } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-roboto',
});

interface FoodCardProps {
  imageUrl: string;
  title: string;
  avatarUrl: string;

  username: string;
  time: string;
  content: string;
  className?: string;
  like: boolean;
  response: number;
  view: number;
}

export default function PostCard({
  imageUrl,
  title,
  username,
  avatarUrl,
  time,
  className,
  like,
  response,
  view,
  content,
}: FoodCardProps) {
  return (
    <div
      className={`bg-white w-[350px] flex flex-col  items-start gap-1.5 border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,0.2)] ${className ? className : ''}`}
    >
      <div className="w-full h-[316px] relative">
        <Image
          fill
          src={imageUrl}
          alt={title}
          sizes="100%"
          className="object-cover w-full"
        />
      </div>
      <div className="px-5 pt-[15px] pb-5 ">
        {/* 使用者 */}
        <div className="flex gap-3">
          <div className="rounded-full w-[50px] h-[50px] relative">
            <Image
              fill
              src={avatarUrl}
              alt={username}
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h2 className="text-black">{username}</h2>
            <p className="text-gray-500">{time}</p>
          </div>
        </div>
        {/* 內容 */}
        <div>
          <h2
            className={`${roboto.className} font-extrabold super-bold text-[15px] py-5`}
          >
            {title}
          </h2>
          <p>{content.slice(0, 40)}</p>
        </div>
        {/* icons區 */}
        <hr className="mt-5" />
        <div className="w-full flex justify-between items-center mt-5">
          <p>{view}觀看</p>
          <p>{response}回應</p>
          <div className="flex">
            <p>{like}</p>
            <FontAwesomeIcon icon={faHeart} className="text-rose-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
