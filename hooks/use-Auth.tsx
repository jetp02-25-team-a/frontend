'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { API_SERVER } from '../app/config/api-path';
import { useRouter } from 'next/router';

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
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAuthHeader: () => { Authorization: string };
  isReady: boolean;
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

  // 登入
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('login');

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
      return false;
    }
    return false;
  };

  // 登出
  const logout = () => {
    localStorage.removeItem(storageKey);
    setUser(initUser);
  };

  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${user.token}`,
    };
  };

  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    if (str) {
      try {
        const authData = JSON.parse(str);
        if (authData.token) {
          fetch(`${API_SERVER}/auth`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          })
            .then((r) => r.json())
            .then((result) => {
              if (result.user_id) {
                setUser(authData);
              } else {
                logout(); // token 無效時, 登出
              }
            })
            .catch((ex) => {})
            .finally(() => {
              setIsReady(true); // 完成初始化
            });
        } else {
          setIsReady(true); // 完成初始化
        }
      } catch (ex) {}
    } else {
      setIsReady(true); // 完成初始化
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isReady,
        getAuthHeader,
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

// 權限管控的勾子
export const useAuthRequired = () => {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    console.log('useAuthRequired:', { isReady, user });

    if (isReady && !user!.email) {
      router.push('/member/login');
    }
  }, [user]);
};
