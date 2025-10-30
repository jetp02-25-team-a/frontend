'use client';

import React, { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  //表單通用輸入處理
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/api-login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json', //  JSON 格式
        },
        body: JSON.stringify(data),
      });
      const jsonRes = await response.json();

      // 檢查響應是否成功，並嘗試從 JSON 中提取 token
      if (response.ok && jsonRes.data.token) {
        //使用 localStorage.setItem 儲存 JWT
        localStorage.setItem('userToken', jsonRes.data.token);
        console.log('JWT已經儲存到LocalStorage');
      } else {
        console.log('登入失敗');
      }
    } catch (e) {
      console.log(e);
    }
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
              type="submit"
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
