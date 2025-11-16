'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/member/login');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleLogin();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">請先登入</h2>
        <p className="mb-6">登入後才能收藏住宿。</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleLogin}
          >
            登入
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
