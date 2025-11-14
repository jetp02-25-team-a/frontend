// components/spot/Reviews/SpotReviewsPanel.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewList from './ReviewList';
import ReviewComposer from './ReviewComposer';
import SuccessModal from './SuccessModal';

type ReviewItem = {
  id: number;
  userId: number;
  name: string; // adaptor 已攤平好的顯示名稱
  avatar?: string | null;
  date: string; // ISO 字串（後端 createdAt）
  content: string;
  score?: number | null; // 0~5，可為 null
};

export default function SpotReviewsPanel({
  placeId,
  reviews,
  currentUserId,
}: {
  placeId: number;
  reviews: ReviewItem[]; // 直接吃 adaptor 輸出的 reviews[]
  currentUserId?: number; // 方法A可傳固定 mock，用來顯示「編輯/刪除」
}) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  // ✅ env → number；若 props 有給就用 props，否則用 env
  const envUidRaw = process.env.NEXT_PUBLIC_MOCK_USER_ID;
  const envUid = envUidRaw ? Number(envUidRaw) : undefined;
  const uid = typeof currentUserId === 'number' ? currentUserId : envUid;

  // Modal 打開時鎖卷軸
  useEffect(() => {
    document.body.style.overflow = showSuccess ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSuccess]);

  return (
    <div className="relative min-h-[60vh] w-full">
      {/* 主要內容，開啟 Modal 時灰階+變暗 */}
      <div className={`transition-all duration-200 ${showSuccess}`}>
        <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-6 items-center">
          {/* 留言清單（內含編輯/刪除；完成後 refresh） */}
          <ReviewList
            placeId={placeId}
            reviews={reviews}
            currentUserId={uid}
            onChanged={() => router.refresh()}
          />
          {/* 發表留言（送出後 refresh 以重新跑 adaptor） */}
          <ReviewComposer
            // pending={isSubmitting}
            // onSubmit={handleSubmit}
            placeId={placeId}
            onCreated={() => {
              // 先顯示成功提示
              setShowSuccess(true);
              // 稍後再 refresh，避免 state 被洗掉看不到 Modal
              setTimeout(() => router.refresh(), 300);
            }}
          />
        </div>
      </div>

      {/* 成功提示 Modal */}
      {showSuccess && (
        <SuccessModal
          title="評論發布成功"
          message="可以在評論區查看留言"
          type="create"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
