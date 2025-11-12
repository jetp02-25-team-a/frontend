'use client';

import Image from 'next/image';
import { useState } from 'react';
import GalleryModal from './GalleryModal';

interface GalleryDisplayProps {
  images: { id: number; url: string; caption?: string }[];
  className?: string; // 用來控制寬高或 aspect-ratio
  onViewAllClick?: () => void;
}

export default function GalleryDisplay({
  images,
  className,
  onViewAllClick,
}: GalleryDisplayProps) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const getImage = (index: number) => images[index] || null;
  // 固定容器大小，無論有無圖片
  return (
    <>
      {/* 主區塊 */}
      <div className={`flex relative gap-2.5 ${className}`}>
        {/* 查看所有照片按鈕 */}
        {images.length > 0 && (
          <button
            className="absolute bottom-4 right-4 bg-[#05073c] rounded-full px-5 py-2.5 cursor-pointer z-10"
            style={{ width: '141px', height: '46px' }}
            onClick={openModal}
          >
            <span className="text-white font-semibold whitespace-nowrap">
              查看所有照片
            </span>
          </button>
        )}

        {/* 左主圖 */}
        <div className="flex-[3] relative bg-gray-200 rounded-lg overflow-hidden">
          {getImage(0) ? (
            <Image
              src={getImage(0)!.url}
              alt={getImage(0)!.caption || ''}
              fill
              className="object-cover"
              sizes="60%"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              無主圖
            </div>
          )}
        </div>

        {/* 右側區塊 */}
        <div className="flex-[2] flex flex-col gap-2.5">
          {/* 右上圖 */}
          <div className="flex-1 relative bg-gray-200 rounded-lg overflow-hidden">
            {getImage(1) ? (
              <Image
                src={getImage(1)!.url}
                alt={getImage(1)!.caption || ''}
                fill
                className="object-cover"
                sizes="40%"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                空位
              </div>
            )}
          </div>

          {/* 右下兩圖 */}
          <div className="flex flex-1 gap-2.5">
            {[2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 relative bg-gray-200 rounded-lg overflow-hidden"
              >
                {getImage(i) ? (
                  <Image
                    src={getImage(i)!.url}
                    alt={getImage(i)!.caption || ''}
                    fill
                    className="object-cover"
                    sizes="50%"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    空位
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 彈出 */}
      {showModal && <GalleryModal images={images} onClose={closeModal} />}
    </>
  );
}
