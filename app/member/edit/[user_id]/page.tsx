'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuth, useAuthRequired } from '../../../../hooks/use-Auth';
import { useParams } from 'next/navigation';
import { ApiResponse } from '../../_interfaces/userData';
import { API_SERVER } from '../../../config/api-path';
import Image from 'next/image';
import { IMAGE_PATH } from '../../../config/image-path';
import { useRouter } from 'next/navigation';

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

type SelectedFile = File | null;

export default function UserIdPage() {
  useAuthRequired();
  const { user, getAuthHeader } = useAuth();
  const { user_id } = useParams();
  const [userData, setUserData] = useState(userDataInit);
  const [selectedFile, setSelectedFile] = useState<SelectedFile>(null);
  const router = useRouter();

  //資料拿取
  const getUserData = async () => {
    const response = await fetch(`${API_SERVER}/user/${user_id}`);
    const data = await response.json();

    setUserData(data);
  };

  //處理輸入資料
  const handleFieldChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      data: {
        ...prevData.data,
        [name]: value,
      },
    }));
    console.log(userData);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // 透過 event.target.files 取得 FileList 物件
    // ?. 確保 event.target.files 存在
    const file = event.target.files?.[0];

    // 如果成功取得檔案 (檔案存在)
    if (file) {
      setSelectedFile(file);
    } else {
      //沒有選擇檔案
      setSelectedFile(null);
    }
  };

  //表單送出
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (userData.data.nickname)
      formData.append('nickname', userData.data.nickname);
    if (userData.data.fullName)
      formData.append('fullName', userData.data.fullName);
    if (userData.data.description)
      formData.append('description', userData.data.description);
    if (selectedFile) formData.append('avatar', selectedFile);
    try {
      const response = await fetch(`${API_SERVER}/user/${user_id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });
      if (response.ok) {
        console.log('成功');
        router.push('/member');
      } else {
        console.log('失敗');
      }
    } catch {
      console.log('網路錯誤');
    }
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <Image
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : userData.data.avatar
                  ? `${IMAGE_PATH}${userData.data.avatar}`
                  : '/avatar_default.png'
            } //檔案>舊頭像>預設頭像
            alt=""
            height={100}
            width={100}
          />
          <h1>更改頭像</h1>
          <input type="file" onChange={handleFileChange} />
          <h1>顯示名稱</h1>
          <input
            type="text"
            placeholder={'尚未設定'}
            value={userData.data.nickname || ''}
            name="nickname"
            onChange={handleFieldChange}
          />
          <h1>全名(訂單顯示名稱)</h1>
          <input
            type="text"
            placeholder={'尚未設定'}
            value={userData.data.fullName || ''}
            name="fullName"
            onChange={handleFieldChange}
          />
          <h1>關於我</h1>
          <textarea
            placeholder={'介紹你自己!'}
            value={userData.data.description || ''}
            name="description"
            onChange={handleFieldChange}
          />
        </div>
        <button type="submit">儲存</button>
      </form>
    </>
  );
}
