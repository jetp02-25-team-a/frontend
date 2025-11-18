'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  // 監聽卷軸位置
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300); // 超過 300px 才顯示
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 點擊回頂部
  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <button
      onClick={scrollTop}
      className={`fixed bottom-6 right-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full
                  bg-amber-500 text-white shadow-md transition-all duration-300 
                  hover:bg-amber-600 hover:shadow-lg
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} hover:cursor-pointer`}
    >
      <FontAwesomeIcon icon={faAngleUp} className="text-xl" />
    </button>
  );
}
