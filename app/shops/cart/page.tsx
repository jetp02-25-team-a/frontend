'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAuthRequired } from '../../../hooks/use-Auth';
import { useCart } from '../../../hooks/use-Cart';
import { API_SERVER } from '../../config/api-path';
import { number } from 'zod';
import CartCard from '../_components/cartCard';

interface ProductVariants {
  id: number;
  productId: number;
  variantName: string;
  price: number;
  stock: number;
}

interface ProductPics {
  picId: number;
  src: string;
  productId: number;
}

interface Product {
  id: number;
  productName: string;
  keyword: string;
  description: string;
  ProductVariants: ProductVariants[];
  ProductPics: ProductPics[];
}

export default function CartPage() {
  useAuthRequired();
  const { cart, addToCart, clearCart, removeFromCart } = useCart();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const getData = async () => {
      // 每次執行時，先清空 items，以避免重複資料
      setItems([]);

      // 創建一個陣列來暫時儲存所有 Promise
      const dataPromises = (cart.items || []).map(async (item) => {
        try {
          const id = item.id;
          const response = await fetch(`${API_SERVER}/product/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseBody = await response.json();
          const data = responseBody.data;
          return data; // 返回產品物件
        } catch (error) {
          console.error('Fetch error:', error);
          return null; // 處理失敗情況
        }
      });

      // 使用 Promise.all 等待所有請求完成
      const allData = await Promise.all(dataPromises);

      // 過濾掉失敗的 null 值，並一次性設定 state
      setItems(allData.filter((data) => data !== null));
    };

    if (cart.items && cart.items.length > 0) {
      getData();
    } else {
      setItems([]); // 如果購物車為空，清空產品列表
    }
    // 修正 2: 將 cart.items 加入依賴項
  }, [cart.items]);
  const isCartEmpty = !cart.items || cart.items.length === 0;

  console.log(items);

  return (
    <>
      {isCartEmpty ? (
        // 購物車為空時顯示的提示訊息
        <div
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            textAlign: 'center',
          }}
        >
          <h3>您的購物車是空的！</h3>
          <p>快去選購一些喜歡的商品吧！</p>
        </div>
      ) : (
        // 購物車有東西時顯示的列表
        <ul>
          {cart.items?.map((cartItem) => {
            // 1. 查找匹配的產品詳細資料 (在 items state 中)
            const productDetail = items.find((p) => p.id === cartItem.id);

            // 2. 查找匹配的變體詳細資料 (在 productDetail.ProductVariants 陣列中)
            let variantDetail = null;
            if (productDetail) {
              variantDetail = productDetail.ProductVariants.find(
                (v) => v.id === cartItem.variant_id
              );
            }

            // 如果 productDetail 或 variantDetail 還沒載入或找不到，返回載入中
            if (!productDetail || !variantDetail) {
              return (
                <li key={cartItem.variant_id + '_loading'}>
                  載入產品資料中...
                </li>
              );
            }

            // 3. 渲染列表
            // return (
            //   <li key={cartItem.variant_id}>
            //     產品名: {productDetail.productName}
            //     變體: {variantDetail.variantName}
            //     單價: ${variantDetail.price}
            //     數量:
            //     <button
            //       onClick={() => removeFromCart(cartItem.variant_id, 1)}
            //       disabled={cartItem.amount <= 1}
            //     >
            //       -
            //     </button>
            //     {cartItem.amount}
            //     <button
            //       onClick={() => addToCart(cartItem.id, cartItem.variant_id)}
            //     >
            //       +
            //     </button>
            //     {/* 總計價格 */}
            //     小計: ${variantDetail.price * cartItem.amount}
            //     {/* 移除所有 */}
            //     <button onClick={() => removeFromCart(cartItem.variant_id)}>
            //       移除所有
            //     </button>
            //   </li>
            // );
            return (
              <CartCard
                key={cartItem.variant_id}
                productName={productDetail.productName}
                variantName={variantDetail.variantName}
                variantID={cartItem.variant_id}
                price={variantDetail.price}
                amount={cartItem.amount}
                picURL={productDetail.ProductPics[0].src}
              />
            );
          })}
        </ul>
      )}

      {/* 清空購物車*/}
      {!isCartEmpty && <button onClick={clearCart}>清空購物車</button>}
    </>
  );
}
