'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './use-Auth';
import { SOCKET_SERVER } from '@/config/socketIo';

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
