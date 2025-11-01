import { useState } from 'react';

interface UseFetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

// 轉入url
export function useFetch<T = any>(url: string, options: UseFetchOptions = {}) {
  const { method = 'GET', body = null, headers = {} } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true); //讀取中...
    setError(null); // 有無錯誤

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false); //執行後修改狀態
    }
  };

  return { data, loading, error, refetch: fetchData };
}
