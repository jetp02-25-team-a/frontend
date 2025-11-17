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
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, login, logout, getAuthHeader, isReady } = useAuth();
  const [showNewMessage, setShowNewMessage] = useState(false); //設定新訊息的顯示與否
  const router = useRouter();
  //所有的加入好友訊息
  // 型別：若尚未取得為 null，取得後為陣列
  const [allFriendRequests, setAllFriendRequests] = useState<any[] | null>(
    null
  );
  const url = `${API_SERVER}/friendships/requests`;
  const { data, loading, refetch } = useFetch(url);
  //開始後就抓取

  // 修正：每次 data 變動都更新 allFriendRequests
  useEffect(() => {
    if (data && data.success) {
      setAllFriendRequests(Array.isArray(data.data) ? data.data : []);
    }
  }, [data]);

  // 修正：每次 user 變動時都 refetch（確保登入後能即時取得通知）
  useEffect(() => {
    if (user?.id) refetch();
  }, [user]);

  const pathname = usePathname();
  if (pathname.includes('/grabgroup/panel')) return;

  // 判斷是否在該路徑或其子路徑
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // 高亮樣式（和首頁一樣的白色字，如果還有其它效果可加在這裡）
  const linkCls = (href: string) =>
    `px-[15px] ${isActive(href) ? 'text-white' : ''}`;
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
            <Link href="/place" className={linkCls('/place')}>
              美食景點
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/accommodations"
              className={`px-[15px] ${
                pathname.startsWith('/accommodations') ? 'text-white' : ''
              }`}
            >
              住宿交通
            </Link>
            <div className="bg-white w-[2px] h-7"></div>
            <Link
              href="/article"
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
              <div className="relative cursor-pointer">
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-white text-2xl"
                  onClick={() => {
                    setShowNewMessage(!showNewMessage);
                  }}
                />
                {allFriendRequests && allFriendRequests?.length > 0 && (
                  <div
                    className="bg-red-400 w-3 h-3 rounded-full absolute top-0.5 right-0"
                    data-redball
                  ></div>
                )}

                {/* 通知下拉選單 */}
                {allFriendRequests &&
                  allFriendRequests?.length > 0 &&
                  showNewMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-lg z-50 p-4  border border-gray-200 scrollbar-hide"
                    >
                      <h3 className="text-[20px] font-semibold mb-2">通知</h3>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-xs text-gray-500 mr-3 ">新通知</h5>
                        <div className="h-px bg-gray-700 flex-1"></div>
                      </div>

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
                    </motion.div>
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
