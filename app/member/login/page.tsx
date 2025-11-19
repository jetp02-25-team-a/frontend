'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/use-Auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Page() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const { login, isReady, user } = useAuth();
  const router = useRouter();

  //表單通用輸入處理
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(data.email, data.password);
  };

  useEffect(() => {
    // 只有當 isReady 為 true (表示驗證或登入流程完成) 且 user.id 存在時，才代表成功登入
    if (isReady && user?.id) {
      toast.success('成功登入');
      const timer = setInterval(() => {
        router.push('/member/user-info');
      }, 1000);

      // 清理函式 (Cleanup function)，防止在元件卸載或依賴項變化時意外觸發
      return () => clearInterval(timer);
    }
  }, [isReady, user?.id, router]);

  return (
    <>
      {/* 外層保持置中 */}
      <div className="w-screen h-[calc(100vh-354px-88px)] flex items-center justify-center bg-[#FBE7C1] ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center p-8 bg-white/50 rounded-lg shadow-lg"
        >
          <div className="mb-8">
            <h1 className="font-bold text-3xl">登入</h1>
          </div>

          {/* 電子郵件區塊：使用 label 和 input 組合 */}
          <label htmlFor="email" className="self-start mt-2 mb-1">
            電子郵件
          </label>
          <input
            id="email"
            className="bg-white rounded-xl p-2 w-80 border border-gray-300"
            type="text"
            name="email"
            value={data.email}
            onChange={handleFieldChange}
          />

          {/* 密碼區塊 */}
          <label htmlFor="password" className="self-start mt-4 mb-1">
            密碼
          </label>
          <input
            id="password"
            className="bg-white rounded-xl p-2 w-80 border border-gray-300" // 🔑 統一寬度 w-80
            type="password"
            name="password"
            value={data.password}
            onChange={handleFieldChange}
          />

          {/* 登入按鈕區塊 */}
          <div className="m-6">
            <button className="bg-amber-100 px-10 py-2 rounded-xl font-semibold hover:bg-amber-200 transition">
              登入
            </button>
          </div>

          {/* 註冊連結區塊*/}
          <div className="mt-2">
            <p>
              還沒有帳號嗎?
              <Link
                href={`/member/sign-up`}
                className="text-blue-500 ml-2 hover:underline"
              >
                註冊
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
