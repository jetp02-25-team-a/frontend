'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/use-Auth';

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
      <div className="w-screen h-full flex items-center justify-center bg-amber-50">
        <form onSubmit={handleSubmit}>
          <div className=" w-full justify-center flex">
            <h1>登入</h1>
          </div>
          <h2>電子郵件</h2>
          <input
            className="bg-white"
            type="text"
            name="email"
            value={data.email}
            onChange={handleFieldChange}
          />
          <h2>密碼</h2>
          <input
            className="bg-white"
            type="text"
            name="password"
            value={data.password}
            onChange={handleFieldChange}
          />

          <div>
            <button
              onClick={() => {
                login(data.email, data.password);
              }}
              className="bg-amber-100 px-10 py-0.5 rounded-xl"
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
