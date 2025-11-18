'use client';

import React, { useState } from 'react';
import { API_SERVER } from '../../config/api-path';
import z from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const signupSchema = z
  .object({
    email: z.string().email({ message: '請輸入有效的電子郵件格式' }),
    password: z.string().min(6, '密碼至少需要 6 個字元'),
    passwordsec: z.string().min(6, '密碼至少需要 6 個字元'),
    // 注意: 您的後端程式碼有處理 nickname，如果需要，請在這裡新增 nickname 欄位
  })
  .refine((data) => data.password === data.passwordsec, {
    message: '兩次密碼輸入不同',
    path: ['passwordsec'], // 將錯誤訊息指向確認密碼欄位
  });

export default function SignUpPage() {
  const [data, setData] = useState({
    email: '',
    password: '',
    passwordsec: '',
  });
  const router = useRouter();

  //表單通用輸入處理
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = signupSchema.safeParse(data);

    if (!validationResult.success) {
      // 驗證失敗：取得第一個錯誤訊息並顯示 Modal
      const firstError = validationResult.error.issues[0];
      toast.error(firstError.message);
      return; // 阻止 API 呼叫
    }

    const validatedData = validationResult.data;
    try {
      const payload = {
        email: validatedData.email,
        password: validatedData.password,
        // 如果後端需要 nickname，這裡應該補上，例如:
        // nickname: 'user-' + Math.random().toString(36).substring(2, 8),
      };

      const response = await fetch(`${API_SERVER}/signup`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resultData = await response.json();

      if (response.ok && resultData.id) {
        toast.success('註冊成功，將返回登入頁');

        // 💡 修正 1: 使用 setTimeout 導向
        setTimeout(() => {
          router.push('/member/login');
        }, 1000);

        return; // 成功註冊並設定導向後，立即返回
      }

      // 處理後端傳回的失敗訊息 (例如: 重複電子郵件)
      if (resultData && resultData.success === false && resultData.message) {
        toast.error(resultData.message); // 顯示後端傳回的錯誤訊息
        return;
      }

      // 處理其他未預期的錯誤或非 200 OK 的狀態碼
      toast.error('註冊失敗，請稍後再試。');
      return;
    } catch (error) {
      // 捕捉網路錯誤、JSON 解析錯誤等
      console.error('註冊過程中發生錯誤:', error);
      toast.error('網路連線或伺服器發生異常');
    }
  };

  return (
    <>
      <div className="w-screen h-[calc(100vh-354px-88px)] flex items-center justify-center bg-[#FBE7C1] ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center p-8 bg-white/50 rounded-lg shadow-lg"
        >
          {/* 標題區塊 */}
          <div className="mb-8">
            <h1 className="font-bold text-3xl">註冊</h1>
          </div>

          {/* 電子郵件區塊 */}
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
            className="bg-white rounded-xl p-2 w-80 border border-gray-300"
            type="password"
            name="password"
            value={data.password}
            onChange={handleFieldChange}
          />

          {/* 確認密碼區塊 */}
          <label htmlFor="passwordsec" className="self-start mt-4 mb-1">
            確認密碼
          </label>
          <input
            id="passwordsec"
            className="bg-white rounded-xl p-2 w-80 border border-gray-300"
            type="password"
            name="passwordsec"
            value={data.passwordsec}
            onChange={handleFieldChange}
          />

          {/* 註冊按鈕區塊 */}
          <div className="m-6">
            <button className="bg-amber-100 px-10 py-2 rounded-xl font-semibold hover:bg-amber-200 transition">
              註冊
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
