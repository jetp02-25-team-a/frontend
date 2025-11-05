// components/spot/Reviews/SpotReviewsPanel.tsx
'use client';
import { useEffect, useState } from 'react';
import ReviewList from './ReviewList';
import ReviewComposer, { ReviewInput } from './ReviewComposer';
import SuccessModal from './SuccessModal';

type Review = {
  id: string;
  user: { name: string; avatar: string };
  rating: number;
  content: string;
  createdAt: string;
};

export default function SpotReviewsPanel({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal 打開時鎖卷軸
  useEffect(() => {
    document.body.style.overflow = showSuccess ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSuccess]);

  async function handleSubmit(input: ReviewInput) {
    if (!input.content.trim() || input.rating === 0) return;
    setIsSubmitting(true);
    try {
      // ==== 之後直接打開這段就能串後端 ====
      // const res = await fetch('/api/comments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ placeId: input.placeId, content: input.content, rating: input.rating }),
      // });
      // if (!res.ok) throw new Error('Create comment failed');
      // const saved = await res.json();

      // Demo: 模擬回傳一筆新評論
      const saved = {
        id: crypto.randomUUID(),
        user: { name: '你', avatar: 'https://i.pravatar.cc/64' },
        rating: input.rating,
        content: input.content.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setReviews((prev) => [saved, ...prev]);
      setShowSuccess(true);
      return true;
    } catch (e) {
      alert('送出失敗，請稍後再試');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  // 計算平均與分布（給 RatingSummary）
  const count = reviews.length;
  const avg = count
    ? (reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)
    : '0.0';
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => r.rating === star).length;
    const pct = count ? Math.round((n / count) * 100) : 0;
    return { star, pct };
  });

  return (
    <div className="relative min-h-[60vh] w-full">
      {/* 主要內容，開啟 Modal 時灰階+變暗 */}
      <div
        className={`transition-all duration-200 ${showSuccess ? 'filter grayscale brightness-75' : ''}`}
      >
        <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6 items-center">
          <ReviewList reviews={reviews} />
          <ReviewComposer
            pending={isSubmitting}
            onSubmit={handleSubmit}
            placeId="demo-place-id"
          />
        </div>
      </div>

      {/* 成功提示 Modal */}
      {showSuccess && (
        <SuccessModal
          title="評論發布成功"
          message="可以在評論區查看留言"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
