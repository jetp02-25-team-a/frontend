'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../_api';
import type { AccommodationListDTO, SearchResponse } from '../../_types';

export function useAccommodationSearch(params: URLSearchParams) {
  const [items, setItems] = useState<AccommodationListDTO[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<SearchResponse['meta'] | null>(null);

  // 每次搜尋參數變化 → 清空 items
  useEffect(() => {
    setItems([]);
    setCursor(null);
  }, [params]);

  // 每次 cursor 或 params 改變 → 呼叫 API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          keyword: params.get('keyword') || '',
          checkInDate: params.get('checkInDate') || '',
          checkOutDate: params.get('checkOutDate') || '',
          guestCount: params.get('guestCount') || '',
          ...(cursor ? { cursor } : {}),
        }).toString();

        const res = await apiFetch<SearchResponse>(
          `/m3/accommodations/search?${query}`
        );

        if (!cursor) {
          // 🔑 新搜尋 → 完全刷新
          setItems(res.data);
        } else {
          // 🔑 捲動 → append 並去重複
          setItems((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const newItems = res.data.filter((i) => !existingIds.has(i.id));
            return [...prev, ...newItems];
          });
        }

        setMeta(res.meta);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params, cursor]);

  return {
    items,
    meta,
    loading,
    error,
    setCursor,
  };
}
