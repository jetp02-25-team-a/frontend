'use client';

import Image from 'next/image';
import { useState } from 'react';
import GalleryModal from './GalleryModal';

interface GalleryDisplayProps {
  images: { id: number; url: string; caption?: string }[];
  className?: string;
}

export default function GalleryDisplay({
  images,
  className,
}: GalleryDisplayProps) {
  const [showModal, setShowModal] = useState(false);

  const getImage = (index: number) => images[index] || null;

  const Skeleton = ({ text }: { text?: string }) => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
      {text && <span className="text-gray-400">{text}</span>}
    </div>
  );

  return (
    <>
      <div className={`flex relative gap-2.5 ${className}`}>
        {/* 查看所有照片按鈕 */}
        {images.length > 0 && (
          <button
            className="absolute bottom-4 right-8 bg-[#05073c] rounded-full px-5 py-2.5 cursor-pointer z-10"
            onClick={() => setShowModal(true)}
          >
            <span className="text-white font-semibold whitespace-nowrap">
              查看所有照片
            </span>
          </button>
        )}

        {/* 1 張 → 滿版 */}
        {images.length === 1 && (
          <div className="flex-1 relative rounded-lg overflow-hidden">
            {getImage(0) ? (
              <Image
                src={getImage(0)!.url}
                alt={getImage(0)!.caption || ''}
                fill
                className="object-cover"
                sizes="100%"
                priority
              />
            ) : (
              <Skeleton text="無主圖" />
            )}
          </div>
        )}

        {/* 2 張 → 左主圖 + 右上圖 */}
        {images.length === 2 && (
          <>
            <div className="flex-3 relative rounded-lg overflow-hidden">
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
                <Skeleton text="無主圖" />
              )}
            </div>
            <div className="flex-2 relative rounded-lg overflow-hidden">
              {getImage(1) ? (
                <Image
                  src={getImage(1)!.url}
                  alt={getImage(1)!.caption || ''}
                  fill
                  className="object-cover"
                  sizes="40%"
                />
              ) : (
                <Skeleton text="空位" />
              )}
            </div>
          </>
        )}

        {/* 3 張 → 左主圖 + 右上下兩張 */}
        {images.length === 3 && (
          <>
            <div className="flex-3 relative rounded-lg overflow-hidden">
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
                <Skeleton text="無主圖" />
              )}
            </div>
            <div className="flex-2 flex flex-col gap-2.5">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex-1 relative rounded-lg overflow-hidden"
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
                    <Skeleton text="空位" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ≥4 張 → 原本的 1+3 排版 */}
        {images.length >= 4 && (
          <>
            <div className="flex-3 relative rounded-lg overflow-hidden">
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
                <Skeleton text="無主圖" />
              )}
            </div>
            <div className="flex-2 flex flex-col gap-2.5">
              <div className="flex-1 relative rounded-lg overflow-hidden">
                {getImage(1) ? (
                  <Image
                    src={getImage(1)!.url}
                    alt={getImage(1)!.caption || ''}
                    fill
                    className="object-cover"
                    sizes="40%"
                  />
                ) : (
                  <Skeleton text="空位" />
                )}
              </div>
              <div className="flex flex-1 gap-2.5">
                {[2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 relative rounded-lg overflow-hidden"
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
                      <Skeleton text="空位" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <GalleryModal images={images} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
