'use client';

import React, { useState, useEffect } from 'react';
import { API_SERVER } from '../../config/api-path';
import z from 'zod';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const SimpleModal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-50  z-50 w-full max-w-sm left-1/2 -translate-x-1/2">
      {/* Modal 內容區塊 */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-80">
        <p className="mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

const signupSchema = z
  .object({
    email: z.string().email({ message: '請輸入有效的電子郵件格式' }),
    password: z.string().min(6, '密碼至少需要 6 個字元'),
    passwordsec: z.string().min(6, '密碼至少需要 6 個字元'),
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const showModalWithMessage = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

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
      showModalWithMessage(firstError.message);
      return; // 阻止 API 呼叫
    }

    const validatedData = validationResult.data;
    try {
      const payload = {
        email: validatedData.email,
        password: validatedData.password,
      };

      const response = await fetch(`${API_SERVER}/signup`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showModalWithMessage('註冊成功，將返回登入頁');
        return;
      } else {
        showModalWithMessage('註冊失敗');
        return;
      }
    } catch {
      showModalWithMessage('註冊失敗');
      return '';
    }
  };
  return (
    <>
      <div className="w-screen h-full flex items-center justify-center bg-[#FBE7C1] ">
        <form onSubmit={handleSubmit}>
          <div className=" w-full justify-center flex mt-3">
            <h1>註冊</h1>
          </div>
          <h2 className=" mt-2">電子郵件</h2>
          <input
            className="bg-white mt-2 rounded-xl"
            type="text"
            name="email"
            value={data.email}
            onChange={handleFieldChange}
          />
          <h2 className=" mt-2">密碼</h2>
          <input
            className="bg-white mt-2 rounded-xl"
            type="password"
            name="password"
            value={data.password}
            onChange={handleFieldChange}
          />
          <h2 className=" mt-2">確認密碼</h2>
          <input
            className="bg-white mt-2 rounded-xl"
            type="password"
            name="passwordsec"
            value={data.passwordsec}
            onChange={handleFieldChange}
          />

          <div className=" w-full justify-center flex m-3">
            <button className="bg-amber-100 px-10 py-0.5 rounded-xl">
              註冊
            </button>
          </div>
        </form>
      </div>

      <SimpleModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={closeModal}
      />
    </>
  );
}
