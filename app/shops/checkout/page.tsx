'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    ECPay?: {
      initialize: (
        env: string,
        isLoading: boolean,
        callback: (errMsg: string) => void
      ) => void;
      // ... 假設還有其他方法
    };
  }
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const handleECPayCallback = useCallback((errMsg: string) => {
    setIsLoading(false); // 停止讀取
    if (errMsg) {
      setErrorMessage(errMsg);
      console.error('綠界 SDK 初始化錯誤:', errMsg);
    } else {
      console.log('綠界 SDK 初始化成功！');
    }
  }, []);

  // 2. 使用 useEffect 確保 SDK 載入後才執行初始化
  useEffect(() => {
    // 檢查 window.ECPay 是否存在，確保 SDK 腳本已載入
    if (window.ECPay) {
      console.log('ECPay SDK 已載入，開始初始化...');

      // 呼叫初始化函式，傳入正確的參數
      window.ECPay.initialize(
        'Stage',
        isLoading, // 傳入當前的讀取狀態
        handleECPayCallback // 傳入回調函式的引用
      );
    } else {
      // 可以在這裡設定一個定時器或監聽器，等待腳本載入
      // 但 Next.js 的 <Script> 通常能保證 strategy 執行後腳本可用
      console.warn('ECPay SDK 尚未載入。');
    }
  }, [isLoading, handleECPayCallback]);
  return (
    <>
      <div id="ECPayPayment">
        {isLoading ? <p>正在載入支付元件...</p> : null}
        {errorMessage && <p style={{ color: 'red' }}>錯誤: {errorMessage}</p>}
        {/* 這裡通常是 SDK 渲染支付元件的地方 */}
      </div>
      <Script
        src="https://code.jquery.com/jquery-3.5.1.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://ecpg-stage.ecpay.com.tw/Scripts/sdk-1.0.0.js?t=20210121100116"
        strategy="afterInteractive"
      />
    </>
  );
}
