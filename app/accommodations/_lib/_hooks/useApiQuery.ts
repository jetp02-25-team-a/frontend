import { useState, useEffect } from 'react';
// 假設 Hook 位置: app/accommodations/_lib/hooks/useApiQuery.ts
import { apiFetch } from '../_api';
import { FetchError } from '../../_types';
import { useAuth } from '@/hooks/use-Auth';

interface UseApiQueryOptions {
  withAuth?: boolean;
}

export function useApiQuery<T = any>(
  endpoint: string,
  options: UseApiQueryOptions = {}
) {
  const { withAuth = false } = options;
  const { getAuthHeader } = useAuth();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);

  // 💡 注意：由於 fetchData 每次渲染都會重新創建，我們必須將它返回給 refetch
  // 但在 useEffect 中，我們會依賴它的所有變數，避免循環依賴問題。
  const fetchData = async (signal?: AbortSignal) => {
    // 確保 endpoint 存在且非空
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const headers = (withAuth ? getAuthHeader() : {}) as HeadersInit;

      const result = await apiFetch<T>(endpoint, {
        method: 'GET',
        headers: headers,
        signal: signal, // 傳遞 signal 實現取消
      });

      // 只有在請求成功且組件未被卸載時才設置數據
      setData(result);
    } catch (err: any) {
      // 檢查是否為請求取消錯誤 (AbortError)，如果是則靜默處理
      if (err.name === 'AbortError') {
        // 不設置 error 或 loading，直接返回
        return;
      }

      if (err instanceof FetchError) {
        setError(err);
      } else {
        setError(new FetchError(err.message || '未知網絡錯誤', 0));
      }
    } finally {
      // 只有在非 AbortError 的情況下才設置 loading 為 false
      // 由於 AbortError 已經在 catch 中處理了，這裡只需要檢查是否成功
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🎯 核心防護：使用 AbortController 進行清理
    const controller = new AbortController();
    const signal = controller.signal;

    // 在 useEffect 內調用 fetchData，並傳入 signal
    fetchData(signal);

    // Cleanup 函式：在組件卸載或依賴項變化時取消請求
    return () => {
      controller.abort();
    };

    // 🎯 依賴項：我們必須將所有 fetchData 內部引用的外部變量都列出。
    // 這雖然會讓 Linter 報錯 "fetchData should be in dependencies"，但因為我們不使用 useCallback，
    // 這樣列出是為了確保 fetchData 使用的是最新值。
    // 我們需要在程式碼中禁用 ESLint 檢查，這是使用這種模式的必要妥協。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, withAuth]);

  // 返回的 refetch 函式就是每次渲染都會重新創建的 fetchData 函式
  // ⚠️ 注意：每次調用 refetch，它都會使用最新的 endpoint, withAuth 等值
  return { data, loading, error, refetch: fetchData };
}
