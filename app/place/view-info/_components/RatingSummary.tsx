// components/spot/RatingSummary.tsx
export default function RatingSummary({
  avg,
  dist,
  count,
}: {
  avg: number;
  count: number;
  dist: { star: number; pct: number }[];
}) {
  return (
    <section className="rounded-2xl border p-4">
      <div className="flex items-center gap-6">
        <div>
          <div className="text-4xl font-bold ">{avg}</div>
          <div className="text-xs font-bold">⭐⭐⭐⭐⭐</div>
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
