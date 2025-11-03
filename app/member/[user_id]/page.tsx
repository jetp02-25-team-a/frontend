'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/use-Auth';
import { useParams } from 'next/navigation';
import { API_SERVER } from '../../config/api-path';
import { ApiResponse } from '../_interfaces/userData';

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
  const { user } = useAuth();
  const { user_id } = useParams();
  const [userData, setUserData] = useState(userDataInit);
  const id_string = Array.isArray(user_id) ? user_id[0] : user_id;
  const uid = parseInt(id_string!);

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
        <h1>{userData.data.nickname}</h1>
        <h1>{userData.data.description}</h1>
      </div>
      {user.id == uid ? (
        <Link href={`edit/${user.id}`}>編輯資料 使用者編號:{user.id} </Link>
      ) : (
        <h1>正在查看別人的個人檔案</h1>
      )}
    </>
  );
}
