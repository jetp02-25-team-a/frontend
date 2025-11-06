'use client';

import { API_SERVER } from '../config/api-path';
import { useState, useEffect } from 'react';
import { ApiResponse } from './_interfaces/data';
import { useCart } from '../../hooks/use-Cart';
import ShoppingCart from './_components/shoppingCart';

const rProductinit: ApiResponse = {
  success: false,
  data: [],
};

export default function M6Page() {
  const { cart, addToCart } = useCart();
  //資料存放
  const [rProduct, setrProduct] = useState(rProductinit);

  //資料拿取
  const getProduct = async () => {
    try {
      const res = await fetch(`${API_SERVER}/recommend`);
      const data = await res.json();
      setrProduct(data);
    } catch (e) {}
  };

  const itemToCart = (itemId: number, variantId: number) => {
    addToCart(itemId, variantId);
    return;
  };

  //進入網頁讀取
  useEffect(() => {
    getProduct();
  }, []);
  return (
    <>
      <div className="bg-[#FBE7C1]">
        <div>
          <ul>
            {rProduct.data.map((item) => {
              return (
                <li key={item.id}>
                  {item.productName}
                  <br />
                  <button
                    onClick={() =>
                      itemToCart(item.id, item.ProductVariants[0].id)
                    }
                  >
                    add to cart
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>{JSON.stringify(cart)}</div>
        <ShoppingCart totalItems={cart.totalItems} />
      </div>
    </>
  );
}
