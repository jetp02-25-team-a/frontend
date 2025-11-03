// app/view-info/_components/ReviewsSection.tsx
'use client';
import { useEffect, useState } from 'react';
import ReviewList from './ReviewList';
import ReviewComposer from './ReviewComposer';
import SuccessModal from './SuccessModal';

type RatingDist = { star: number; pct: number };
type Spot = {
  place_id: number;
  ratingAvg: number;
  ratingDist: RatingDist[];
  reviewCount: number;
};
type Review = {
  id: number;
  user: { name: string; avatar: string };
  rating: number;
  content: string;
  createdAt: string;
};

export default function ReviewsSection({
  spot,
  initialReviews,
}: {
  spot: Spot;
  initialReviews: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [pending, setPending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal 開啟時鎖卷軸
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  async function handleSubmit(input: { content: string; rating: number }) {
    if (!input.content.trim() || input.rating === 0) return false;
    setPending(true);
    try {
      // 之後要串後端時，改成：
      // await fetch('/api/comments', { method:'POST', headers:{'Content-Type':'application/json'},
      //   body: JSON.stringify({ placeId: spot.place_id, ...input })
      // });

      // Demo：本地加入一筆
      const saved: Review = {
        id: Date.now(),
        user: { name: '你', avatar: 'https://i.pravatar.cc/64?u=me' },
        rating: input.rating,
        content: input.content.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setReviews((prev) => [saved, ...prev]);
      setShowModal(true);
      return true;
    } catch {
      alert('送出失敗，請稍後再試');
      return false;
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative w-full">
      {/* 內容：Modal 開啟時灰階 + 變暗 */}
      <div
        className={`transition-all duration-200 ${showModal ? 'filter grayscale' : ''}`}
      >
        <div className="flex flex-col items-center space-y-6">
          <ReviewList reviews={reviews} />
          <ReviewComposer
            placeId={String(spot.place_id)}
            pending={pending}
            onSubmit={({ content, rating }) =>
              handleSubmit({ content, rating })
            }
          />
        </div>
      </div>

      {showModal && (
        <SuccessModal
          title="評論發布成功"
          message="可以在評論區查看留言"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
