'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../hooks/use-Auth';
import { API_SERVER } from '../config/api-path';
import { ApiResponse } from './_interfaces/userData';
import Link from 'next/link';
import { IMAGE_PATH } from '../config/image-path';
import ComponentsUserCard from './_components/user-card';
import ComponentsButton from './_components/button-orange';

const userDataInit: ApiResponse = {
  success: false,
  data: {
    id: 0,
    email: '',
    nickname: null,
    fullName: null,
    avatar: null,
    description: null,
    point: 0,
  },
};

export default function M6Page() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(userDataInit);

  //資料拿取
  const getUserData = async () => {
    const response = await fetch(`${API_SERVER}/user/${user.id}`);
    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, [user.id]);

  if (!userData || !userData.data) {
    // 可以在這裡顯示 Loading 畫面或 Null 狀態
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-[#FBE7C1] w-full h-full">
        <ComponentsUserCard
          avatar={
            userData.data.avatar
              ? `${IMAGE_PATH}${userData.data.avatar}`
              : '/avatar_default.png'
          }
          name={userData.data.nickname || '尚未設定暱稱'}
          description={userData.data.description || '向別人介紹你自己!'}
          id={user.id}
        />
      </div>
    </>
  );
}
