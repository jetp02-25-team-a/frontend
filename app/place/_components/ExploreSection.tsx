'use client';
import { useEffect, useRef, useState } from 'react';
import Grid from './Grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownShortWide,
  faArrowUpShortWide,
} from '@fortawesome/free-solid-svg-icons';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

type Raw = any;
type Front = {
  id: number;
  name: string;
  address: string;
  description: string;
  ratingAvg: number;
  photos: string[];
};

function normalize(p: Raw): Front {
  const photos = Array.isArray(p?.Photos)
    ? p.Photos.map((x: any) => x?.url).filter(Boolean)
    : Array.isArray(p?.photos)
      ? p.photos
          .map((x: any) => (typeof x === 'string' ? x : x?.url))
          .filter(Boolean)
      : [];
  const avgRaw = p?.rating?.avg ?? p?.avgScore ?? p?.avg_score ?? 0;
  const ratingAvg = Number(avgRaw);
  return {
    id: Number(p?.id ?? p?.place_id), // <- 確保是 number
    name: p?.name ?? '',
    address: p?.address ?? p?.region ?? '',
    description: p?.introduce ?? p?.description ?? '',
    ratingAvg: Number.isFinite(ratingAvg) ? ratingAvg : 0,
    photos,
  };
}

export default function ExploreSection() {
  const [activeTab, setActiveTab] = useState<'spot' | 'food'>('spot');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [data, setData] = useState<Front[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const requestedPagesRef = useRef<Set<number>>(new Set());

  const buildUrl = (p: number) =>
    `${API}/api/place?type=${activeTab}&sort=${
      sortOrder === 'desc' ? 'rank_desc' : 'rank_asc'
    }&limit=${limit}&page=${p}`;

  async function fetchPage(p: number) {
    if (loading) return;

    // 👇 若這一頁請過了就不要再打
    if (requestedPagesRef.current.has(p)) return;
    requestedPagesRef.current.add(p);

    setLoading(true);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(buildUrl(p), {
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const rows: Raw[] = Array.isArray(json?.data) ? json.data : [];
      const mapped = rows.map(normalize).filter((x) => x.id != null);

      // 追加並去重，同時計算本次新增數
      setData((prev) => {
        const before = new Map(prev.map((x) => [x.id, x]));
        const sizeBefore = before.size;

        for (const item of mapped) before.set(item.id, item);

        const afterArr = Array.from(before.values());
        const addedCount = afterArr.length - sizeBefore;

        // 👇 用「新增數」判斷是否還有下一頁
        //    如果本次完全沒有新增，就算 mapped==limit 也該停下來
        setHasMore(addedCount > 0);

        return afterArr;
      });
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setError('載入失敗，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  }
  // 排序函式
  const cmp = (order: 'asc' | 'desc') => (a: Front, b: Front) =>
    (order === 'desc'
      ? b.ratingAvg - a.ratingAvg
      : a.ratingAvg - b.ratingAvg) || a.id - b.id;

  // 切換排序按鈕
  const toggleSort = () => setSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'));

  // 切換 Tab 時重置分頁與資料
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    // 👇 重置已請求紀錄
    requestedPagesRef.current = new Set();
    // 👇 也取消尚未完成的請求
    abortRef.current?.abort();
  }, [activeTab]);

  // sortOrder 改變時，只重排目前資料（不重抓）
  useEffect(() => {
    setData((prev) => [...prev].sort(cmp(sortOrder)));
  }, [sortOrder]);

  // 首頁＆每次 page 變更就抓資料
  useEffect(() => {
    if (hasMore) fetchPage(page);
  }, [page, hasMore]);

  // IntersectionObserver：載入時暫停觀察，載完再觀察
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    // 初始觀察
    if (!loading) io.observe(el);

    return () => io.disconnect();
  }, [loading, hasMore, activeTab, sortOrder]);

  return (
    <section className="max-w-[1600px] mx-auto px-4 mb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('spot')}
            className={`px-4 py-1.5 rounded-full text-sm transition hover:cursor-pointer ${
              activeTab === 'spot'
                ? 'bg-yellow-500 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            景點
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`px-4 py-1.5 rounded-full text-sm transition hover:cursor-pointer ${
              activeTab === 'food'
                ? 'bg-yellow-500 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            美食
          </button>
        </div>

        {/* 排序 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">排序：</span>
          <button
            onClick={toggleSort}
            className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-sm hover:bg-gray-50 focus:outline-none hover:cursor-pointer"
            title={sortOrder === 'desc' ? '星等：高 → 低' : '星等：低 → 高'}
            aria-label="切換星等排序"
          >
            {sortOrder === 'desc' ? (
              <>
                <FontAwesomeIcon
                  icon={faArrowDownShortWide}
                  className="text-yellow-500"
                />
                高→低
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faArrowUpShortWide}
                  className="text-yellow-500"
                />
                低→高
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cards */}
      <Grid data={data} />

      {/* 狀態/載入更多 */}
      {error && (
        <div className="mt-4 text-center text-sm text-red-500">{error}</div>
      )}

      <div ref={sentinelRef} className="h-10" />

      {loading && (
        <div className="mt-4 text-center text-sm text-gray-500">載入中…</div>
      )}

      {!hasMore && data.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-400">
          — 沒有更多了 —
        </div>
      )}

      {/* 後備按鈕（如果瀏覽器不支援 IO 或想手動載入） */}
      {!loading && hasMore && (
        <div className="mt-3 flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
          >
            載入更多
          </button>
        </div>
      )}
    </section>
  );
}
