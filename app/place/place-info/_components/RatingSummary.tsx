import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

type ReviewItem = {
  id: number;
  userId: number;
  name: string; // adaptor 已攤平好的顯示名稱
  avatar?: string | null;
  date: string; // ISO 字串（後端 createdAt）
  content: string;
  score?: number | null; // 0~5，可為 null
};

function buildRatingSummary(reviews: ReviewItem[]) {
  // 只取有分數的
  const scored = reviews
    .map((r) => Number(r.score))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);

  const count = scored.length;
  const avg = count
    ? Number((scored.reduce((s, n) => s + n, 0) / count).toFixed(1))
    : 0;

  // 由 5→1 生成分布（百分比四捨五入）
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const n = scored.filter((s) => s === star).length;
    const pct = count ? Math.round((n / count) * 100) : 0;
    return { star, pct };
  });

  return { avg, count, dist };
}

export default function RatingSummary({ reviews }: { reviews: ReviewItem[] }) {
  const { avg, count, dist } = buildRatingSummary(reviews);
  const rounded = Math.round(avg * 2) / 2;

  return (
    <section className="rounded-2xl border p-4">
      <div className="flex items-center gap-6">
        <div>
          <div className="text-4xl font-bold ">{avg}</div>
          {/* ✅ 改良版平均分數顯示 */}
          <div
            className="flex items-center gap-0.5"
            aria-label={`average ${avg} stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const index = i + 1;
              // 滿星條件：≥ index
              if (rounded >= index) {
                return (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStarSolid}
                    className="h-5 w-5 text-amber-500"
                  />
                );
              }
              // 半星條件：等於 index - 0.5
              if (rounded === index - 0.5) {
                return (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStarHalfStroke}
                    className="h-5 w-5  text-amber-500"
                  />
                );
              }
              // 否則空星
              return (
                <FontAwesomeIcon
                  key={i}
                  icon={faStarRegular}
                  className="h-5 w-5 text-amber-500"
                />
              );
            })}
          </div>
          <div className="text-[12px] font-bold mt-0.5">總評論數: {count}</div>
        </div>
        <div className="flex-1 space-y-2">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-sm">
              <span className="w-8">{d.star}★</span>
              <div className="h-2 flex-1 rounded bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="w-10 text-right">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
