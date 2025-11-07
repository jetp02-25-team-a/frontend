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
  const itemToCart = (itemId: number, variantId: number) => {
    addToCart(itemId, variantId);
    return;
  };
  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden m-2">
        <div className="relative w-full pt-[75%] ">
          <Image
            src={pictureURL}
            alt="產品圖片"
            fill
            style={{ objectFit: 'cover' }}
          ></Image>
        </div>
        <p>{productName}</p>
        <p>{price}</p>
        <button onClick={() => itemToCart(productId, variantId)}>
          加入購物車
        </button>
      </div>
    </>
  );
}
