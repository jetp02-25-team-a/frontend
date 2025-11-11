'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../../hooks/use-Cart';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';

interface data {
  id: number;
  productName: string;
  variantID: number;
  variantName: string;
  price: number;
}

export interface CartCardProps {
  id: number;
  amount: number;
  variantID: number;
  productName: string;
  variantName: string;
  price: number;
  picURL: string;
}

export default function CartCard({
  id,
  amount,
  variantID,
  variantName,
  price,
  picURL,
  productName,
}: CartCardProps) {
  const { addToCart, removeFromCart, cart } = useCart();

  return (
    <>
      <div className="flex flex-row w-4/5 mx-auto my-8">
        <div>
          <Image src={picURL} alt="產品圖片" height={200} width={150}></Image>
        </div>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="w-1/5 ml-3">
            <p>{productName}</p>
          </div>
          <div>
            <p>規格</p>
            <p className="mt-2">{variantName}</p>
          </div>
          <div>
            <p>NT${price}</p>
          </div>
          <div className="flex flex-row">
            <button onClick={() => removeFromCart(variantID, 1)}>-</button>
            <p>{amount}</p>
            <button onClick={() => addToCart(id, variantID)}>+</button>
          </div>
          <div>
            <p>NT${price * amount}</p>
          </div>
          <div>
            <button onClick={() => removeFromCart(variantID)}>
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
