interface User {
  // 基本資訊
  id: number;
  email: string;
  nickname: string | null;
  fullName: string | null;
  avatar: string | null;
  description: string | null;
  point: number;
}

export interface ApiResponse {
  success: boolean;
  data: User;
}
