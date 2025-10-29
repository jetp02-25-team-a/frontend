'use client';
import Link from 'next/link';

export default function SidebarActions() {
  return (
      <div className="flex justify-center gap-8 mt-10">
      {/* 左側選單 */}
      <aside className="px-6 py-6 flex flex-col gap-6 text-3xl text-amber-200 bg-amber-100 shadow-md w-[220px] h-fit rounded-xl">
        <Link href="/rankingpage">
          <button className="text-black hover:text-blue-600 w-full py-2 rounded-lg transition">
            推薦景點排行榜
          </button>
        </Link>
        <Link href="/review">
          <button className="text-black hover:text-green-600 w-full py-2 rounded-lg transition">
            推薦文章景點分享
          </button>
        </Link>
        <Link href="/guide">
          <button className="text-black hover:text-purple-600 w-full py-2 rounded-lg transition">
            建立分享
          </button>
        </Link>
      </aside>

      {/* 右側內容：5張卡片 */}
      <div className="flex flex-col gap-4 max-w-2xl">
        {/* 在這裡放你的五張卡片 */}
      </div>
    </div>
  );