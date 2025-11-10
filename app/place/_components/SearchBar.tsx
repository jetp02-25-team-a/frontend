'use client';

import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function SearchBar({
  onResult,
}: {
  // 將結果交回父層 (ExploreSection or 其他)
  onResult?: (data: any[]) => void;
}) {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 🔍 串接後端 API
  async function handleSearch() {
    setErr(null);
    setLoading(true);

    try {
      // 只要填入任一欄位即可
      const hasAddress = address.trim().length > 0;
      const hasRegion = region.trim().length > 0;

      if (!hasAddress && !hasRegion) {
        setErr('請至少輸入「縣市」或「地區」其中一項');
        setLoading(false);
        return;
      }

      // 根據後端支援的參數組合查詢
      const params = new URLSearchParams();
      params.set('limit', '12');
      params.set('page', '1');

      if (hasAddress) params.set('address', address.trim());
      if (hasRegion) params.set('region', region.trim());

      // 假設後端 /api/place 可以用 region/address 搜尋
      const url = `${API}/api/place/search?${params.toString()}`;
      console.log('[SearchBar] fetch =>', url);

      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        onResult?.(json.data); // 傳給父層顯示結果
        if (json.data.length === 0) setErr('查無資料');
      } else {
        setErr('查無資料');
      }
    } catch (e: any) {
      console.error(e);
      setErr('搜尋失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="max-w-2xl mx-auto mt-8 mb-6 px-4 text-center">
      <div className="border-2 border-[#D9D9D9] bg-white rounded-full  h-[64px] customize_shadow flex items-center justify-between pl-[20px] pr-[10px] py-[10px]">
        {/* 縣市 */}
        <div className="flex items-center w-[200px] justify-between">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (err) setErr(null);
            }}
            placeholder="縣市 Ex:新北市"
            className="focus:outline-none w-full"
          />
        </div>

        {/* 地區 */}
        <div className="flex items-center w-[200px] gap-[10px]">
          <div className="customize_gray h-[20px] w-[2px]"></div>
          <input
            type="text"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              if (err) setErr(null);
            }}
            placeholder="地區 Ex:板橋區"
            className="focus:outline-none w-full"
          />
        </div>

        {/* 搜尋按鈕 */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-amber-400 text-white px-[10px] py-[10px] flex justify-center items-center gap-[10px] rounded-full hover:cursor-pointer"
        >
          {loading ? (
            <span className="text-sm">搜尋中...</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faSearch} />
              <span className="text-sm">搜尋</span>
            </>
          )}
        </button>
      </div>

      {/* 錯誤訊息 */}
      {err && <p className="text-sm text-red-500 mt-3">{err}</p>}
    </section>
  );
}
