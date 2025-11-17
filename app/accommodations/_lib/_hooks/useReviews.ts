import useSWRInfinite from 'swr/infinite';
import useSWRMutation from 'swr/mutation';
import { apiFetch } from '@/app/accommodations/_lib/_api';
import { ReviewDTO } from '@/app/accommodations/_types';
import { useAuth } from '../../../../hooks/use-Auth';

interface ReviewsPageResponse {
  data: ReviewDTO[];
  meta: any;
}

const REVIEWS_PER_LOAD = 5;

export const useReviews = (
  accommodationId: number,
  initialData: ReviewDTO[],
  reviewCount: number
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: ReviewsPageResponse | null
  ) => {
    if (previousPageData && previousPageData.meta.isLastPage) {
      return null;
    }
    const page = pageIndex + 1;
    return `/m3/accommodations/${accommodationId}/reviews?page=${page}&limit=${REVIEWS_PER_LOAD}`;
  };

  const {
    data: swrData,
    size,
    setSize,
    isLoading,
    isValidating,
    mutate,
  } = useSWRInfinite<ReviewsPageResponse>(
    getKey,
    async (endpoint) => apiFetch<ReviewsPageResponse>(endpoint),
    {
      fallbackData: [
        {
          data: initialData,
          meta: {
            isFirstPage: true,
            isLastPage: initialData.length === reviewCount,
            currentPage: 1,
            previousPage: null,
            nextPage: initialData.length < reviewCount ? 2 : null,
            pageCount: Math.ceil(reviewCount / REVIEWS_PER_LOAD),
            totalCount: reviewCount,
          },
        } as ReviewsPageResponse,
      ],
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: false, // 保留 SSR 初始值，不自動抓
    }
  );

  // ✅ 永遠依賴 SWR 快取，不再 fallback 到 initialData
  const allReviews = swrData?.flatMap((page) => page.data) ?? [];

  const loadMore = () => {
    setSize((prevSize) => prevSize + 1);
  };

  const dynamicTotal = swrData?.[0]?.meta?.totalCount ?? reviewCount;
  const hasNextPage = allReviews.length < dynamicTotal;
  const isFetching = isLoading || isValidating;

  const { getAuthHeader } = useAuth();

  const { trigger: createReview, isMutating: isSubmitting } = useSWRMutation(
    `/m3/accommodations/${accommodationId}/reviews`,
    async (
      url: string,
      { arg }: { arg: { content: string; rating: number } }
    ) => {
      // 呼叫 API 建立評論，回傳單筆 ReviewDTO
      return apiFetch<ReviewDTO>(url, {
        method: 'POST',
        headers: getAuthHeader() as HeadersInit,
        body: JSON.stringify(arg),
      });
    },
    {
      onSuccess: async () => {
        // ✅ 最穩定：送出後直接 revalidate，抓最新第一頁
        await mutate();
      },
    }
  );

  return {
    reviews: allReviews,
    isLoading: isFetching,
    totalReviews: dynamicTotal,
    hasNextPage,
    loadMore,
    isValidating,
    createReview,
    isSubmitting,
  };
};
