'use client';

import Link from 'next/link';

interface ScrollLinkProps {
  reviewCount: number;
  targetId: string;
}

export default function ScrollLink({ reviewCount, targetId }: ScrollLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止 Link 的預設行為
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Link
      href={`#${targetId}`}
      onClick={handleClick}
      className="text-sm text-gray-600 hover:underline cursor-pointer"
    >
      ( {reviewCount} 則評論 )
    </Link>
  );
}
