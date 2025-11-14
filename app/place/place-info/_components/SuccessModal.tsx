'use client';
import { useEffect, useRef } from 'react';

export default function SuccessModal({
  title,
  message,
  type = 'create',
  onClose,
}: {
  title: string;
  message: string;
  type?: 'create' | 'edit' | 'delete';
  onClose: () => void;
}) {
  const okRef = useRef<HTMLButtonElement | null>(null);
  const imgMap: Record<typeof type, string> = {
    create: '/black_nb.png',
    edit: '/edit.png',
    delete: '/trash.png',
  };

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
        <h1 id="success-title" className="mb-1 text-3xl font-semibold">
          {title}✅
        </h1>
        <p className="mt-5 mb-5 text-sm text-gray-600">{message}</p>
        <div className="mb-5  flex justify-center items-center">
          <img
            src={imgMap[type]}
            alt={type}
            className="h-32 w-32 drop-shadow-md mt-5 mb-5"
          />
        </div>
        <button
          ref={okRef}
          className="w-[60%] rounded-xl bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300 "
          onClick={onClose}
        >
          確認
        </button>
      </div>
    </div>
  );
}
