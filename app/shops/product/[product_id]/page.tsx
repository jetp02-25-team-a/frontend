'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { API_SERVER } from '../../../config/api-path';
import Image from 'next/image';
import ProductCard from '../../_components/productCard';
import Slider from 'react-slick';
import { useCart } from '../../../../hooks/use-Cart';
import ShoppingCart from '../../_components/shoppingCart';

interface ProductVariant {
  id: number;
  productId: number;
  variantName: string;
  price: number;
  stock: number;
}

interface ProductPic {
  picId: number;
  src: string;
  productId: number;
}

interface ProductData {
  id: number;
  productName: string;
  keyword: string;
  description: string;

  ProductVariants: ProductVariant[];
  ProductPics: ProductPic[];
}

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

export default function IdPage() {
  const { product_id } = useParams();
  const { cart, addToCart } = useCart();
  const [data, setData] = useState<ProductData | undefined>();
  const [isloading, setIsloading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [rProduct, setrProduct] = useState<ProductData[] | undefined>();
  const [mainImageSrc, setMainImageSrc] = useState<string | undefined>(
    undefined
  );

  const productTab = data?.ProductVariants.map((item) => ({
    key: String(item.id),
    name: item.variantName,
    id: item.productId,
    variantID: item.id,
    price: item.price,
  }));

  const GridSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 0,
    rows: 2,
    slidesPerRow: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipe: false,
    draggable: false,
  };

  const getrProduct = async (keyword: string) => {
    try {
      const res = await fetch(`${API_SERVER}/keyword?keyword=${keyword}`);
      const data = await res.json();
      setrProduct(data.data);
    } catch (e) {}
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`${API_SERVER}/product/${product_id}`);
      const r = await response.json();
      setData(r.data);
      if (r.data && r.data.ProductVariants.length > 0) {
        setActiveTab(String(r.data.ProductVariants[0].id));
      }
      if (r.data && r.data.ProductPics.length > 0) {
        setMainImageSrc(r.data.ProductPics[0].src); // 將第一張圖片設為預設大圖
      }
    };
    try {
      getData();
    } catch (e) {
    } finally {
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    const word = data?.keyword.split(',');
    if (word) {
      getrProduct(word[0]);
    }
  }, [data]);

  const selectedPrice = productTab?.find((tab) => tab.key === activeTab)?.price;
  const selectedVariant = productTab?.find((tab) => tab.key === activeTab);
  const productID = selectedVariant?.id;
  const variantID = selectedVariant?.variantID;

  if (isloading) {
    return (
      <>
        <div>正在載入...</div>
      </>
    );
  }

  return (
    <>
      <div className="bg-[#FBE7C1]">
        <div className="flex pt-8 w-7/8 mx-auto ">
          <div className="w-5/8 flex flex-col items-center">
            {/* 大圖顯示區塊 */}
            <div className="relative w-full max-w-md h-96 mb-4  rounded-lg overflow-hidden">
              {mainImageSrc ? (
                <Image
                  src={mainImageSrc}
                  alt="產品主圖片"
                  fill={true} // 填滿父容器
                  style={{ objectFit: 'contain' }} // 保持圖片比例，不裁剪
                  priority // 優先載入主圖片
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                  無圖片可顯示
                </div>
              )}
            </div>

            {/* 小圖列表 */}
            <div className="flex flex-wrap justify-center gap-2">
              {' '}
              {data?.ProductPics.map((item) => {
                return (
                  <div
                    key={item.picId}
                    className={`relative w-20 h-20 cursor-pointer border rounded-md overflow-hidden ${
                      mainImageSrc === item.src
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setMainImageSrc(item.src)}
                  >
                    <Image
                      src={`${item.src}`}
                      alt="產品圖片縮圖"
                      fill={true} // 填滿父容器
                      style={{ objectFit: 'cover' }} // 裁剪以填滿
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-3/8 pt-4 flex flex-col h-100 justify-between">
            <p className="font-bold text-4xl">{data?.productName}</p>
            <div>
              <div className="flex space-x-4  pb-2 mb-4 ">
                {productTab?.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-4 transition duration-150 ease-in-out border rounded-xl hover:cursor-pointer ${
                      activeTab === tab.key
                        ? 'text-black  font-semibold bg-white' // 選中樣式
                        : 'text-gray-500 hover:text-black ' // 未選中樣式
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              <div className="text-xl font-bold ">
                <span>NT${selectedPrice}</span>
              </div>
              <button
                className="mt-6 p-1.5 border rounded-xl hover:cursor-pointer"
                onClick={() => {
                  if (productID && variantID) {
                    addToCart(productID, variantID);
                  }
                }}
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center my-16">
          {data?.description}
        </div>
        <div className="flex justify-center items-center my-16 text-3xl font-bold">
          <p className="">相似商品</p>
        </div>
        <div className="w-7/8  mx-auto h-fit ">
          <Slider {...GridSettings}>
            {rProduct?.map((item) => {
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
