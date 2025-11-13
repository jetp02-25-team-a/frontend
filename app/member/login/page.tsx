'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/use-Auth';
import Link from 'next/link';
import SimpleModal from '../_components/modal';

export default function Page() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const { login, isReady } = useAuth();

  //表單通用輸入處理
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(data.email, data.password);
  };

  return (
    <>
      <div className="w-screen h-full flex items-center justify-center bg-[#FBE7C1] ">
        <form onSubmit={handleSubmit}>
          <div className=" w-full justify-center flex mt-3">
            <h1>登入</h1>
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
            type="text"
            name="password"
            value={data.password}
            onChange={handleFieldChange}
          />

          <div className=" w-full justify-center flex m-3">
            <button
              onClick={() => {
                login(data.email, data.password);
              }}
              className="bg-amber-100 px-10 py-0.5 rounded-xl"
            >
              登入
            </button>
          </div>
          <div className=" w-full justify-center flex m-3">
            <p>
              還沒有帳號嗎?
              <Link href={`/member/sign-up`} className="text-blue-500">
                註冊
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
