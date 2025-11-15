'use client';

import React, { useState, useEffect } from 'react';
import { useAuthRequired, useAuth } from '../../../hooks/use-Auth';
import { API_SERVER } from '../../config/api-path';

interface OrderData {
  id: number;
  userId: number;
  orderTotal: number;
  tradeId: string;
  OrderDetails: OrderDetail[];
}

interface OrderDetail {
  id: number;
  orderId: number;
  variantId: number;
  productAmount: number;
  subTotal: number;
}

export default function OrderPage() {
  useAuthRequired();
  const { user } = useAuth();
  const [data, setData] = useState<OrderData[]>([]);

  useEffect(() => {
    if (!user || !user.id) return;

    const getData = async () => {
      try {
        const response = await fetch(`${API_SERVER}/order?user_id=${user.id}`);

        if (response.ok) {
          const parsedData = await response.json();

          if (parsedData.success && Array.isArray(parsedData.data)) {
            console.log('取得的訂單資料:', parsedData.data);
            setData(parsedData.data);
          } else {
            setData([]);
          }
        } else {
          setData([]);
        }
      } catch (error) {
        setData([]);
      }
    };

    getData();
  }, [user]);
  console.log(data);

  return (
    <>
      <div className="min-h-[calc(100vh-354px-88px)] bg-[#FBE7C1] p-4">
        <h2 className="text-2xl font-bold mb-4">訂單紀錄</h2>
        <p>已載入 {data.length} 筆訂單。</p>

        {/* 範例：渲染訂單列表 */}
        {data.map((order) => (
          <div key={order.id} className="bg-white p-4 my-2 rounded-lg shadow">
            <p className="font-semibold">訂單 ID: **{order.id}**</p>
            <p>總金額: **{order.orderTotal}**</p>
            <p>交易編號: {order.tradeId}</p>
            <ul className="list-disc ml-5 mt-2">
              {order.OrderDetails.map((detail) => (
                <li key={detail.id}>
                  Variant ID **{detail.variantId}**: {detail.productAmount}{' '}
                  份，小計 {detail.subTotal}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
