import { API_SERVER } from '@/config/api-path';

import {
  StandardApiResponse,
  ApiErrorResponse,
  FetchError,
} from '../../_types/api';

/**
 * 通用 API 呼叫函式
 * 負責處理：URL 拼接、Headers 設置、res.ok 檢查、JSON 解析、錯誤拋出。
 * @param endpoint 除去 API_SERVER 的路徑 (例如: '/m3/favorite')
 * @param options fetch 選項 (包含 method, headers, body 等)
 * @returns 成功時，直接返回響應的 data 內容 (T)
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_SERVER}${endpoint}`;

  const mergedHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...((options.headers || {}) as Record<string, string>), // 確保處理 options.headers
  };

  const finalOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  // 🎯 修正：如果 body 是物件，自動序列化為 JSON
  if (
    finalOptions.body &&
    typeof finalOptions.body === 'object' &&
    finalOptions.body !== null
  ) {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }

  // 🎯 防護 1: 網路請求級別的 try-catch 由 Hook 外層處理
  const res = await fetch(url, finalOptions);

  // 1. 處理 401 錯誤 (未經授權)
  if (res.status === 401) {
    throw new FetchError('登入憑證無效或已過期', 401);
  }

  // 2. 處理非 2xx 的錯誤響應 (400, 404, 500 等)
  if (!res.ok) {
    let errorBody: ApiErrorResponse | null = null;

    try {
      // 🎯 防護 2: 嘗試解析錯誤 JSON 體 (防止伺服器未返回 JSON 導致 Crash)
      errorBody = await res.json();
    } catch (e) {
      // 解析失敗，拋出通用錯誤訊息
      console.error(`[apiFetch] JSON Parse Error on status ${res.status}:`, e);
    }

    // 拋出包含後端訊息和狀態碼的 FetchError
    const message =
      errorBody?.message || `API 請求失敗: ${res.status} ${res.statusText}`;
    throw new FetchError(message, res.status);
  }

  // 3. 處理成功響應 (狀態碼 200-299)
  let fullJson: StandardApiResponse<T>;

  try {
    // 🎯 防護 3: 嘗試解析成功的 JSON 體 (防止成功的響應體格式錯誤導致 Crash)
    fullJson = await res.json();
  } catch (e) {
    console.error('[apiFetch] Success Response JSON Parse Error:', e);
    throw new FetchError('伺服器響應格式錯誤', 500);
  }

  // 4. 確保響應結構符合標準 { success: true, data: T }
  if (!fullJson.success || fullJson.data === undefined) {
    console.error('[apiFetch] Invalid API structure:', fullJson);
    throw new FetchError('API 響應結構錯誤', 500);
  }

  return fullJson.data; // 只返回業務數據部分 T
}
