'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../../hooks/use-Auth';
import LoginModal from './LoginModal';

interface BookingLauncherProps {
  // 只需要住宿 ID 來構建目標 URL
  accommodationId: number;
}

/**
 * BookingLauncher 是一個極簡的導航按鈕元件。
 * 點擊後會導航到該住宿點的通用預訂頁面。
 */
export default function BookingLauncher({
  accommodationId,
}: BookingLauncherProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const MODAL_MESSAGE = '您需要登入才能繼續預訂流程。';

  const handleLogin = () => {
    setShowLoginModal(false);

    // 導航到登入頁面，並附帶 redirect 參數
    const redirectUrl = encodeURIComponent(window.location.pathname);
    router.push(`/member/login?redirect=${redirectUrl}`);
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    router.push(`/accommodations/${accommodationId}/booking`);
  };

  return (
    <>
      <div className="p-4 rounded-xl bg-white shadow-xl border border-gray-100">
        <button
          type="button"
          onClick={handleBookingClick}
          // 按鈕永遠啟用，因為跳轉不需要任何前置條件
          className={`w-full text-white font-semibold py-3 rounded-lg transition-colors shadow-md 
                bg-brand hover:bg-brand-dark cursor-pointer 
            `}
        >
          立即預訂 (Order Now)
        </button>
      </div>
      {showLoginModal && (
        // 背景覆蓋層 (點擊背景時關閉)
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLoginModal(false)}
        >
          {/* 模態框內容 */}
          <div
            className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 阻止點擊內容時關閉 Modal
          >
            <h2 className="text-xl font-bold mb-4">請先登入</h2>

            {/* 提示訊息 */}
            <p className="mb-6">{MODAL_MESSAGE}</p>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowLoginModal(false)} // 取消按鈕
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleLogin} // 登入按鈕 (觸發導航)
              >
                登入
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
