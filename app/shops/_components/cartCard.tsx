'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../../hooks/use-Cart';
import Image from 'next/image';

export interface CartCardProps {
  productName: string;
  variantName: string;
  price: number;
  amount: number;
  picURL: string;
  variantID: number;
}

export default function CartCard({
  productName,
  price,
  amount,
  variantName,
  picURL,
  variantID,
}: CartCardProps) {
  const { addToCart, removeFromCart, cart } = useCart();
  return (
    <>
      <div className="flex flex-row ">
        <Image src={picURL} alt="產品圖片" height={200} width={150}></Image>
        <p>{productName}</p>
        <p>{variantName}</p>
        <p>{price}</p>
        <p>{amount}</p>
      </div>
    </>
  );
}
