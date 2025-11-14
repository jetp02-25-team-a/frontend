'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type GlobalButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
};

export function GlobalButton({
  children,
  onClick,
  href,
  variant = 'outline',
  className = '',
  disabled = false,
}: GlobalButtonProps) {
  const router = useRouter();

  const base =
    'inline-flex items-center justify-center rounded-full border font-medium transition-all duration-200 px-6 py-2 text-[15px]';

  // 改用 tailwind 內建色票（amber），避免任意值沒被生成
  const styles = {
    primary:
      'bg-amber-400 border-amber-400 text-white hover:bg-amber-500 hover:cursor-pointer',
    outline: 'border-amber-500 text-amber-600 bg-transparent hover:bg-amber-50',
    ghost: 'border-transparent text-amber-600 hover:bg-amber-50',
  } as const;

  const handleClick = () => {
    if (disabled) return;
    if (href) router.push(href);
    else onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(
        base,
        styles[variant],
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

export default function BackButtons() {
  const router = useRouter();

  return (
    <div className="flex justify-center gap-8 bg-amber-50 py-6">
      <GlobalButton href="/">回首頁</GlobalButton>
      <GlobalButton href="/place">回景點選單</GlobalButton>
      <GlobalButton onClick={() => router.back()}>回上一頁</GlobalButton>
    </div>
  );
}
