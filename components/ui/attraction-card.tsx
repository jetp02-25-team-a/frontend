'use client';

import Avatar from './avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Roboto, Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-roboto',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-jakarta',
});

export default function AttractionCard() {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 w-[780px]">
      <div className="border-2 border-white rounded-full relative w-20 h-20 overflow-hidden -mt-20">
        <Image fill src="/avatar.png" alt="Avatar" />
      </div>
      <div className="flex justify-between">
        <div className="space-y-2.5">
          <h3
            className={`text-black text-4 ${jakarta.className} font-extrabold super-bold leading-[0.9] mb-0`}
          >
            林佑恩
          </h3>
          <p className="text-gray-500 text-sm">新北市</p>
        </div>

        {/* star */}
        <div>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <FontAwesomeIcon
                icon={faStar}
                key={index}
                className="text-[#FFC452]"
              />
            ))}
        </div>
      </div>
      <p>
        大稻埕散步
        昨天去大稻埕走了一圈，真的好喜歡那邊的老房子跟咖啡廳的氛圍。夕陽從淡水河那邊照過來時，整條街都變金色的，很不像在市區，反而有一種穿越時空的感覺。
      </p>
    </div>
  );
}
