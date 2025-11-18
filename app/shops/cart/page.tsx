'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, useAuthRequired } from '../../../hooks/use-Auth';
import { useCart } from '../../../hooks/use-Cart';
import { API_SERVER } from '../../config/api-path';
import CartCard from '../_components/cartCard';
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
  const { user, getAuthHeader } = useAuth();
  const { cart, addToCart, clearCart, removeFromCart } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [points, setPoints] = useState(0);
  const [pointUsedInput, setPointUsedInput] = useState<number | ''>('');
  const [finalPointUsed, setFinalPointUsed] = useState<number | ''>('');
  let totalprice = 0;
  let allProductNames = '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFinalPointUsed(pointUsedInput);

    const pointInput = e.currentTarget.elements.namedItem(
      'point'
    ) as HTMLInputElement;
    const pointUsedHiddenInput = e.currentTarget.elements.namedItem(
      'pointused'
    ) as HTMLInputElement;

    if (pointInput && pointUsedHiddenInput) {
      const usedValue = parseInt(pointInput.value) || 0;
      pointUsedHiddenInput.value = usedValue.toString();
    }
    clearCart();
    e.currentTarget.submit();
  };

  const handlePointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 限制輸入只能是數字
    const value = e.target.value.replace(/[^0-9]/g, '');

    if (value === '') {
      setPointUsedInput(''); // 如果用戶清空，我們設定為空字串，讓輸入框清空
      return;
    }

    // 限制不能超過用戶擁有的點數
    const maxPoints = points;
    let numericValue = parseInt(value) || 0;

    if (numericValue > maxPoints) {
      numericValue = maxPoints;
    }

    // 設置用戶輸入的值
    setPointUsedInput(numericValue);
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

  useEffect(() => {
    const getPoint = async () => {
      try {
        const data = await fetch(`${API_SERVER}/point`, {
          headers: {
            ...getAuthHeader(),
          },
        });
        const userPoint = await data.json();
        setPoints(userPoint.data.point);
      } catch (error) {}
    };
    getPoint();
  }, [user.id, getAuthHeader]);

  const isCartEmpty = !cart.items || cart.items.length === 0;
  const pointsToDeduct = pointUsedInput;
  const finalAmount = totalprice - pointsToDeduct;

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
              <span className="text-xl font-bold">原始總計</span>
              <span className="text-xl font-bold line-through">
                {totalprice}
              </span>
            </div>

            <div className="flex flex-row justify-between mt-2">
              <span className="text-xl font-bold">點數折抵</span>
              <span className="text-xl font-bold text-red-600">
                - {pointUsedInput}
              </span>
            </div>

            <hr className="my-4 border-t border-gray-500" />

            <div className="flex flex-row justify-between">
              <span className="text-2xl font-extrabold text-blue-800">
                應付總金額
              </span>
              <span className="text-2xl font-extrabold text-blue-800">
                {finalAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="mt-1">可用點數: {points}</p>
                <p className="mt-1">
                  使用
                  <input
                    type="number"
                    name="point"
                    className="ml-2 w-16 [&::-webkit-outer-spin-button]:appearance-none 
    [&::-webkit-inner-spin-button]:appearance-none
    [-moz-appearance:textfield] bg-white rounded-xs"
                    value={pointUsedInput}
                    onChange={handlePointInputChange}
                  />
                </p>
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
                  <input type="hidden" name="pointused" />
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
