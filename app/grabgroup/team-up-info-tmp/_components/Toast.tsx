// components/Toast.tsx
'use client';
import { useEffect, useRef, useState } from 'react';

export default function Toast({
  message,
  type = 'success',
  duration = 2000,
  onClose,
}: {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    const cleanup = setTimeout(onClose, duration + 300); // 給淡出動畫時間
    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [duration, onClose]);

  const color =
    type === 'success'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-red-50 text-red-700 border-red-200';
  const bar = type === 'success' ? 'bg-emerald-400' : 'bg-red-400';

  return (
    <div
      className={`fixed top-6 left-1/2 z-[60] -translate-x-1/2 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative flex items-center gap-2 rounded-xl border px-4 py-2 shadow ${color}`}
      >
        <span>{type === 'success' ? '✅' : '⚠️'}</span>
        <span className="text-sm font-medium">{message}</span>
        <button className="ml-2 opacity-60 hover:opacity-100" onClick={onClose}>
          ×
        </button>

        {/* 🔻 進度條動畫區 */}
        <div className="absolute -bottom-1 left-0 h-1 w-full bg-black/5 overflow-hidden rounded-b-xl">
          <div
            className={`${bar} h-full`}
            style={{
              transform: 'scaleX(1)',
              animation: `progressShrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* 🔹 進度條動畫 keyframes */}
      <style jsx>{`
        @keyframes progressShrink {
          from {
            transform: scaleX(1);
            transform-origin: right; /* 從左開始縮 */
          }
          to {
            transform: scaleX(0);
            transform-origin: right;
          }
        }
      `}</style>
    </div>
  );
}
