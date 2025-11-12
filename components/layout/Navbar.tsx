'use client';
import Button from '../ui/button';
import Avatar from '../ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../hooks/use-Auth';
import ReceiveMessageBox from '../ui/receive-message-box';
import { useEffect, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { API_SERVER } from '../../config/api-path';
import { AVATAR_PATH } from '../../app/config/image-path';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, login, logout, getAuthHeader, isReady } = useAuth();
  const router = useRouter();
  //所有的加入好友訊息
  // 型別：若尚未取得為 null，取得後為陣列
  const [allFriendRequests, setAllFriendRequests] = useState<any[] | null>(
    null
  );
  const url = `${API_SERVER}/friendships/requests`;
  const { data, loading, refetch } = useFetch(url);
  //開始後就抓取
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data && data.success) {
      // 假設 API 回傳 data.data 為陣列
      setAllFriendRequests(Array.isArray(data.data) ? data.data : []);
      console.log('allFriendRequests', allFriendRequests);
    }
  }, [data]);

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
              href="/accommodations"
              className={`px-[15px] ${pathname === '/accommodations' ? 'text-white' : ''}`}
            >
              住宿交通
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/articles"
              className={`px-[15px] ${pathname === '/articles' ? 'text-white' : ''}`}
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

          {user?.email ? (
            <>
              <p className="text-white">{user?.nickname} 歡迎回來</p>
              <div className="relative cursor-pointer group">
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-white text-2xl"
                />
                {allFriendRequests && allFriendRequests?.length > 0 && (
                  <div
                    className="bg-red-400 w-3 h-3 rounded-full absolute top-0.5 right-0"
                    data-redball
                  ></div>
                )}

                {/* 通知下拉選單 */}
                {allFriendRequests && allFriendRequests?.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-lg z-50 p-4 hidden group-hover:block border border-gray-200 scrollbar-hide">
                    <h3 className="text-[20px] font-semibold mb-2">通知</h3>
                    <h5 className="text-xs text-gray-500 mb-3">新通知</h5>
                    <div className="space-y-2">
                      {allFriendRequests?.map((m: any, i: number) => (
                        <ReceiveMessageBox
                          key={i}
                          userId={m.User.id}
                          avatar={`${AVATAR_PATH}${m.User.avatar}`}
                          senderName={m.User.nickname}
                          content="想您成為好友"
                          onReply={() => refetch()}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Button></Button>
          )}
          <Avatar></Avatar>
          <div className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-[#FFD069] to-[#FF9292]"></div>
        </div>
      </nav>
    </>
  );
}
