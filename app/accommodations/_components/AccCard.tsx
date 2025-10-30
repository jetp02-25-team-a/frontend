'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

// export interface ComponentsAccCardProps {}

export default function ComponentsAccCard() {
  return (
    <>
      <div
        className="
      flex flex-col overflow-hidden             {/* 1. 佈局 */}
      w-[266px] h-[384px] gap-[10px]           {/* 3. 大小 */}
      rounded-2xl bg-white customize_shadow     {/* 5. 外觀/效果 */}
      group                                     {/* 6. 互動性 */}
    "
      >
        {/* 1. 圖片區塊 */}
        <div className="w-full h-[256px] bg-amber-100"></div>

        {/* 2. 內容/資訊區塊 */}
        <div className="flex w-full flex-1 bg-amber-300">
          {/* 2a. 左側資訊欄 */}
          <div
            className="
                flex flex-col justify-between h-full   {/* 1. 佈局 */}
                w-[211px]                               {/* 3. 大小 */}
                bg-blue-100 px-[10px] py-[15px]         {/* 5. 外觀/效果 */}
            "
          >
            {/* 酒店名稱 */}
            <div className="w-full break-words bg-rose-400">
              {/* 排版類別 */}
              <span className="font-sans text-xl font-black">
                超級無敵大飯店
              </span>
            </div>

            {/* 地點資訊區塊 */}
            <div className="flex gap-[8px] items-center bg-rose-300">
              <div>
                <FontAwesomeIcon icon={faLocationDot} size="lg" color="navy" />
              </div>
              <div>
                <span className="text-base">dddddd</span>
              </div>
            </div>
          </div>

          {/* 2b. 右側愛心欄 */}
          <div
            className="
                flex flex-1 justify-center h-full  {/* 1. 佈局 */}
                bg-blue-300 pt-[15px]               {/* 5. 外觀/效果 */}
            "
          >
            <FontAwesomeIcon
              icon={faHeart}
              size="lg"
              style={{ color: '#f92f2f' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
