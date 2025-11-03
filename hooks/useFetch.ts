import { useState, useEffect } from 'react';

interface UseFetchOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export function useFetch<T = any>(url: string, options: UseFetchOptions = {}) {
  const { method = 'GET', body = null, headers = {} } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('BackpackUserInfo');
      let newToken;
      if (token) {
        newToken = 'Bearer ' + JSON.parse(token).token;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(newToken ? { Authorization: newToken } : {}),
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
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}
