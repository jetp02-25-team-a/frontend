// app/_components/ProtectedRoute.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-Auth'; // 🚨 使用您提供的 useAuth 導出
// 假設您定義了登入路徑常量
const LOGIN_PATH = '/member/login';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 路由守衛組件：檢查用戶是否登入。
 * 必須等待 AuthProvider 完成初始化檢查 (isReady = true) 後才執行重定向。
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 1. 取得認證狀態
  // user: 登入用戶資訊 (或 initUser {id: 0, ...})
  // isReady: AuthProvider 是否已完成 localStorage 和 Token 驗證
  // isAuthenticated: 判斷是否為有效登入狀態
  const { user, isReady, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 2. 只有在 Auth Context 完成初始化檢查
    //    並且用戶未被認證時，才執行重定向。
    if (isReady && !isAuthenticated) {
      console.log('用戶未登入，正在重定向到登入頁...');

      // 獲取當前 URL 並進行編碼，作為登入後的回調路徑
      const currentPath = window.location.pathname;
      const callbackUrl = encodeURIComponent(currentPath);

      // 使用 replace 替換當前歷史記錄，防止用戶按返回鍵回到受保護頁面
      router.replace(`${LOGIN_PATH}?callbackUrl=${callbackUrl}`);
    }
  }, [isAuthenticated, isReady, router]); // 依賴於狀態和 router

  // 3. 渲染邏輯

  // 檢查中：在 isReady 變為 true 之前，顯示載入狀態以避免內容閃爍。
  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-600">驗證身份中...</p>
      </div>
    );
  }

  // 認證通過：渲染受保護的內容 (children)
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 認證失敗且檢查完成：此處的內容實際上會被 useEffect 中的 router.replace() 跳過
  // 但返回 null 是安全的。
  return null;
}
