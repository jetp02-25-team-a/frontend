'use client';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

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
            }}
          >
            <FontAwesomeIcon
              icon={faStarSolid}
              className={`${scale} transition-transform duration-150 drop-shadow-[0_0_0_rgba(0,0,0,0.06)]`}
              style={{
                width: size,
                height: size,
                color: display >= v - 0.25 ? '#f59e0b' : '#f59e0b', // amber-500 / gray-200
              }}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-neutral-600">{display || '-'}</span>
    </div>
  );
}
