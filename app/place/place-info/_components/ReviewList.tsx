// components/spot/Reviews/ReviewList.tsx
export default function ReviewList({ reviews }: { reviews: any[] }) {
  return (
    <section className="space-y-3 w-[60%]">
      {reviews.map((r) => (
        <article key={r.id} className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center gap-3">
            <img src={r.avatar} className="h-8 w-8 rounded-full" />
            <div className="font-semibold">{r.name}</div>
            <div className="text-sm opacity-70">
              {new Date(r.date)
                .toLocaleDateString('zh-TW', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  timeZone: 'Asia/Taipei',
                })
                .replace(' ', '　')}
            </div>
            <div className="ml-auto">⭐ {r.score}</div>
          </div>
          <p className="mt-2 text-sm">{r.content}</p>
        </article>
      ))}
    </section>
  );
}
