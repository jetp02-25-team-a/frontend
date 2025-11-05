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
            <div className="ml-auto flex items-center mt-1 space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={i < r.score ? '#f59e0b' : '#e5e7eb'}
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1.5l2.472 5.009 5.528.804-4 3.898.944 5.507L10 14.773l-4.944 2.945.944-5.507-4-3.898 5.528-.804L10 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm">{r.content}</p>
        </article>
      ))}
    </section>
  );
}
