'use client';
import Button from '../ui/button';
import Avatar from '../ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.includes('/grabgroup/panel')) return;
  return (
    <>
      <nav className="relative yellow-orange w-full h-[88px] flex justify-between items-center px-[80px] p-[13px]">
        <Link href="/">
          <img src="/logo.png" alt="logo" className="object-contain h-full" />
        </Link>

        <div className="flex gap-8 items-center">
          <div className="flex gap-[10px] items-center">
            <Link
              href="/trip"
              className={`px-[15px] ${pathname === '/trip' ? 'text-white' : ''}`}
            >
              行程規劃
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/place"
              className={`px-[15px] ${pathname === '/place' ? 'text-white' : ''}`}
            >
              美食景點
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/accommodation"
              className={`px-[15px] ${pathname === '/accommodation' ? 'text-white' : ''}`}
            >
              住宿交通
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/m1"
              className={`px-[15px] ${pathname === '/m1' ? 'text-white' : ''}`}
            >
              旅行筆記
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/grabgroup/team-up"
              className={`px-[15px] ${
                pathname.startsWith('/grabgroup') ? 'text-white' : ''
              }`}
            >
              尋找旅伴
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/shops"
              className={`px-[15px] ${pathname === '/shops' ? 'text-white' : ''}`}
            >
              商城
            </Link>
          </div>
          <Button></Button>
          <Avatar></Avatar>
          <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#FFD069] to-[#FF9292]"></div>
        </div>
      </nav>
    </>
  );
}
