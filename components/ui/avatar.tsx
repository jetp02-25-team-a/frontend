// import Image from 'next/image';

import Link from 'next/link';
import { useAuth } from '../../hooks/use-Auth';
import { IMAGE_PATH, AVATAR_PATH } from '../../app/config/image-path';
export default function Avatar() {
  const { user } = useAuth();
  const userInfoUrl = 'http://localhost:3000/member';
  const loginUrl = './member/login';
  return (
    <Link href={user?.email ? userInfoUrl : loginUrl}>
      <img
        src={
          user?.avatar ? `${AVATAR_PATH}/${user.avatar}` : '/avatar_default.png'
        }
        alt="用戶頭像"
        className=" rounded-full border-white border-2"
        width={36}
        height={36}
        // priority
      ></img>
    </Link>
  );
}
