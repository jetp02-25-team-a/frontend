'use client';

import PanelCard from './_components/panel-card';
import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const data = [
  {
    id: 1,
    title: '台北101',
    address: '110臺北市信義區市府路45 號',
    image: 'image.png',
  },
  {
    id: 2,
    title: '台北101',
    address: '110臺北市信義區市府路45 號',
    image: 'image.png',
  },
  {
    id: 3,
    title: '台北101',
    address: '110臺北市信義區市府路45 號',
    image: 'image.png',
  },
  {
    id: 4,
    title: '台北101',
    address: '110臺北市信義區市府路45 號',
    image: 'image.png',
  },
];
export default function PanelPage() {
  return (
    <>
      <div className="w-full flex items-center border-2 border-gray-300 rounded-full w-full space-x-[15px] px-5 py-2.5">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input type="text" className="w-full" placeholder="搜尋景點" />
      </div>
      <div className="w-full flex flex-col gap-2.5 my-2.5">
        {data.map((card, index) => {
          return (
            <Link key={index} href={`./panel/${card.address}`}>
              <PanelCard
                image={`/${card.image}`}
                title={card.title}
                address={card.address}
              />
            </Link>
          );
        })}
      </div>
    </>
  );
}
