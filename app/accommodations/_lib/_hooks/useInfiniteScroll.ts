'use client';

import { useEffect } from 'react';

/**
 * Hook: 處理 IntersectionObserver 以支援 infinite scroll
 * @param sentinelRef 監聽的 DOM ref
 * @param hasNextPage 是否還有下一頁
 * @param loading 是否正在載入
 * @param onLoadMore 當需要載入更多時觸發的 callback
 */
export function useInfiniteScroll(
  sentinelRef: React.RefObject<HTMLDivElement | null>,
  hasNextPage: boolean,
  loading: boolean,
  onLoadMore: () => void
) {
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          onLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    const sentinel = sentinelRef.current;
    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [sentinelRef, hasNextPage, loading, onLoadMore]);
}
