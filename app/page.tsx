'use client';

import { useAuth } from '@/hooks/use-Auth';
import JoinButton from '../components/ui/join-button';
import { Roboto } from 'next/font/google';
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* 揪團 */}
      <section className="space-y-[105px] p-16">
        <div className="space-y-[30px]">
          <div className="flex gap-[50px]">
            <h1 className={`${roboto.className} text-[36px] font-bold`}>
              想揪團？直接邀請好友一起參加
            </h1>
            <JoinButton content="加入我們" />
          </div>
          <p>
            不必再用紙筆或聊天室零散討論，只要在線上就能即時編輯旅遊行程，把景點、美食、交通一次排好
          </p>
        </div>
        <div className="flex gap-[100px] justify-center">
          <div className="flex items-center gap-3 relative">
            <Image
              width={257}
              height={316}
              src="/images/Group 602.png"
              alt=""
              className="w-[257px] h-[316px]"
            />
            <Image
              width={139}
              height={139}
              src="/images/message.png"
              alt=""
              className="absolute left-35 bottom-25"
            />
            <Image
              width={247}
              height={399}
              src="/images/Group 603.png"
              alt=""
              className="w-[247px] h-[399px]"
            />
            <Image
              width={250}
              height={310}
              src="/images/Group 601.png"
              alt=""
              className="w-[250px] h-[310px]"
            />
            <Image
              width={139}
              height={139}
              src="/images/message.png"
              alt=""
              className="absolute left-150 bottom-25"
            />
          </div>
          <div className="flex flex-col w-[461px] gap-[30px]">
            <div>
              <h2 className="text-[32px]">周末小旅行、快速揪到夥伴</h2>
              <p className="text-xl te">
                想旅行、想吃美食？立即揪夥伴，一起安排住宿、交通、美食！
              </p>
            </div>

            <div className="flex w-full justify-between">
              {/* 1 */}
              <div className="flex flex-col items-center">
                <Image
                  width={71}
                  height={71}
                  src="/images/Frame 18.png"
                  alt=""
                  className="w-[71px] h-[71px]"
                />
                <p>美食</p>
              </div>
              {/* 2 */}
              <div className="flex flex-col items-center">
                <Image
                  width={71}
                  height={71}
                  src="/images/Frame 19.png"
                  alt=""
                  className="w-[71px] h-[71px]"
                />
                <p>美食</p>
              </div>
              {/* 3 */}
              <div className="flex flex-col items-center">
                <Image
                  width={71}
                  height={71}
                  src="/images/Frame 19.png"
                  alt=""
                  className="w-[71px] h-[71px]"
                />
                <p>美食</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
