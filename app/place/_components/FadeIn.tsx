'use client';
import { useEffect, useState, ReactNode } from 'react';

export default function FadeIn({
  children,
  delay = 0, // 毫秒：做些錯落感
  duration = 400, // 毫秒：動畫時間
  translate = 6, // px：輕微上移距離
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  translate?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : `translateY(${translate}px)`,
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
