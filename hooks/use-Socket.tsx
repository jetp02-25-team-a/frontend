'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './use-Auth';
import { SOCKET_SERVER } from '@/config/socketIo';
import toast from 'react-hot-toast';
interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });
//輸出provider
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const API_URL = `${SOCKET_SERVER}`;
    const newSocket = io(API_URL, {
      withCredentials: true,
      query: { userId: user.id },
    });

    setSocket(newSocket);

    //自動連線訊息
    newSocket.on('connect', () => {
      console.log('已連線全域:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('已斷線');
    });

    // ✅ 每個使用者都加入自己的ID房間
    newSocket.emit('setMyId', user.id);

    // ✅ 監聽全域「newFriend」事件
    newSocket.on('newFriend', (data) => {
      console.log('💬 收到全域好友通知:', data);

      // 可選：顯示通知
      toast.success(`你有一個新的好友請求來自 ${data.senderName}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    // 提供一個socket 給SocketContext
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
//輸出 context 中的 SocketContext 裡面為socket
export const useSocket = () => useContext(SocketContext);
