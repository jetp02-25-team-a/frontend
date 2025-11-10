'use client';
import Image from 'next/image';
import InfoButton from './InfoButton';
interface ChecklistProps {
  title: string;
  type: 'agree' | 'answer';
}

export default function Checklist({ title, type }: ChecklistProps) {
  return (
    <div className="bg-white flex items-center justify-between px-10 py-5 border-b-2 border-gray-300">
      {/* 團主個人訊息 */}
      <div className="flex items-center gap-5">
        <Image width={77} height={77} src={'/avatar.png'} alt="" />
        <div>
          <h3 className="text-xl">2222</h3>
          <InfoButton button_name="個人檔案" state="hollow" />
        </div>
      </div>
      <h2 className="text-2xl">{title}</h2>
      {type === 'answer' && (
        <InfoButton button_name="已加入團隊" state="solid" />
      )}
      {type === 'agree' && (
        <div className="flex gap-2.5">
          <InfoButton button_name="同意" state="solid" />
          <InfoButton button_name="不同意" state="hollow" />
        </div>
      )}
    </div>
  );
}
