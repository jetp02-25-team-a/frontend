'use client';
import RegularButton from '@/components/ui/regular-button';

export default function ResponseBox() {
  return (
    <>
      <h2 className="text-3xl">回應</h2>
      <textarea
        placeholder="輸入您想留下的內容"
        className="w-[850px] h-[166px] rounded-2xl border-2 border-gray-400 p-4  text-xl"
      />
      <RegularButton content="回應" />
    </>
  );
}
