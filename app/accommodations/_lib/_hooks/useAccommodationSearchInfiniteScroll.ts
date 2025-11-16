'use client';

import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { apiFetch } from '../_api';
import type { AccommodationListDTO, SearchResponse } from '../../_types';

const PAGE_SIZE = 10;

function buildQuery(params: URLSearchParams, cursor?: string | null) {
  return new URLSearchParams({
    keyword: params.get('keyword') || '',
    checkInDate: params.get('checkInDate') || '',
    checkOutDate: params.get('checkOutDate') || '',
    guestCount: params.get('guestCount') || '',
    limit: PAGE_SIZE.toString(),
    ...(cursor ? { cursor } : {}),
  }).toString();
}

export function useAccommodationSearchInfiniteScroll(params: URLSearchParams) {
  const getKey = (
    pageIndex: number,
    previousPageData: SearchResponse | null
  ) => {
    if (previousPageData && !previousPageData.meta?.hasNextPage) return null;
    const cursor = pageIndex === 0 ? null : previousPageData?.meta?.endCursor;
    return `/m3/accommodations/search?${buildQuery(params, cursor)}`;
  };

  const { data, error, size, setSize, isLoading } =
    useSWRInfinite<SearchResponse>(
      getKey,
      (url) => apiFetch<SearchResponse>(url),
      { revalidateOnFocus: false }
    );

  const items: AccommodationListDTO[] = data
    ? data.flatMap((res) => res.data)
    : [];
  const meta = data ? data[data.length - 1].meta : null;

  // 🎯 自動下拉：內建 IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current || !meta?.hasNextPage || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && meta?.hasNextPage) {
          // console.log(
          //   `[useAccommodationSearchInfiniteScroll] auto loadMore triggered (current total items=${items.length})`
          // );
          setSize((prev) => prev + 1); // 用函數式更新，避免依賴 size
        }
      },
      { threshold: 1.0 } // 只有完全進入 viewport 才觸發
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef, isLoading, meta?.hasNextPage, setSize]);

  return {
    items,
    meta,
    loading: isLoading,
    error,
    sentinelRef, // 頁面只要把這個 div 放在列表底部
  };
}
