'use client';
import { useState } from 'react';
import StarRatingInput from './StarRating';
import { createOrUpsertComment } from '@/app/place/lib/commentAdaptor';
import { createOrUpsertRank } from '../../lib/rankAdaptor';

export type ReviewInput = {
  placeId: string;
  rating: number;
  content: string;
};

export default function ReviewComposer({
  placeId,
  onCreated,
}: {
  placeId: number;
  onCreated?: () => void;
}) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5); // 先保留 UI；Rank 之後接
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      alert('請選擇 1～5 顆星的評分');
      return;
    }
    setLoading(true);
    try {
      await createOrUpsertRank(placeId, rating);
      await createOrUpsertComment(placeId, content.trim());
      setContent('');
      setRating(0);
      onCreated?.(); // 讓外層 refresh
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[60%] max-w-3xl rounded-2xl border p-4"
    >
      <div className="font-semibold mb-3">撰寫評論</div>

      {/* 星星評分（動畫點擊式） */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">評分</span>
        <StarRatingInput value={rating} onChange={setRating} size={24} />
      </div>

      <textarea
        className="mt-3 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="輸入你的心得"
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
          disabled={loading}
        >
          清除
        </button>
        <button
          type="submit"
          disabled={loading || !content.trim() || rating === 0}
          className="rounded-full bg-amber-400 text-white px-4 py-1.5 hover:opacity-90 disabled:opacity-50"
        >
          發佈
        </button>
      </div>
    </form>
  );
}
