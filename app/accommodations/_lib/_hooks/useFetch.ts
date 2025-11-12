import { useState, useEffect } from 'react';

interface UseFetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  withAuth?: boolean;
}

export function useFetch<T = any>(url: string, options: UseFetchOptions = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    withAuth = false,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let authHeader: Record<string, string> = {};

      if (withAuth) {
        const tokenStr = localStorage.getItem('BackpackUserInfo');
        if (tokenStr) {
          const parsed = JSON.parse(tokenStr);
          if (parsed?.token) {
            authHeader = { Authorization: `Bearer ${parsed.token}` };
          }
        }
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
