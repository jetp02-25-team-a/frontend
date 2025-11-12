'use client';
import Button from '../_components/Button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { API_SERVER } from '../../config/api-path';

export default function UploadPhotosPage() {
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get('itineraryId');
  console.log('useParams==>', itineraryId);

  const router = useRouter();
  const [images, setImages] = useState(Array(6).fill(null)); // 6 張圖片

  const handleImageChange = async (e: any, index: number) => {
    const file = e.target.files[0]; // 選擇的檔案 通常只會有一張 所以用0
    if (!file) return;
    const previewUrl = URL.createObjectURL(file); //先把存在 e.target.files的照片拿來顯示
    // 前端即時預覽
    const updated = [...images];
    updated[index] = previewUrl;
    setImages(updated);
    //
    const url = `${API_SERVER}/itineraries/upload/${itineraryId}`;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('上傳成功:', data);

      // ✅ 若要更新後端圖片 URL：
      // updated[index] = data.url;
      // setImages(updated);
    } catch (err) {
      console.error('上傳失敗:', err);
    }
    //"/upload/:itineraryId",
  };

  return (
    <main className="py-16 flex flex-col gap-[30px]">
      <div>
        <h1 className="text-4xl text-center">設定揪團照片</h1>
        <p className="text-center">上傳相關照片</p>
      </div>
      {/* 圖片區域 */}
      <div className="flex flex-wrap gap-[50px] w-[1100px] m-auto">
        {images.map((img, index) => (
          <label key={index} className="cursor-pointer">
            {/* 預覽圖片區：若無上傳就顯示預設圖 */}
            <Image
              width={77}
              height={77}
              src={img || '/image_btn_default.png'}
              alt="preview"
              className="w-[150px] h-[150px] object-cover border rounded"
            />

            {/* 隱藏的 file input */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e, index)}
            />
          </label>
        ))}
      </div>
      {/* <div className="flex flex-wrap gap-[50px] w-[1100px] m-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <img
            key={index}
            src="/image_btn_default.png"
            alt=""
            className="cursor-pointer"
          />
        ))}
      </div> */}
      {/* 圖片區域end */}
      <div className="flex justify-center gap-[21px]">
        <Button content="回上一步" onClick={() => router.back()} />

        <Button
          content="下一步"
          onClick={() =>
            router.push(`/grabgroup/team-up-info-tmp/${itineraryId}`)
          }
        />
      </div>
    </main>
  );
}
