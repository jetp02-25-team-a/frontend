'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthRequired, useAuth } from '../../../hooks/use-Auth';
import { API_SERVER } from '../../config/api-path';

interface OrderDetail {
  id: number;
  orderId: number;
  variantId: number;
  productAmount: number;
  subTotal: number; // 這是該商品在未折抵前的原始小計 (數量 * 單價)
}

interface EnrichedOrderDetail extends OrderDetail {
  productName: string;
  variantName: string;
  price: number;
}

// 原始訂單資料介面
interface OrderData {
  id: number;
  userId: number;
  orderTotal: number; // 這是扣除紅利後的最終支付金額
  tradeId: string;
  OrderDetails: OrderDetail[];
}

interface EnrichedOrderData extends Omit<OrderData, 'OrderDetails'> {
  OrderDetails: EnrichedOrderDetail[]; // 替換為擴展後的詳情類型
}

export default function OrderPage() {
  useAuthRequired();
  const { user } = useAuth();
  const [rawOrderData, setRawOrderData] = useState<OrderData[]>([]);
  const [enrichedData, setEnrichedData] = useState<EnrichedOrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 新增計算紅利點數的輔助函式
  const calculatePointsUsed = (order: EnrichedOrderData): number => {
    // 1. 計算原始總價 (所有商品的 subTotal 總和)
    const originalTotal = order.OrderDetails.reduce(
      (sum, detail) => sum + detail.subTotal,
      0
    );

    // 2. 點數折抵 = 原始總價 - 最終訂單總金額
    const pointsUsed = originalTotal - order.orderTotal;

    // 確保結果不為負數 (如果沒有折抵，則為 0)
    return Math.max(0, pointsUsed);
  };

  useEffect(() => {
    if (!user || !user.id) return;

    const getData = async () => {
      setIsLoading(true);
      try {
        // 1. 取得所有訂單
        const orderResponse = await fetch(
          `${API_SERVER}/order?user_id=${user.id}`
        );
        if (!orderResponse.ok) throw new Error('Failed to fetch orders');

        const orderJson = await orderResponse.json();
        if (!orderJson.success || !Array.isArray(orderJson.data)) {
          setRawOrderData([]);
          setEnrichedData([]);
          return;
        }

        const orders: OrderData[] = orderJson.data;
        setRawOrderData(orders);
        console.log('取得的原始訂單資料:', orders);

        const enrichedOrdersPromises = orders.map(async (order) => {
          const variantIds = Array.from(
            new Set(order.OrderDetails.map((detail) => detail.variantId))
          );
          const variantDetailsPromises = variantIds.map(async (variantId) => {
            const variantResponse = await fetch(
              `${API_SERVER}/variant/${variantId}`
            );
            const variantJson = await variantResponse.json();
            if (variantJson.success) {
              return {
                variantId: variantId,
                productName: variantJson.data.Product.productName,
                variantName: variantJson.data.variantName,
                price: variantJson.data.price,
              };
            }
            return {
              variantId: variantId,
              productName: '未知商品',
              variantName: '未知規格',
              price: 0,
            };
          });
          const variantDetails = await Promise.all(variantDetailsPromises);
          const variantMap = new Map(
            variantDetails.map((item) => [item.variantId, item])
          ); // 將取得的商品資訊合併到 OrderDetails

          const enrichedDetails: EnrichedOrderDetail[] = order.OrderDetails.map(
            (detail) => {
              const info = variantMap.get(detail.variantId);
              return {
                ...detail,
                productName: info ? info.productName : '未知商品',
                variantName: info ? info.variantName : '未知規格',
                price: info ? info.price : 0,
              };
            }
          );

          return {
            ...order,
            OrderDetails: enrichedDetails,
          };
        });

        const finalEnrichedData = await Promise.all(enrichedOrdersPromises);
        setEnrichedData(finalEnrichedData);
      } catch (error) {
        console.error('Error fetching order data:', error);
        setRawOrderData([]);
        setEnrichedData([]);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [user]); // 依賴 user

  console.log('Enriched Order Data:', enrichedData);

  return (
    <>
      <div className="min-h-[calc(100vh-354px-88px)] bg-[#FBE7C1] p-4">
        <h2 className="text-2xl font-bold mb-4">訂單紀錄</h2>
        {isLoading ? (
          <p>載入中...</p>
        ) : (
          <>
            {enrichedData.map((order) => {
              const pointsUsed = calculatePointsUsed(order); // 計算紅利點數
              return (
                <div
                  key={order.id}
                  className="bg-white p-4 my-4 rounded-lg shadow"
                >
                  <p className="font-semibold text-lg">
                    訂單編號: {order.tradeId}
                  </p>
                  <div>
                    <p className="mb-2 inline">總金額: ${order.orderTotal}</p>{' '}
                    <span>
                      花費紅利: {/* 🌟 顯示計算出的紅利點數 */}
                      <span>{pointsUsed}</span> 點
                    </span>
                  </div>
                  <hr className="my-2" />{' '}
                  <p className="font-medium">訂單內容:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    {order.OrderDetails.map((detail) => (
                      <li key={detail.id} className="text-sm">
                        <span className="font-bold text-blue-700">
                          {detail.productName}
                        </span>
                        ({detail.variantName}) - 單價: ${detail.price}- 數量:
                        {detail.productAmount} 份 - 小計: ${detail.subTotal}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
