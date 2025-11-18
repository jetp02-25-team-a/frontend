'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Slider from 'react-slick';
import { API_SERVER } from '../../../config/api-path';
import ProductCard from '../_components/productCard';
import ShoppingCart from '../_components/shoppingCart';
import { useCart } from '../../../hooks/use-Cart';
import { IoIosArrowForward } from 'react-icons/io';

export interface ProductPic {
  picId: number;
  src: string;
  productId: number;
}

export interface ProductVariant {
  id: number;
  productId: number;
  variantName: string;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  productName: string;
  keyword: string;
  description: string;

  ProductVariants: ProductVariant[];
  ProductPics: ProductPic[];
}

interface Meta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  meta: Meta;
}

const initMeta = {
  isFirstPage: true,
  isLastPage: false,
  currentPage: 1,
  previousPage: null,
  nextPage: 2,
  pageCount: 9,
  totalCount: 200,
};

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState<string | null>('');
  const [keywords, setKeywords] = useState([]);
  const [meta, setMeta] = useState<Meta>(initMeta);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const { cart } = useCart();
  const GridSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 0,
    rows: 4,
    slidesPerRow: 1,
    swipe: false,
    draggable: false,
  };

  const breadcrumbs = [
    { name: '商城首頁', href: '/shops' },
    { name: '所有產品', href: '/shops/product' },
  ];

  let displayedBreadcrumbs = [...breadcrumbs];

  if (keyword) {
    displayedBreadcrumbs.push({
      name: `${keyword}`,

      href: `/shops/product?${searchParams.toString()}`,
    });
  }

  const getProduct = async () => {
    setIsLoading(true);

    let url = `${API_SERVER}/product?page=${page}`;

    if (keyword) {
      const encodedKeyword = encodeURIComponent(keyword);
      url += `&keyword=${encodedKeyword}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      setProduct(data.product);
      setMeta(data.meta);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const getAllKeyword = async () => {
    try {
      const response = await fetch(`${API_SERVER}/allkeyword`);
      const data = await response.json();
      setKeywords(data.keyword);
    } catch (error) {
      console.log('1118');
    }
  };

  const handleKeywordClick = (word: string) => {
    if (keyword === word) {
      setKeyword('');
    } else {
      setKeyword(word);
    }

    setPage(1);

    setShowFilter(false);
  };

  useEffect(() => {
    getProduct();
  }, [page, keyword]);

  useEffect(() => {
    getAllKeyword();
    setKeyword(searchParams.get('keyword'));
  }, []);

  const handlePageChange = (newPage: number) => {
    // 檢查新頁碼是否在有效範圍內
    if (newPage >= 1 && newPage <= meta.pageCount) {
      setPage(newPage);
    }
  };

  const pageNumbers = Array.from({ length: meta.pageCount }, (_, i) => i + 1);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>產品資料載入中...</h2>
        {/* 您可以在這裡放一個轉圈圈的 loading spinner */}
      </div>
    );
  }

  return (
    <>
      <nav
        className="w-full bg-[#F2CEAE] h-16 flex justify-between items-center mb-8 px-25"
        aria-label="Breadcrumb"
      >
        <div>
          <ol className="flex items-center space-x-2">
            {displayedBreadcrumbs.map((crumb, index) => (
              <li key={crumb.name} className="flex items-center">
                <a
                  href={crumb.href}
                  className={`text-sm mr-2  font-medium ${index === displayedBreadcrumbs.length - 1 ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {crumb.name}
                </a>
                {/* 只有當它不是最後一個元素時才顯示分隔符 */}
                {index < displayedBreadcrumbs.length - 1 && (
                  <IoIosArrowForward />
                )}
              </li>
            ))}
          </ol>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setShowFilter(true)}
          onMouseLeave={() => setShowFilter(false)}
        >
          <div className="bg-white p-2.5 rounded-2xl">類別</div>

          <div
            className={`absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2 transition-opacity duration-200 ${
              showFilter ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            style={{ top: '100%', maxHeight: '300px', overflowY: 'auto' }} // 讓內容可以滾動
          >
            <div className="flex flex-col space-y-2">
              {/* 💡 清除所有篩選按鈕 */}
              <button
                onClick={() => handleKeywordClick('')} // 點擊時傳入空字串來清除篩選
                className={`w-full text-left px-3 py-1 text-sm rounded-md transition-colors ${
                  keyword === null
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                全部產品
              </button>

              {keywords.map((keywordItem) => (
                <button
                  key={keywordItem}
                  onClick={() => handleKeywordClick(keywordItem)}
                  className={`w-full text-left px-3 py-1 text-sm rounded-md transition-colors ${
                    keyword === keywordItem
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {keywordItem}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="flex items-center justify-center flex-col">
        <div className="w-7/8">
          <Slider {...GridSettings}>
            {product.map((item) => {
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
        <div className="flex mt-8 space-x-2 mb-8">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1} // 當前在第一頁時禁用
            className={`
              px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
              ${page === 1 ? 'bg-gray-400 text-gray-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300  hover:cursor-pointer'}
            `}
          >
            &lt;&lt;
          </button>
          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out 
                ${
                  p === page
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:cursor-pointer'
                }
              `}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(meta.pageCount)}
            disabled={page === meta.pageCount}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out 
              ${page === meta.pageCount ? 'bg-gray-400 text-gray-200 ' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:cursor-pointer'}`}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
      <ShoppingCart totalItems={cart.totalItems} />
    </>
  );
}
