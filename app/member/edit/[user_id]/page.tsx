'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAuthRequired } from '../../../../hooks/use-Auth';
import { useParams } from 'next/navigation';
import { ApiResponse } from '../../_interfaces/userData';
import { API_SERVER } from '../../../config/api-path';

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

export default function UserIdPage() {
  useAuthRequired();
  const { user } = useAuth();
  const { user_id } = useParams();
  const [userData, setUserData] = useState(userDataInit);

  //資料拿取
  const getUserData = async () => {
    const response = await fetch(`${API_SERVER}/user/${user_id}`);
    const data = await response.json();

    setUserData(data);
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <div>
        <img
          src={user.avatar || '/avatar_default.png'}
          alt=""
          height={100}
          width={100}
        />
        <h1>顯示名稱</h1>
        <input
          type="text"
          placeholder={'預設名稱'}
          defaultValue={userData.data.nickname || ''}
        />
        <h1>關於我</h1>
        <textarea
          placeholder={'介紹你自己!'}
          defaultValue={userData.data.description || ''}
        />
      </div>
      <button>儲存</button>
    </>
  );
}
