'use client';
import Image from 'next/image';

interface PanelCardProps {
  image: string;
  title: string;
  address: string;
}

export default function PanelCard({ image, title, address }: PanelCardProps) {
  return (
    <>
      <div className="w-full bg-white  h-[97px] flex gap-2.5 p-2.5 active:shadow-[0_0_15px_5px_rgba(250,250,250,0.7)] shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
        <Image width={77} height={77} src={image} alt=""></Image>
        <div className="w-full">
          <h2>{title}</h2>
          <p>{address.length > 20 ? address + '...' : address}</p>
        </div>
      </div>
    </>
  );
}
