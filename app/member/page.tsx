'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../hooks/use-Auth';
import { API_SERVER } from '../config/api-path';
import { ApiResponse } from './_interfaces/userData';
import Link from 'next/link';
import { IMAGE_PATH } from '../config/image-path';

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
      <div>
        <Image
          src={
            userData.data.avatar
              ? `${IMAGE_PATH}${userData.data.avatar}`
              : '/avatar_default.png'
          }
          alt=""
          height={100}
          width={100}
        />
        <h1>{userData.data.nickname}</h1>
        <h1>{userData.data.description}</h1>
        <Link href={`member/edit/${user.id}`}>編輯個人資料</Link>
      </div>
    </>
  );
}
