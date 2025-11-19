'use client';
import { useState } from 'react';
import Link from 'next/link';
import StarRating from './StarRating';
import { createOrUpsertComment } from '@/app/place/lib/commentAdaptor';
import { createOrUpsertRank } from '@/app/place/lib/rankAdaptor';
import { useAuth } from '@/hooks/use-Auth';

export type ReviewInput = {
  placeId: number;
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
  const { user, isReady } = useAuth();
  const isLoggedIn = !!user.email;
  const userId = user.id;

  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!isLoggedIn) {
      setError('請先登入會員才能發表評論');
      return;
    }
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await createOrUpsertRank(placeId, rating, userId);
      await createOrUpsertComment(placeId, content.trim(), userId);
      setContent('');
      setRating(0);
      onCreated?.();
    } catch (err: any) {
      setError('評論只能發佈一次');
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="w-[60%] max-w-3xl rounded-2xl border p-4">
        <div className="font-semibold mb-3">撰寫評論</div>
        <p className="text-sm text-neutral-600 mb-3">
          只有登入會員才能撰寫評論喔～
        </p>
        <Link
          href={`/member/login`}
          className="inline-flex items-center rounded-full bg-amber-400 px-4 py-1.5 text-white text-sm hover:opacity-90"
        >
          前往登入
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[60%] max-w-3xl rounded-2xl border p-4"
      aria-busy={loading}
    >
      <div className="font-semibold mb-3">撰寫評論</div>

      {/* 星星評分（動畫點擊式） */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">評分</span>
        <StarRating
          value={rating}
          onChange={loading ? undefined : setRating}
          size={24}
        />
      </div>

      <textarea
        className="mt-3 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
        placeholder="輸入你的心得"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
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
