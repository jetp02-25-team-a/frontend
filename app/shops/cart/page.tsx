'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAuthRequired } from '../../../hooks/use-Auth';
import { useCart } from '../../../hooks/use-Cart';
import { API_SERVER } from '../../config/api-path';
import CartCard from '../_components/cartCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const { user } = useAuth();
  const { cart, addToCart, clearCart, removeFromCart } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  let totalprice = 0;
  let allProductNames = '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearCart();

    e.currentTarget.submit();
  };

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

  return (
    <>
      <div className="bg-[#FBE7C1] p-8">
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

              totalprice = totalprice + cartItem.amount * variantDetail.price;
              allProductNames += `${productDetail.productName} (${variantDetail.variantName}) x ${cartItem.amount}; `;

              return (
                <CartCard
                  key={variantDetail.id}
                  id={productDetail.id}
                  productName={productDetail.productName}
                  variantName={variantDetail.variantName}
                  variantID={variantDetail.id}
                  price={variantDetail.price}
                  amount={cartItem.amount}
                  picURL={productDetail.ProductPics[0].src}
                />
              );
            })}
          </ul>
        )}
        <div className="flex justify-center">
          <div className="bg-[#F8D28C] w-4/5 p-8">
            <div className="flex flex-row justify-between">
              <span className="text-xl font-bold">總計</span>
              <span className="text-xl font-bold">{totalprice}</span>
            </div>
            <div className="flex justify-between">
              <div>
                <button className="mt-8 p-1 px-6 border rounded-2xl mr-3">
                  折價券
                </button>
                <button className="mt-8 p-1 px-6 border rounded-2xl mr-3">
                  折價券
                </button>
                <button className="mt-8 p-1 px-6 border rounded-2xl mr-3">
                  折價券
                </button>
              </div>
              <div>
                <form
                  action={`${API_SERVER}/checkout`}
                  method="POST"
                  onSubmit={handleSubmit}
                >
                  <input type="hidden" name="total_price" value={totalprice} />
                  <input
                    type="hidden"
                    name="product_list"
                    value={allProductNames.trim()}
                  />
                  <input type="hidden" name="userid" value={user.id} />
                  {cart.items?.map((item, index) => {
                    return (
                      <div key={item.variant_id}>
                        <input
                          type="hidden"
                          name={`item_variant${index}`}
                          value={item.variant_id}
                        />
                        <input
                          type="hidden"
                          name={`item_amount${index}`}
                          value={item.amount}
                        />
                      </div>
                    );
                  })}
                  <button
                    type="submit"
                    className="mt-8 p-1 px-6 border rounded-2xl :hover {
  cursor: pointer}"
                  >
                    去結帳
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href={`http://localhost:3000/shops`}
            className="mt-8 p-1 px-6 border rounded-2xl"
          >
            回商城
          </Link>
        </div>
      </div>
    </>
  );
}
