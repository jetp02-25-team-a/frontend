// components/spot/Reviews/ReviewList.tsx
export default function ReviewList({ reviews }: { reviews: any[] }) {
  return (
    <section className="space-y-3 w-[60%]">
      {reviews.map((r) => (
        <article key={r.id} className="rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <img src={r.user.avatar} className="h-8 w-8 rounded-full" />
            <div className="font-semibold">{r.user.name}</div>
            <div className="text-sm opacity-70">· {r.createdAt}</div>
            <div className="ml-auto">⭐ {r.rating}</div>
          </div>
          <p className="mt-2 text-sm">{r.content}</p>
        </article>
      ))}
    </section>
  );
}
