'use client';

import { createContext, useState, useContext } from 'react';

// 定義User 類型
interface User {
  id: number;
  name: string;
  email: string;
}

// 定義Context類型
interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// 1. 建立context
const AuthContext = createContext<AuthContextType | null>(null);
// 設定context的名稱，方便在React devtools(瀏覽器套件)中識別找到
AuthContext.displayName = 'AuthContext';

// 2. 建立Provider元件(內有共享狀態)，注意需要套用到根佈局(RootLayout)裡
export function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 初始化會員狀態(未登入狀態)
  const initUser = { id: 0, name: '', email: '' };
  // 定義會員的狀態
  const [user, setUser] = useState<User>(initUser);
  // 判斷會員是否有登入
  const isLoggedIn = Boolean(user.id);

  // 模擬登入
  const login = () => {
    setUser({ id: 1, name: 'Jane Doe', email: 'test@test.com' });
  };

  // 模擬登出
  const logout = () => {
    setUser(initUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn,
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
