'use client';

import { useAuth } from '@/hooks/use-Auth';
import JoinButton from '../components/ui/join-button';
import Link from 'next/link';
import Image from 'next/image';
import { Roboto, Plus_Jakarta_Sans } from 'next/font/google';
import InputField from '../components/ui/input-field';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import AttractionCard from '../components/ui/attraction-card';
import FoodCard from '../components/ui/food-card';
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-roboto',
});
import { motion } from 'framer-motion';
import PostCard from '../components/ui/post-card';

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
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className={`text-[#181E4B] text-[60px] ${roboto.className} font-extrabold super-bold leading-[0.95] mt-2`}
          >
            <span className="text-[#FF5F57]">制訂你的</span>
            專屬行程。
          </motion.h2>
          <p>我們將美食、風景與行程串連，讓旅行回到最純粹的自由。</p>
          <InputField />
        </div>
        {/* 圖片區 */}
        <div className="relative w-[700px] shrink-0">
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={{ x: [15, 0, 0, 15] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-[#FB864B] rounded-full w-[30px] h-[30px] absolute right-30 top-0 z-10"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={{ x: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-[#53B2CC] rounded-full w-[51px] h-[51px] absolute right-25 top-120 z-10"></div>
          </motion.div>

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
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/images/item3.png"
              alt="item3"
              width={73}
              height={73}
              className="absolute left-[130px] top-6 z-10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="z-200"
          >
            <Image
              src="/images/item4.png"
              alt="item1"
              width={127}
              height={113}
              className="absolute mr-10 right-[30px] top-25 z-10"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/images/Group 593.png"
              alt="group593"
              width={950}
              height={674}
              className="absolute"
            />
          </motion.div>

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
            {/* 人 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }} // 只觸發一次，進入30%就開始
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Image
                width={257}
                height={316}
                src="/images/Group 602.png"
                alt=""
                className="w-[257px] h-[316px]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{
                type: 'spring',
                stiffness: 60,
                damping: 18,
                delay: 0.1,
              }}
            >
              <Image
                width={139}
                height={139}
                src="/images/message.png"
                alt=""
                className="absolute left-35 bottom-25"
              />
            </motion.div>
            {/* <Image
              width={139}
              height={139}
              src="/images/message.png"
              alt=""
              className="absolute left-[35px] bottom-[25px]"
            /> */}
            {/* 人 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }} // 只觸發一次，進入30%就開始
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                width={247}
                height={399}
                src="/images/Group 603.png"
                alt=""
                className="w-[247px] h-[399px]"
              />
            </motion.div>

            {/* 人 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} // 只觸發一次，進入30%就開始
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Image
                width={250}
                height={310}
                src="/images/Group 601.png"
                alt=""
                className="w-[250px] h-[310px]"
              />
            </motion.div>
            {/* message */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }} // 只觸發一次，進入30%就開始
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, delay: 1.4 }}
            >
              <Image
                width={139}
                height={139}
                src="/images/message.png"
                alt=""
                className="absolute left-150 bottom-25"
              />
            </motion.div>
            {/* message */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{
                type: 'spring',
                stiffness: 60,
                damping: 18,
                delay: 0.1,
              }}
            >
              <Image
                width={139}
                height={139}
                src="/images/message.png"
                alt=""
                className="absolute left-[380px] bottom-[80px]"
              />
            </motion.div>
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
                  src="/images/Frame 20.png"
                  alt=""
                  className="w-[71px] h-[71px]"
                />
                <p>住宿</p>
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
                <p>交通</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 尋找景點 */}
      <div className="bg-[url('/Banner.png')] bg-cover bg-center w-full h-[650px] px-[160px] py-[150px]">
        <div className="space-y-[112px]">
          <div className="flex justify-between">
            <h1
              className={`text-white text-[40px] ${jakarta.className} font-extrabold super-bold leading-[0.9] mb-0`}
            >
              快速了解當地景點
            </h1>
            <div className="flex gap-3">
              <button className="w-12 h-12 border-white border rounded-xl mr-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="text-3xl text-white"
                />
              </button>
              <button className="w-12 h-12 border-white border rounded-xl mr-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-3xl text-white"
                />
              </button>
            </div>
          </div>

          {/* 卡片區 */}
          <div className="flex gap-12">
            <div className="space-y-[103px]">
              <p className="text-white text-[20px]">
                想快速掌握一個城市的魅力嗎？我們為你精選最具代表性的地標與在地特色，從文化風情到自然景觀，一次帶你看懂當地精華。無論是短暫停留或深度探索，都能在這裡找到屬於你的完美起點。
              </p>
              <Link href="/place">
                <JoinButton content="瞭解更多" mode="white" />
              </Link>
            </div>

            <AttractionCard />
            <AttractionCard />
          </div>
        </div>
      </div>
      {/* 尋找美食 */}
      <div className="bg-[#F28066] h-[480px] p-16 flex">
        <div className="flex w-full justify-center gap-15">
          {/* 卡片區 */}
          <FoodCard
            imageUrl="/images (2).jpeg"
            title="金峰魯肉飯「必吃滷肉飯」"
            avatarUrl="/yi-wei-wei-xiao-de-ya-zhou-nu-xing-de-tu-xiang-ta-ji-hua-zai-bai-se-de-bei-jing-shang-zhan-zhe-xiang-zhesmth-zuo-bai-ri-meng-lian-shang-zi-man.jpg"
            address="台北市"
            className="-rotate-10"
          />
          <FoodCard
            imageUrl="/caption.jpg"
            title="師園鹽酥雞「師園雞排必嚐」"
            avatarUrl="/dai-yan-jing-de-ya-zhou-nan-ren-xiao-xiang-wei-xiao-de-lian-kao-jin.jpg"
            address="台北市"
            className="rotate-11 mt-10"
          />

          {/* 文字區 */}
          <div className="flex flex-col gap-[42px] w-[430px]">
            <h2
              className={`text-white  text-[40px] ${jakarta.className} font-extrabold super-bold`}
            >
              找美食？
            </h2>
            <p className="text-white text-[20px]">
              走訪每座城市的小巷，用味蕾發現藏在角落的驚喜美味，不只帶你旅行，更帶你尋找當地人最愛的隱藏版料理，跟著我們的腳步，用一口接一口的美食品味這座城市的故事。
            </p>
            <Link href="/place">
              <JoinButton content="立即出發" mode="white" />
            </Link>
          </div>
        </div>
      </div>
      {/* 旅行筆記 */}
      <div className="bg-gradient-to-b from-[#ffffff] to-[#FAE0AF] h-[703px] flex justify-center gap-[100px] p-16 m-aut">
        <PostCard
          imageUrl="/Rectangle 28.png"
          title="入住驚喜！在飯店裡吃到這道美味，讓我決定下次還要來"
          avatarUrl="/yi-wei-wei-xiao-de-ya-zhou-nu-ren.jpg"
          username="旅遊達人Le Meridien"
          content="這次入住 台北寒舍艾美酒店，原本只是想放鬆兩天，沒想到飯店餐廳的餐點完全超出預期！
