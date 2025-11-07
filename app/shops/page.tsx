'use client';

import { API_SERVER } from '../config/api-path';
import React, { useState, useEffect } from 'react';
import { ApiResponse } from './_interfaces/data';
import { useCart } from '../../hooks/use-Cart';
import Slider from 'react-slick';
import ShoppingCart from './_components/shoppingCart';
import ProductCard from './_components/productCard';

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

  const settings = {
    dots: false, // 導航點
    infinite: true, // 無限循環
    speed: 500,
    slidesToShow: 4, // 一次顯示 4 張卡片
    slidesToScroll: 1, // 每次捲動 1 張卡片
    arrows: true,
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
      <div className="bg-[#FBE7C1] w-full">
        <div className="w-4/5  mx-auto">
          <Slider {...settings} className="p-4 ">
            {rProduct.data.map((item) => {
              return (
                <div key={item.id} className="slider-container w-90">
                  <ProductCard
                    productName={item.productName}
                    price={item.ProductVariants[0].price}
                    pictureURL={item.ProductPics[0].src}
                    productId={item.id}
                    variantId={item.ProductVariants[0].id}
                  />
                </div>
              );
            })}
          </Slider>
        </div>
        <ShoppingCart totalItems={cart.totalItems} />
      </div>
    </>
  );
}
