// components/spot/Reviews/SuccessModal.tsx
'use client';
import { useEffect, useRef } from 'react';

export default function SuccessModal({
  title,
  message,
  onClose,
}: {
  title: string;
  message: string;
  onClose: () => void;
}) {
  const okRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      <div
        className="relative z-10 w-[320px] max-w-[90vw] rounded-2xl bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-lg">✅</span>
        </div>
        <h2 id="success-title" className="mb-1 text-lg font-semibold">
          {title}
        </h2>
        <p className="mb-5 text-sm text-gray-600">{message}</p>
        <div className="mb-5 text-5xl">📒</div>
        <button
          ref={okRef}
          className="w-full rounded-xl bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
          onClick={onClose}
        >
          確認
        </button>
      </div>
    </div>
  );
}
