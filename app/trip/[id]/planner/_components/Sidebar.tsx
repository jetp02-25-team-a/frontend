'use client';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shadow-md">
      <div>
        <h2 className="text-lg font-bold mb-1">國旅三天兩夜</h2>
        <p className="text-xs text-gray-400">行程管理</p>
      </div>

      <nav className="flex flex-col gap-4 mt-8 text-sm">
        <button className="flex items-center gap-2 hover:text-yellow-600 transition">
          🧳 行李清單
        </button>
        <button className="flex items-center gap-2 hover:text-yellow-600 transition">
          📄 下載 PDF
        </button>
        <button className="flex items-center gap-2 hover:text-yellow-600 transition">
          💰 記帳
        </button>
      </nav>

      <div className="text-xs text-gray-400 mt-8">© 旅行背包 Travel Pack</div>
    </aside>
  );
}
