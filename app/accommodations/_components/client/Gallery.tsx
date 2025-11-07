import Image from 'next/image';
import React from 'react';

interface Props {
  className: string; // 確保 className 包含 width 和 height (或 aspect-ratio)
}

export default function GalleryRatio({ className }: Props) {
  return (
    // 總容器：尺寸由 className 決定，使用 Flex 排列，加上相對定位
    <div className={`flex relative gap-2.5 ${className}`}>
      <div
        className="absolute bottom-4 right-4 bg-[#05073c] rounded-full px-5 py-2.5 cursor-pointer z-10"
        style={{ width: '141px', height: '46px' }} // 可以保留或使用 Tailwind 尺寸類別
      >
        <div className="text-white font-semibold whitespace-nowrap">
          查看所有照片
        </div>
      </div>
      {/* 1. 左側大圖區塊：使用 flex-2 佔據更大的比例（例如 2/5 寬度） */}
      <div className="flex-3 relative">
        <Image
          src="https://picsum.photos/id/684/600/400"
          fill={true}
          alt="左側主圖"
          className="object-cover"
          sizes="60%"
          priority={true}
        />
      </div>

      {/* 2. 右側三圖區塊：使用 flex-3 佔據剩餘比例（例如 3/5 寬度），垂直排列 */}
      <div className="flex flex-2 flex-col gap-2.5">
        {/* A. 右上角圖片：使用 flex-1 佔據一半的垂直空間 */}
        <div className="flex-1 relative">
          <Image
            src="https://picsum.photos/id/613/600/400"
            fill={true}
            alt="右上圖"
            className="object-cover"
            sizes="40%"
            priority={true}
          />
        </div>

        {/* B. 右下兩圖區塊：使用 flex-1 佔據另一半的垂直空間，水平排列 */}
        <div className="flex flex-1 gap-2.5">
          {/* B1. 右下左圖：flex-1 佔據一半的水平空間 */}
          <div className="flex-1 relative">
            <Image
              src="https://picsum.photos/id/681/600/400"
              fill={true}
              alt="右下左圖"
              className="object-cover"
              sizes="50%"
              priority={true}
            />
          </div>

          {/* B2. 右下右圖：flex-1 佔據另一半的水平空間 */}
          <div className="flex-1 relative">
            <Image
              src="https://picsum.photos/id/134/600/400"
              fill={true}
              alt="右下右圖"
              className="object-cover"
              sizes="50%"
              priority={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