尤其是那道 香煎干貝海鮮燉飯，一端上桌就香氣滿滿，干貝大顆又鮮甜，燉飯的米芯剛好、每一口都吸滿海鮮的鮮味，完全是水準以上的飯店料理。

另外必推他們的 手工麵包配奶油，是那種會讓你不小心吃掉兩輪的好吃程度😂
餐廳的採光很好、窗邊還能看到市景，邊吃邊放鬆超享受。

這次原本抱著「住飯店順便吃一下」的心情來，沒想到變成「為了吃飯店料理想再住一次」。
如果你剛好要找地方度假，真的可以考慮來這家飯店住一晚順便大吃一頓！"
          className=""
          like={true}
          response={5}
          view={20}
          time="Mar 15,2025"
        ></PostCard>
        {/* 文字區 */}
        <div className="flex flex-col w-[430px]">
          {/* 小照片靠右 */}
          <div className="w-[200px] h-auto relative  self-end ml-auto -mb-10">
            <Image
              width={200}
              height={228}
              sizes="100%"
              src="/Rectangle 65.png"
              alt=""
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-[30px]">
            <h2
              className={`text-black  text-[40px] ${jakarta.className} font-extrabold super-bold`}
            >
              旅遊筆記， <br />
              記錄每一次精彩旅程
            </h2>
            <p className="text-black text-[20px]">
              在我們的平台，你可以輕鬆建立專屬旅遊筆記，記錄每個景點、交通方式、住宿與美食體驗。無論是短途小旅行或長途規劃，都能把旅程完整整理，方便回顧與分享。
            </p>
            <Link href="/article" className="self-center">
              <JoinButton content="加入我們" mode="orange" />
            </Link>
          </div>
        </div>
      </div>
      {/* 尋找住宿 */}
      <div className="bg-[url('/stay.png')] w-full h-[717px] flex flex-col py-[150px] px-[160px] gap-[112px]">
        {/* 標題 */}
        <h2
          className={`text-white  text-[40px] ${jakarta.className} font-extrabold super-bold w-full`}
        >
          尋找優質住宿
        </h2>
        <div className="w-full flex justify-between">
          {/* 文字區 */}
          <div className="flex flex-col gap-[42px] w-[430px]">
            <p className="text-white text-[20px]">
              「想住得舒適，從挑對飯店開始」 <br />
              「旅行的品質，決定於住宿的選擇」 <br />「
              「找到理想的住宿，讓旅程瞬間升級」
            </p>
            <Link href="/accommodations">
              <JoinButton
                content="立即出發"
                mode="white"
                className="cursor-pointer"
              />
            </Link>
          </div>
          {/* 圖片區 */}
          <div className="flex gap-[20px]">
            <div className=" space-y-[24px] ">
              <div className="w-[184px] h-[240px] relative">
                <Image
                  src="/Rectangle 53.png"
                  alt=""
                  width={184}
                  height={240}
                  className="object-cover"
                />
              </div>
              <p className={`text-white text-[18px] ${roboto.className} `}>
                一望無際的海景
              </p>
            </div>
            <div className=" space-y-[24px]">
              <div className="w-[184px] h-[240px] relative">
                <Image
                  src="/Rectangle 54.png"
                  alt=""
                  width={184}
                  height={240}
                  className="object-cover"
                />
              </div>
              <p className={`text-white text-[18px] ${roboto.className} `}>
                房型寬敞明亮
              </p>
            </div>
            <div className=" space-y-[24px]">
              <div className="w-[184px] h-[240px] relative">
                <Image
                  src="/Rectangle 55.png"
                  alt=""
                  width={184}
                  height={240}
                  className="object-cover"
                />
              </div>
              <p className={`text-white text-[18px] ${roboto.className} `}>
                戶外泳池視野開闊
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 商城 */}
      <div className="w-full flex flex-col gap-[50px] py-16">
        {/* 文字區 */}
        <div className="flex w-[1290px] self-center items-center gap-[30px]">
          <Link href="/shops">
            <JoinButton content="前往商城" mode="orange" />
          </Link>
          <div className="flex flex-col gap-5">
            <h2
              className={`text-black  text-[36px] ${jakarta.className} font-extrabold super-bold w-full`}
            >
              買好物，帶你玩遍台灣！
            </h2>
            <p className="text-gray-600 text-[20px]">
              「不必再用紙筆或聊天室零散討論，只要在線上就能即時編輯旅遊行程，把景點、美食、交通一次排好
            </p>
          </div>
        </div>
        {/* 廣告區 */}
        <div className="relative self-center">
          <div className="w-[1290px] h-[320px] relative mt-10  flex items-start">
            <Image
              src="/20251113600x3002.jpg"
              alt=""
              fill
              className="object-cover object-top w-full h-full"
            />
          </div>
          <div className="absolute -top-8 right-0">
            <div className="relative h-[390px] w-[550px]">
              <Image
                src="/osen.png"
                alt=""
                fill
                className="object-cover object-top w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* 優惠 */}
        <div className="bg-[#F28066] flex justify-between items-center w-[1290px] h-[162px] self-center rounded-2xl p-10">
          <h2 className="text-white">「提前預訂優惠高達 50%！」</h2>
          <button className="bg-white p-4 rounded-2xl">Book Now</button>
        </div>
      </div>
    </>
  );
}
