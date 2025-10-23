"use client";
import InputField from "./_components/InputField";
import TourCard from "./_components/TourCard";
import AreaButton from "./_components/AreaButton";

export default function TeamUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-[30px] items-center py-[64px]  px-[64px]">
        <h1 className="text-4xl">一起加入旅程</h1>
        <div className="bg-gray-200 h-[2px] w-full"> </div>
        <div className="p-[60px] space-y-[30px]">
          <p className="customize_text_gray text-center">
            我們能依照您的時間、交通方式、旅行類型建立您的行程
          </p>
          <InputField></InputField>
        </div>

        <h1 className="text-4xl">熱門景點</h1>
        <div className="bg-gray-200 h-[2px] w-full"></div>
        <div className=" flex flex-col gap-[30px]">
          {/* 顯示不同區域 */}
          {children}
        </div>
      </div>
    </>
  );
}
