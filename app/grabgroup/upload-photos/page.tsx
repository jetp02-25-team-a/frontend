'use client';
import Button from '../_components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPhotosPage() {
  const router = useRouter();
  return (
    <main className="py-16 flex flex-col gap-[30px]">
      <div>
        <h1 className="text-4xl text-center">設定揪團照片</h1>
        <p className="text-center">上傳相關照片</p>
      </div>

      <div className="flex flex-wrap gap-[50px] w-[1100px] m-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <img
            key={index}
            src="/image_btn_default.png"
            alt=""
            className="cursor-pointer"
          />
        ))}
      </div>
      <div className="flex justify-center gap-[21px]">
        <Button content="回上一步" onClick={() => router.back()} />

        <Link href="/grabgroup/group-itinerart-detal">
          <Button content="下一步" />
        </Link>
      </div>
    </main>
  );
}
