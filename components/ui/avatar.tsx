// import Image from 'next/image';

import Link from 'next/link';
import { useAuth } from '../../hooks/use-Auth';
export default function Avatar() {
  const { user } = useAuth();
  const userInfoUrl = './member/user-info';
  const loginUrl = './member/login';
  return (
    <Link href={user?.email ? userInfoUrl : loginUrl}>
      <img
        src="/avatar_default.png"
        alt="用戶頭像"
        className=" rounded-full border-white border-2"
        width={36}
        height={36}
        // priority
      ></img>
    </Link>
  );
}
