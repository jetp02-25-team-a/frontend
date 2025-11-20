'use client';

import Avatar from './avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Roboto, Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import { AVATAR_PATH } from '../../config/image-path';
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

interface AttractionCardProps {
  avatar: string;
  name: string;
  city: string;
  content: string;
}

export default function AttractionCard({
  avatar,
  name,
  city,
  content,
}: AttractionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col gap-6 w-[780px]">
      <div className="border-2 border-white rounded-full relative w-20 h-20 overflow-hidden -mt-20">
        <Image fill src={`/${avatar}`} alt="Avatar" />
      </div>
      <div className="flex justify-between">
        <div className="space-y-2.5">
          <h3
            className={`text-black text-4 ${jakarta.className} font-extrabold super-bold leading-[0.9] mb-0`}
          >
            {name}
          </h3>
          <p className="text-gray-500 text-sm">{city}</p>
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
      <p>{content}</p>
    </div>
  );
}
