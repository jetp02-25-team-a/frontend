'use client';
import Link from 'next/link';

export default function SidebarActions() {
  return (
    <div className="flex justify-center gap-8 mt-10">
      {/* 左側選單 */}
      <aside className="px-6 py-6 flex flex-col gap-4 text-3xl text-amber-200 bg-amber-100 shadow-md w-[180px] h-fit rounded-xl">
        <Link href="/ranking">
          <button className="text-black hover:text-blue-600">推薦景點排行榜</button>
        </Link>
        <Link href="/guide">
          <button className="text-black hover:text-green-600">推薦文章景點分享</button>
        </Link>
        <Link href="/reviews">
          <button className="text-black hover:text-purple-600">建立分享</button>
        </Link>
        
      </aside>

      {/* 右側內容：5張卡片 */}
      <div className="flex flex-col gap-4 max-w-2xl">
        {/* 在這裡放你的五張卡片 */}
      </div>
    </div>
  );
}


















// // components/SectionList.tsx'

// 'use client';
// import Link from 'next/link';

// export default function SidebarNav() {

// <div className="flex flex-col gap-4 max-w-2xl">
//     你的 5 張卡片
 

//   return (    <aside className="sticky top-20 left-0 px-4 py-6 flex flex-col gap-4 bg-white shadow-md w-[180px] h-fit">

//       <Link href="/ranking">
//         <button className="text-black hover:text-blue-600">推薦景點排行榜</button>
//       </Link>
//       <Link href="/guide">
//         <button className="text-black hover:text-green-600">推薦文章景點分享</button>
//       </Link>
//       <Link href="/reviews">
//         <button className="text-black hover:text-purple-600">建立分享</button>
//       </Link>
//       <div className="text-xs text-gray-400 mt-4">2021.12.19</div>
//     </aside>
//      {/* </div> */}

//   );
// }

// 'use client';
// import Link from 'next/link';

// export default function SectionList() {
//   return (
//     <div className="mt-6 flex justify-center gap-8">
//       <Link href="/ranking">
//         <button className="flex flex-col items-center text-sm text-black hover:text-shadow-white">
//           <span className="mt-2">推薦景點排行榜</span>
//         </button>
//       </Link>

//       <Link href="/articles">
//         <button className="flex flex-col items-center text-sm text-black hover:text-shadow-white">
//           <span className="mt-2">推薦文章景點分享</span>
//         </button>
//       </Link>

//       <Link href="/share">
//         <button className="flex flex-col items-center text-sm text-black hover:text-shadow-white">
//           <span className="mt-2">建立分享</span>
//         </button>
//       </Link>
//     </div>
//   );
// }

// 'use client';

// export default function SidebarActions() {
//   return (
//     <div className="flex flex-col gap-2 p-4">
//       <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//         编辑商品信息
//       </button>
//       <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//         编辑商品评价
//       </button>
//     </div>
//   );
// }
