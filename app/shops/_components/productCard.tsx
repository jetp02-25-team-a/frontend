'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../../hooks/use-Cart';

export interface ProductCardProps {
  productName: string;
  pictureURL: string;
  price: number;
  productId: number;
  variantId: number;
}

export default function ProductCard({
  productName,
  pictureURL,
  price,
  productId,
  variantId,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const itemToCart = (itemId: number, variantId: number) => {
    addToCart(itemId, variantId);
    return;
  };
  return (
    <>
      <div
        className="bg-[#F8D28C] rounded-xl overflow-hidden m-2"
        onMouseEnter={() => setIsHovered(true)} // 滑鼠進入
        onMouseLeave={() => setIsHovered(false)} // 滑鼠離開
      >
        <div className="relative w-full pt-[75%] mb-2">
          <Image
            src={pictureURL}
            alt="產品圖片"
            fill
            style={{ objectFit: 'cover' }}
          ></Image>
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isHovered ? 'opacity-30' : 'opacity-0'
            }`}
          ></div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={() => itemToCart(productId, variantId)}
              className="bg-white text-[#F8D28C] font-bold py-2 px-4 rounded-full shadow-xl hover:bg-gray-100 transition-colors duration-200"
            >
              加入購物車
            </button>
          </div>
        </div>
        <p className="mb-2 ml-3">{productName}</p>
        <p className="mb-2 ml-3">NT${price}</p>
      </div>
    </>
  );
}
