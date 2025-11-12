'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface GalleryModalProps {
  images: { id: number; url: string; caption?: string }[];
  initialIndex?: number;
  onClose: () => void;
}

export default function GalleryModal({
  images,
  initialIndex = 0,
  onClose,
}: GalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* 主圖區 */}
      <div
        className="relative w-[90vw] h-[75vh] mb-6 flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 左半邊點擊區 */}
        <div
          className="flex-1 flex items-center justify-start cursor-pointer group"
          onClick={handlePrev}
        >
          <FaChevronLeft className="text-white text-4xl opacity-70 group-hover:opacity-100 ml-6" />
        </div>

        {/* 主圖 */}
        <div className="flex-[8] relative">
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].caption || ''}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        {/* 右半邊點擊區 */}
        <div
          className="flex-1 flex items-center justify-end cursor-pointer group"
          onClick={handleNext}
        >
          <FaChevronRight className="text-white text-4xl opacity-70 group-hover:opacity-100 mr-6" />
        </div>
      </div>

      {/* 小圖預覽區 */}
      <div
        className="flex gap-2 overflow-x-auto px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`w-24 h-16 relative cursor-pointer border ${
              idx === currentIndex ? 'border-white' : 'border-transparent'
            }`}
            onClick={() => handleSelect(idx)}
          >
            <Image
              src={img.url}
              alt={img.caption || ''}
              fill
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
