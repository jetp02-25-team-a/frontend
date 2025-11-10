'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// 留著以後要在首頁就顯示結果時可用，但目前不使用
export default function SearchBar({
  onResult,
}: {
  onResult?: (data: any[]) => void;
}) {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  function go() {
    if (loading) return;

    const a = address.trim();
    const r = region.trim();

    // 1) 兩欄皆空：導到 /map（預設中心）
    if (!a && !r) {
      setErr(null);
      router.push('/place/map');
      return;
    }

    // 2) 其一有值：導到 /map?q=...
    const params = new URLSearchParams();
    if (a) params.set('address', a);
    if (r) params.set('region', r);

    setErr(null);
    router.push(`/place/map?${params.toString()}`);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      go();
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-8 mb-6 px-4 text-center">
      <div className="border-2 border-[#D9D9D9] bg-white rounded-full h-[64px] customize_shadow flex items-center justify-between pl-[20px] pr-[10px] py-[10px]">
        {/* 縣市（address） */}
        <div className="flex items-center w-[200px] justify-between">
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (err) setErr(null);
            }}
            onKeyDown={onKeyDown}
            placeholder="縣市 Ex: 新北市"
            className="focus:outline-none w-full"
            disabled={loading}
          />
        </div>

        {/* 地區（region） */}
        <div className="flex items-center w-[200px] gap-[10px]">
          <div className="customize_gray h-[20px] w-[2px]" />
          <input
            type="text"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              if (err) setErr(null);
            }}
            onKeyDown={onKeyDown}
            placeholder="地區 Ex: 板橋區"
            className="focus:outline-none w-full"
            disabled={loading}
          />
        </div>

        {/* 搜尋按鈕 */}
        <button
          onClick={go}
          disabled={loading}
          className="bg-amber-400 text-white px-[10px] py-[10px] flex justify-center items-center gap-[10px] rounded-full hover:cursor-pointer disabled:opacity-60"
          aria-label="搜尋"
        >
          {loading ? (
            <span className="text-sm">前往地圖…</span>
          ) : (
            <>
              <FontAwesomeIcon icon={faSearch} />
              <span className="text-sm">搜尋</span>
            </>
          )}
        </button>
      </div>

      {/* 錯誤訊息（目前只在你想強制輸入時會用到，這版其實用不到） */}
      {err && <p className="text-sm text-red-500 mt-3">{err}</p>}
    </section>
  );
}
