'use client';

import React from 'react';
import Link from 'next/link';
import { PiShoppingCartSimpleBold } from 'react-icons/pi';

export interface ComponentsShoppingCartProps {
  totalItems: number;
}

export default function ShoppingCart({
  totalItems,
}: ComponentsShoppingCartProps) {
  return (
    <>
      <Link href={`/shops/cart`}>
        <div className="size-15 bg-[#F8D28C]  rounded-full flex items-center justify-center fixed bottom-50 right-10 ">
          <div className="bg-red-500 absolute top-0 right-0 rounded-full z-10 size-4 flex items-center justify-center ">
            <span className="text-white text-xs">{totalItems}</span>
          </div>
          <PiShoppingCartSimpleBold className="text-black size-10" />
        </div>
      </Link>
    </>
  );
}
