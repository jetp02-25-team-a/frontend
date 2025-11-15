'use client';

import { Toaster } from 'react-hot-toast';
import React from 'react';

/**
 * 專門用於在 Next.js Server Component 佈局中渲染 Toast 容器
 */
export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // children 用於傳遞被包裹的內容 (通常是子頁面)
  return (
    <>
      {children}
      {/* 僅渲染 Toaster 容器 */}
      <Toaster position="top-center" />
    </>
  );
}
