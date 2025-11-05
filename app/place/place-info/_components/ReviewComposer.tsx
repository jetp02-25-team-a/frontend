'use client';
import { useState } from 'react';
import StarRatingInput from './StarRating';

export type ReviewInput = {
  placeId: string;
  rating: number;
  content: string;
};

export default function ReviewComposer({
  placeId,
  pending,
  onSubmit,
}: {
  placeId: string;
  pending?: boolean;
  onSubmit: (input: ReviewInput) => Promise<boolean> | boolean;
}) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || rating === 0) return;

    const ok = await onSubmit({ placeId, rating, content });
    if (ok) {
      setContent('');
      // 保留 rating 或歸零都行
      // setRating(0);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl rounded-2xl border p-4"
    >
      <div className="font-semibold mb-3">撰寫評論</div>

      {/* 星星評分（動畫點擊式） */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">評分</span>
        <StarRatingInput value={rating} onChange={setRating} size={24} />
      </div>

      <textarea
        className="mt-3 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="輸入你的心得（僅前端展示，未送出後端）"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setContent('');
            setRating(0);
          }}
          className="rounded-full border px-3 py-1.5 hover:bg-neutral-50"
          disabled={pending}
        >
          清除
        </button>
        <button
          type="submit"
          disabled={pending || !content.trim() || rating === 0}
          className="rounded-full bg-amber-400 text-white px-4 py-1.5 hover:opacity-90 disabled:opacity-50"
        >
          發佈
        </button>
      </div>
    </form>
  );
}
