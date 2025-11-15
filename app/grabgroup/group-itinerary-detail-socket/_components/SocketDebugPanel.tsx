import React, { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/use-Socket';
import { useAuth } from '@/hooks/use-Auth';

interface DebugPanelProps {
  itineraryId: string | null;
}

const SocketDebugPanel: React.FC<DebugPanelProps> = ({ itineraryId }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [roomStatus, setRoomStatus] = useState<string>('未加入');
  const [lastEvent, setLastEvent] = useState<string>('無');

  useEffect(() => {
    if (!socket) return;

    // 檢查連接狀態
    setIsConnected(socket.connected);

    // 監聽連接事件
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Socket 已連接');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Socket 已斷線');
    });

    // 監聽房間加入確認
    socket.on('itinerary:joined', (data) => {
      setRoomStatus(`已加入房間: ${data.roomName}`);
      setLastEvent('itinerary:joined');
      console.log('🏠 房間加入確認:', data);
    });

    // 監聽時間調整事件
    socket.on('itinerary:timeChanged', (data) => {
      setLastEvent(`時間調整: ${data.dayIndex}-${data.nodeIndex} -> ${data.newDuration}分鐘`);
      console.log('⏰ 收到時間調整事件:', data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('itinerary:joined');
      socket.off('itinerary:timeChanged');
    };
  }, [socket]);

  // 測試時間調整事件
  const testTimeChange = () => {
    if (!socket || !itineraryId || !user) return;

    const testData = {
      itineraryId: Number(itineraryId),
      dayIndex: 0,
      nodeIndex: 0,
      newDuration: 90,
      userId: user.id?.toString() || 'test',
      userName: user.nickname || 'Test User',
      timestamp: new Date().toISOString(),
    };

    console.log('🧪 發送測試時間調整事件:', testData);
    socket.emit('itinerary:timeChanged', testData);
    setLastEvent('發送測試時間調整');
  };

  // 重新加入房間
  const rejoinRoom = () => {
    if (!socket || !itineraryId || !user) return;

    const joinData = {
      itineraryId: Number(itineraryId),
      userId: user.id,
      userName: user.nickname,
    };

    console.log('🏠 重新加入房間:', joinData);
    socket.emit('itinerary:join', joinData);
    setLastEvent('重新加入房間');
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-bold mb-2">🔧 Socket 調試面板</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>連接狀態:</span>
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? '✅ 已連接' : '❌ 未連接'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>房間狀態:</span>
          <span className="text-blue-600">{roomStatus}</span>
        </div>
        
        <div className="flex justify-between">
          <span>行程ID:</span>
          <span>{itineraryId || '無'}</span>
        </div>
        
        <div className="flex justify-between">
          <span>用戶ID:</span>
          <span>{user?.id || '無'}</span>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-xs text-gray-600 mb-1">最後事件:</div>
          <div className="text-xs bg-gray-100 p-1 rounded">{lastEvent}</div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <button
            onClick={rejoinRoom}
            className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            disabled={!socket || !itineraryId}
          >
            重新加入房間
          </button>
          <button
            onClick={testTimeChange}
            className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            disabled={!socket || !itineraryId}
          >
            測試時間調整
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocketDebugPanel;