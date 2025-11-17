'use client';

import React, { useEffect, useState } from 'react';
import FriendCard from '../../_components/friend-card';
import { useFetch } from '@/hooks/useFetch';
import { API_SERVER } from '../../../../config/api-path';
import { useAuth } from '@/hooks/use-Auth';
import { AVATAR_PATH } from '../../../config/image-path';

// interface Friend {
//   avatar: string;
//   user_name: string;
//   address: string;
// }

// interface FriendRecommendProps {
//   friend_data: Friend[];
// }

export default function FriendRecommend() {
  const [friendRecommend, setFriendRecommend] = useState<any[]>([]);

  const { user } = useAuth();
  const limit = 2;
  const url = `${API_SERVER}/friendships/similar-experience?limit=${limit}`;
  const { data, loading, error, refetch } = useFetch(url);

  useEffect(() => {
    refetch();
  }, [user]);

  useEffect(() => {
    if (data && data.success) {
      setFriendRecommend(data.data);
    } else if (data && !data.success) {
      console.error('API 回應失敗:', data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="p-2.5 space-y-2.5">
        <p>載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2.5 space-y-2.5">
        <p className="text-red-500">載入失敗: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          重新載入
        </button>
      </div>
    );
  }

  return (
    <div className="p-2.5 space-y-2.5 h-[360px]">
      {friendRecommend && friendRecommend.length > 0 ? (
        friendRecommend.map((friend: any, index: number) => (
          <FriendCard
            key={index}
            avatar={
              `${AVATAR_PATH}${friend.user.avatar}` || '/avatar_default.png'
            }
            name={friend.user.nickname || friend.fullName}
            address={friend.overlappedAttractions[0].name || '未提供地址'}
          />
        ))
      ) : (
        <p>沒有推薦好友</p>
      )}
    </div>
  );
}
