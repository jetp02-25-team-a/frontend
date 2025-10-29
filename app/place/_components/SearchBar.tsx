import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8 mb-6 px-4 text-center">
      <h2 className="text-xl font-semibold mb-3">開始書寫屬於你的故事吧</h2>
      <div className="flex justify-center items-center border rounded-full overflow-hidden bg-white shadow-sm">
        <input
          type="text"
          placeholder="搜尋景點、地點..."
          className="w-full px-4 py-2 focus:outline-none"
        />
        <button className="bg-[#F9C74F] text-white px-4 py-2 font-medium hover:bg-[#f8b400] transition">
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
