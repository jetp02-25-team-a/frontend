'use client';

import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useAuth, useAuthRequired } from '../../../../hooks/use-Auth';
import { useParams } from 'next/navigation';
import { ApiResponse } from '../../_interfaces/userData';
import { API_SERVER } from '../../../config/api-path';
import Image from 'next/image';
import { AVATAR_PATH, IMAGE_PATH } from '../../../config/image-path';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="bg-[#FBE7C1]">
          <div className="bg-white  rounded-[15] flex flex-col items-center w-fit p-5 mx-auto ">
            <div className="flex items-center">
              <div className="mx-5 ">
                <Image
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : userData.data.avatar
                        ? `${AVATAR_PATH}${userData.data.avatar}`
                        : '/avatar_default.png'
                  } //檔案>舊頭像>預設頭像
                  alt=""
                  height={100}
                  width={100}
                  className="rounded-full"
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden "
                />

                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="mt-2 bg-gray-200 hover:bg-gray-300 text-sm py-1 px-3 rounded mt-5"
                >
                  選擇新頭像
                </button>
              </div>
              <div>
                <h1 className="mt-1.5">顯示名稱</h1>
                <input
                  type="text"
                  placeholder={'尚未設定'}
                  value={userData.data.nickname || ''}
                  name="nickname"
                  onChange={handleFieldChange}
                  className="bg-[#FBE7C1] mt-1.5"
                />
                <h1 className="mt-1.5">全名(訂單顯示名稱)</h1>
                <input
                  type="text"
                  placeholder={'尚未設定'}
                  value={userData.data.fullName || ''}
                  name="fullName"
                  onChange={handleFieldChange}
                  className="bg-[#FBE7C1] mt-1.5"
                />
                <h1 className="mt-1.5">關於我</h1>
                <textarea
                  placeholder={'介紹你自己!'}
                  value={userData.data.description || ''}
                  name="description"
                  onChange={handleFieldChange}
                  className="bg-[#FBE7C1] mt-1.5"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#F2A922] px-10 py-0.5 rounded-xl text-white mt-5"
            >
              儲存
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
