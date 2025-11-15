'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { API_SERVER } from '../app/config/api-path';
import { useRouter } from 'next/navigation';

// 定義User 類型
interface User {
  id: number;
  nickname: string;
  email: string;
  avatar: string;
  token: string;
}

// 定義Context類型
interface AuthContextType {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | object;
  isReady: boolean;
  isAuthenticated: boolean;
  updateUser: (id: number) => void;
}

//建立context
const AuthContext = createContext<AuthContextType | null>(null);
AuthContext.displayName = 'AuthContext';

const storageKey = 'BackpackUserInfo';

//建立Provider元件
export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 初始化會員狀態(未登入狀態)
  const initUser = { id: 0, nickname: '', email: '', avatar: '', token: '' };
  // 定義會員的狀態
  const [user, setUser] = useState<User>(initUser);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  // 登入
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = {
        email: email,
        password: password,
      };
      const r = await fetch(`${API_SERVER}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', //  JSON 格式
        },
        body: JSON.stringify(data),
      });

      const result = await r.json();

      if (result.success) {
        const info = {
          id: result.data.user_id,
          email: result.data.email,
          nickname: result.data.nickname,
          avatar: result.data.avatar,
          token: result.data.token,
        };
        setUser(info);
        localStorage.setItem(storageKey, JSON.stringify(info));
        return true;
      }
    } catch (e) {
      console.error('Login failed:', e);
    }
    return false;
  };

  // 登出
  const logout = () => {
    localStorage.removeItem(storageKey);
    setUser(initUser);
    router.push('/');
  };

  const updateUser = async (id: number) => {
    const r = await fetch(`${API_SERVER}/user/${id}`);
    const result = await r.json();
    const newInfo = {
      nickname: result.data.nickname,
      avatar: result.data.avatar,
    };
    const updatedUser = {
      ...user, // 保留原有的 id, email, token
      ...newInfo, // 用新獲取的 nickname 和 avatar 覆蓋舊值
    };
    setUser(updatedUser); // 同時更新 localStorage

    localStorage.setItem(storageKey, JSON.stringify(updatedUser));
  };

  const getAuthHeader = () => {
    if (!user?.token) return {};
    return {
      Authorization: `Bearer ${user.token}`,
    };
  };

  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    if (!str) {
      setIsReady(true);
      return;
    }
    try {
      const authData: User = JSON.parse(str);

      // 再去後端確認 token
      fetch(`${API_SERVER}/auth`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authData.token}` },
      })
        .then((r) => {
          if (r.status === 401) {
            logout();
            return null;
          }
          return r.json();
        })
        .then((result) => {
          if (result?.user_id) {
            setUser(authData);
          } else {
            logout();
          }
        })
        .catch(() => logout())
        .finally(() => setIsReady(true));
    } catch {
      setIsReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getAuthHeader,
        isReady,
        updateUser,
        isAuthenticated: !!user?.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. 自訂名稱的useAuth勾子，替代useContext使用
export const useAuth = () => {
  const context = useContext(AuthContext);
  // 需先判斷是否為null值
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider component');
  }
  // 回傳的值才會一定是AuthContextType
  return context;
};

// 權限管控 hook：需要登入才能進入的頁面
export const useAuthRequired = () => {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push('/member/login');
    }
  }, [isAuthenticated, isReady]);
};
