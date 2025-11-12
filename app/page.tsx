'use client';

import { useAuth } from '@/hooks/use-Auth';
import JoinButton from '../components/ui/join-button';
import Link from 'next/link';
import Image from 'next/image';
import { Roboto, Plus_Jakarta_Sans } from 'next/font/google';
import InputField from '../components/ui/input-field';
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

export default function Home() {
  return (
    <>
      {/* 建立個人行程 */}
      <div className=" w-full h-[600px] flex justify-center mt-[60px]">
        {/* 輸入文字區 */}
        <div className="flex flex-col gap-6">
          <h1
            className={`text-[#181E4B] text-[76px] ${jakarta.className} font-extrabold super-bold leading-[0.9] mb-0`}
          >
            說走就走
          </h1>
          <h1
            className={`text-[#181E4B] text-[76px] ${jakarta.className} font-extrabold super-bold leading-[0.9] mt-0 mb-2`}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;隨心旅行
          </h1>
          <h2
            className={`text-[#181E4B] text-[60px] ${roboto.className} font-extrabold super-bold leading-[0.95] mt-2`}
          >
            <span className="text-[#FF5F57]">制訂你的</span>專屬行程。
          </h2>
          <p>我們將美食、風景與行程串連，讓旅行回到最純粹的自由。</p>
          <InputField />
        </div>
        {/* 圖片區 */}
        <div className="relative w-[700px] shrink-0">
          <div className="bg-[#FB864B] rounded-full w-[30px] h-[30px] absolute right-30 top-0 z-10"></div>
          <div className="bg-[#53B2CC] rounded-full w-[51px] h-[51px] absolute right-25 top-120 z-10"></div>

          <Image
            src="/images/item1.png"
            alt="item1"
            width={127}
            height={113}
            className="absolute mr-10 right-[30px] top-70 z-10"
          />
          <Image
            src="/images/item2.png"
            alt="item2"
            width={120}
            height={120}
            className="absolute left-[30px] top-80 z-10"
          />
          <Image
            src="/images/item3.png"
            alt="item3"
            width={73}
            height={73}
            className="absolute left-[130px] top-6 z-10"
          />
          <Image
            src="/images/item4.png"
            alt="item1"
            width={127}
            height={113}
            className="absolute mr-10 right-[30px] top-25 z-10"
          />
          <Image
            src="/images/Group 593.png"
            alt="group593"
            width={950}
            height={674}
            className="absolute"
          />
          <div
            className="absolute w-[416] h-[416] rounded-full blur-2xl -ml-40 mt-50
  bg-[radial-gradient(circle_at_center,rgba(254,188,47,0.5)_0%,rgba(254,188,47,0.3)_60%,rgba(255,255,255,255)_100%)] -z-10"
          ></div>
        </div>
      </div>
      {/* 揪團 */}
      <div className="space-y-[105px] p-16">
        <div className="space-y-[30px]">
          <div className="flex gap-[50px]">
            <h1 className={`${roboto.className} text-[36px] font-bold`}>
              想揪團？直接邀請好友一起參加
            </h1>
            <Link href="/grabgroup/team-up">
              <JoinButton content="加入我們" />
            </Link>
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
              width={139}
              height={139}
              src="/images/message.png"
              alt=""
              className="absolute left-[35px] bottom-[25px]"
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
            <Image
              width={139}
              height={139}
              src="/images/message.png"
              alt=""
              className="absolute left-[150px] bottom-[25px]"
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
      </div>
    </>
  );
}
