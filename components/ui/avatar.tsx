// import Image from 'next/image';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../hooks/use-Auth';
import { IMAGE_PATH, AVATAR_PATH } from '../../app/config/image-path';
import Image from 'next/image';
export default function Avatar() {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative w-15 h-15"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={
          user?.avatar ? `${AVATAR_PATH}/${user.avatar}` : '/avatar_default.png'
        }
        alt="用戶頭像"
        className=" rounded-full border-white border-2"
        fill
        sizes="100%"
        // priority
      ></Image>
      <div
        className={`absolute w-fit bg-white left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap p-3 px-6 rounded-2xl  mt-15 ${isHovered ? '' : 'hidden'}`}
      >
        <div>
          <Link href={'/member/user-info'}>個人資料</Link>
        </div>
        <div>
          <button onClick={logout} className="hover:cursor-pointer mt-2">
            登出
          </button>
        </div>
      </div>
    </div>
  );
}
