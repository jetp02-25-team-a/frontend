'use client';

import { FaStar } from 'react-icons/fa';
import { AVATAR_PATH } from '@/config/image-path';
import { ReviewDTO } from '../../_types';
import { format } from 'date-fns';
import Image from 'next/image';
// 🚨 1. 引入 useReviews 鉤子
import { useReviews } from '../../_lib/_hooks';
import { useAuth } from '../../../../hooks/use-Auth';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// 🚨 2. 調整 Props 結構以符合 useReviews 的參數
export interface ReviewAreaProps {
  accommodationId: number;
  // 初始數據現在包含評論列表和總數
  initialReviews: ReviewDTO[];
  reviewCount: number;
}

// ReviewCard 保持不變
const ReviewCard = ({ review }: { review: ReviewDTO }) => {
  // ... (ReviewCard 內容保持不變)
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${
          index < review.ratingScore ? 'text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));

  const formattedDate = format(new Date(review.reviewDate), 'yyyy年M月d日');
  const avatarSrc = `${AVATAR_PATH}${review.user.avatar}`;

  return (
    <div className="flex flex-col space-y-3 border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 relative">
          <Image
            src={avatarSrc}
            alt={review.user.nickname}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-base font-medium text-gray-900">
            {review.user.nickname}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex">{stars}</div>
            <span className="text-xs">•</span>
            <span className="text-xs">{formattedDate}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed pl-14">{review.comment}</p>
    </div>
  );
};

export default function ReviewArea({
  accommodationId,
  initialReviews,
  reviewCount,
}: ReviewAreaProps) {
  const {
    reviews,
    isLoading,
    totalReviews,
    hasNextPage,
    loadMore,
    isValidating,
    createReview,
    isSubmitting,
  } = useReviews(accommodationId, initialReviews, reviewCount);

  const { user } = useAuth(); // 🚨 判斷登入狀態
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;
    await createReview({ content: comment, rating });
    toast.success('發表成功');
    setComment('');
    setRating(0);
  };

  const currentDisplayedCount = reviews.length;

  const isFetchingData = isLoading && currentDisplayedCount === 0;

  const isFetchingNextPage = isValidating;

  return (
    <div className="w-full px-32">
      <div className="w-full p-8 rounded-xl shadow-sm bg-white">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">評論區</h2>
        </div>
        {/* 撰寫評論區塊 */}
        <div className="flex flex-col py-4 border-b border-gray-200">
          {!user.id ? (
            <p className="text-gray-600">
              請先{' '}
              <Link href="/member/login" className="text-blue-600 underline">
                登入
              </Link>{' '}
              以撰寫評論
            </p>
          ) : (
            <div className="space-y-3">
              {/* 星數選擇 */}
              <div className="flex space-x-2 items-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-6 w-6 cursor-pointer ${
                        i < rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(i + 1)}
                    />
                  ))}
              </div>
              {/* 文字輸入 */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="撰寫你的評論..."
                className="w-full border rounded-lg p-2 text-gray-700"
                rows={3}
              />
              {/* 送出按鈕 */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-brand text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? '送出中...' : '送出評論'}
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-gray-100">
          {isFetchingData ? (
            <p className="text-cprimary py-6">正在載入評論...</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          )}
        </div>
        {/* 載入更多按鈕 */}
        {hasNextPage && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={loadMore}
              disabled={false} // 🚨 使用 isValidating 禁用按鈕
              className="text-white hover:text-primary-dark bg-brand font-medium px-4 py-2 border border-primary hover:border-primary-dark rounded-lg transition duration-150 disabled:opacity-50"
            >
              {isFetchingNextPage // 🚨 使用 isValidating 顯示按鈕文字
                ? '載入中...'
                : `載入更多評論 (${currentDisplayedCount} / ${totalReviews})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
