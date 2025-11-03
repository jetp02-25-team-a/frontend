'use client';

import { API_SERVER } from '../config/api-path';
import { useState, useEffect } from 'react';
import { ApiResponse } from './_interfaces/data';

const rProductinit: ApiResponse = {
  success: false,
  data: [],
};

export default function M6Page() {
  //資料存放
  const [rProduct, setrProduct] = useState(rProductinit);

  //資料拿取
  const readProduct = async () => {
    try {
      const res = await fetch(`${API_SERVER}/recommend`);
      const data = await res.json();
      setrProduct(data.data);
    } catch (e) {}
  };

  //進入網頁讀取
  useEffect(() => {
    readProduct();
  }, []);
  return (
    <>
      <ul>
        {rProduct.data.map((item) => {
          return <li key={item.id}>{item.productName}</li>;
        })}
      </ul>
    </>
  );
}
