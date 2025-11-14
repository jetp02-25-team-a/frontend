// 這是所有成功 API 響應的通用封裝類型
export interface StandardApiResponse<T> {
  success: true;
  data: T;
}

// 這是所有失敗 API 響應的通用結構
export interface ApiErrorResponse {
  success: false;
  message: string;
}

// 自訂錯誤類，供 apiFetch 拋出
export class FetchError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = 'FetchError';
  }
}
