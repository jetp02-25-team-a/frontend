'use client';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  value?: number; // 初始分數 0~5
  onChange?: (v: number) => void; // 回傳選到的分數
  size?: number; // 星星尺寸(px)
  readOnly?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function StarRatingInput({
  value = 0,
  onChange,
  size = 22,
  readOnly = false,
  className = '',
  ariaLabel = '星等評分',
}: Props) {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => setRating(value), [value]);

  const display = hover ?? rating;
  const stars = useMemo(() => Array.from({ length: 5 }, (_, i) => i + 1), []);

  function commit(v: number) {
    if (readOnly) return;
    setRating(v);
    onChange?.(v);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (readOnly) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const v = Math.min(5, (hover ?? rating) + 1);
      setHover(v);
      commit(v);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const v = Math.max(0, (hover ?? rating) - 1);
      setHover(v);
      commit(v);
    }
    if (e.key === '0' || e.key.toLowerCase() === 'backspace') {
      e.preventDefault();
      setHover(null);
      commit(0);
    }
  }

  return (
    <div
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={display}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={onKeyDown}
      className={`inline-flex items-center gap-1 select-none ${className}`}
    >
      {stars.map((v, i) => {
        const active = v <= display;
        const scale = hover
          ? v <= (hover ?? 0)
            ? 'scale-110'
            : 'scale-100'
          : 'scale-100';
        return (
          <button
            type="button"
            key={v}
            disabled={readOnly}
            aria-label={`${v} 星`}
            onMouseEnter={() => !readOnly && setHover(v)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onFocus={() => !readOnly && setHover(rating || 0)}
            onBlur={() => !readOnly && setHover(null)}
            onClick={() => commit(v)}
            className={`p-0.5 outline-none transition-transform ease-out duration-150 hover:scale-110 active:scale-95`}
            style={{
              width: size,
              height: size,
              transitionDelay: `${i * 15}ms`,
            }} // 輕微階梯感
          >
            <svg
              viewBox="0 0 20 20"
              width={size}
              height={size}
              className={`drop-shadow-[0_0_0_rgba(0,0,0,0.06)] ${scale} transition-transform duration-150`}
              fill={active ? '#f59e0b' : '#e5e7eb'} // amber-500 / gray-200
            >
              <path
                fillRule="evenodd"
                d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.51L10 14.77 5.06 16.72 6 11.21l-4-3.9 5.53-.8L10 1.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        );
      })}
      <span className="ml-2 text-sm text-neutral-600">{display || '-'}</span>
    </div>
  );
}
