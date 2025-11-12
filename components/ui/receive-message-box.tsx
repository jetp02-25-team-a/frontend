'use client';

import Image from 'next/image';
import React from 'react';
import { API_SERVER } from '../../app/config/api-path';

interface ReceiveMessageBoxProps {
  userId: number;
  avatar?: string; // full url or filename
  senderName: string;
  content: string;
  time?: string; // ISO string or formatted
  onReply?: () => void;
}
//
// 回應邀請：接受 (response = 1) 或 拒絕 (response = 2)
// const { friendshipId, response } = req.body; // response: 1 accept, 2 reject
const handleRespond = async (
  friendId: number,
  response: number,
  onReply?: () => void
) => {
  const token = localStorage.getItem('BackpackUserInfo');
  let newToken = '';
  if (token) {
    newToken = 'Bearer ' + JSON.parse(token).token;
  }
  try {
    //1.找 friendshipId
    const friendShipUrl = `${API_SERVER}/friendships/findFriendshipId`;
    const resFetch = await fetch(friendShipUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(newToken && { Authorization: newToken }),
      },
      body: JSON.stringify({ friendId }),
    });

    const res = await resFetch.json();
    if (!res.success) {
      console.error('找不到 friendshipId 或請求失敗', res);
      return;
    }

    const friendshipId = res.data.friendshipId;
    // ========================================
    //2.發送回應
    const respondUrl = `${API_SERVER}/friendships/respond`;
    const resultFetch = await fetch(respondUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(newToken && { Authorization: newToken }),
      },
      body: JSON.stringify({ friendshipId, response }),
    });

    const result = await resultFetch.json();

    if (result?.success) {
      console.log('回應成功', result);
      if (onReply) onReply();
    } else {
      console.error('回應失敗', result);
    }
  } catch (error) {
    console.error('發生錯誤:', error);
  }
};

export default function ReceiveMessageBox({
  userId,
  avatar,
  senderName,
  content,
  time,
  onReply,
}: ReceiveMessageBoxProps) {
  // avatar may be full URL or filename; parent should normalize if needed
  return (
    <div className="p-4 flex gap-4 items-start">
      <div className="w-14 h-14 relative shrink-0 overflow-hidden rounded-full">
        {avatar ? (
          <Image src={avatar} alt={senderName} fill className="object-cover" />
        ) : (
          <Image
            src="/avatar_default.png"
            alt="avatar"
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{senderName}</h4>
          <span className="text-xs text-gray-400">{time ?? ''}</span>
        </div>
        <p className="mt-1 text-sm text-gray-700">{content}</p>

        <div className="mt-3 flex items-center gap-2">
          {onReply && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRespond(userId, 1, onReply)}
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-full bg-[#F2F2F2] hover:bg-gray-200 shrink-0"
              >
                接受
              </button>
              <button
                type="button"
                onClick={() => handleRespond(userId, 2, onReply)}
                className="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-full bg-[#F2F2F2] hover:bg-gray-200 shrink-0"
              >
                拒絕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
