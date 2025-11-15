import { API_SERVER } from '@/config/api-path';

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean = false
): Promise<T> {
  try {
    let authHeader: Record<string, string> = {};

    if (withAuth && typeof window !== 'undefined') {
      const tokenStr = localStorage.getItem('BackpackUserInfo');
      if (tokenStr) {
        const parsed = JSON.parse(tokenStr);
        if (parsed?.token) {
          authHeader = { Authorization: `Bearer ${parsed.token}` };
        }
      }
    }

    const res = await fetch(`${API_SERVER}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API Error: ${res.status} ${text}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    throw new Error('伺服器連線失敗，請稍後再試');
  }
}
