'use client';

import { API_SERVER } from '../config/api-path';
import React, { useState, useEffect } from 'react';
import { ApiResponse } from './_interfaces/data';
import { useCart } from '../../hooks/use-Cart';
import Slider from 'react-slick';
import ShoppingCart from './_components/shoppingCart';
import ProductCard from './_components/productCard';
import Link from 'next/link';
import Image from 'next/image';
import { GrLinkNext } from 'react-icons/gr';

const ProductInit: ApiResponse = {
  success: false,
  data: [],
};

type TabKey = 'hot' | 'new' | 'recommend';

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    ></div>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
}

export default function M6Page() {
  const { cart } = useCart();
  //資料存放
  const [rProduct, setrProduct] = useState(ProductInit);
  const [nProduct, setnProduct] = useState(ProductInit);
  const [hProduct, sethProduct] = useState(ProductInit);

  const [activeTab, setActiveTab] = useState<TabKey>('hot');

  //資料拿取
  const getrProduct = async () => {
    try {
      const res = await fetch(`${API_SERVER}/recommend`);
      const data = await res.json();
      setrProduct(data);
    } catch (e) {}
  };
  const getnProduct = async () => {
    try {
      const res = await fetch(`${API_SERVER}/new`);
      const data = await res.json();
      setnProduct(data);
    } catch (e) {}
  };
  const gethProduct = async () => {
    try {
      const res = await fetch(`${API_SERVER}/hot`);
      const data = await res.json();
      sethProduct(data);
    } catch (e) {}
  };

  const settings = {
    dots: true, // 導航點
    infinite: true, // 無限循環
    speed: 500,
    slidesToShow: 6, // 每次顯示
    slidesToScroll: 6, // 每次捲動
    arrows: true,
    draggable: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const GridSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 0,
    rows: 4,
    slidesPerRow: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipe: false,
    draggable: false,
  };

  const tabs: { key: TabKey; name: string }[] = [
    { key: 'hot', name: '熱門商品' },
    { key: 'new', name: '最新商品' },
    { key: 'recommend', name: '推薦商品' },
  ];

  const displayData = () => {
    switch (activeTab) {
      case 'hot':
        return hProduct.data;
      case 'new':
        return nProduct.data;
      case 'recommend':
        return rProduct.data;
      default:
        return rProduct.data;
    }
  };

  //進入網頁讀取
  useEffect(() => {
    getrProduct();
    getnProduct();
    gethProduct();
  }, []);
  return (
    <>
      <div className="h-120 w-full relative">
        <Image
          src={`/shop-top.jpg`}
          alt="橫幅"
          className="object-cover w-full object-top"
          fill={true}
        ></Image>
      </div>
      <div className="bg-white w-full  pt-8 pb-8">
        <div className="w-7/8  mx-auto h-90 ">
          <h1 className="text-4xl font-bold text-center mb-8">推薦商品</h1>
          <Slider {...settings}>
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
        <h1 className="text-4xl font-bold text-center mt-16">更多商品</h1>
        <div className="flex justify-center mb-8 space-x-4 mt-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                  text-3xl font-bold p-2 transition-colors duration-200 
                  ${
                    activeTab === tab.key
                      ? 'text-black border-b-4 border-black' // 選中樣式
                      : 'text-gray-500 hover:text-gray-700' // 未選中樣式
                  }
                `}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="w-7/8  mx-auto h-fit ">
          <Slider {...GridSettings}>
            {displayData().map((item) => {
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
        <Link href={'/shops/product'}>
          <h1 className="text-4xl font-bold text-center mt-16 flex items-center justify-center space-x-2 ">
            所有商品
            <GrLinkNext />
          </h1>
        </Link>
        <ShoppingCart totalItems={cart.totalItems} />
      </div>
    </>
  );
}
