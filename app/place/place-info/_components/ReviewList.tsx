'use client';
import { useState } from 'react';
import { updateComment, deleteComment } from '@/app/place/lib/commentAdaptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

type ReviewItem = {
  id: number;
  userId: number | string;
  name: string; // 由 adaptor 整理的顯示名稱
  avatar?: string | null; // 頭像
  date: string; // ISO 字串
  content: string;
  score?: number | null; // 0~5，可無
};

export default function ReviewList({
  placeId,
  reviews,
  currentUserId, // 用來判斷是否顯示「編輯/刪除」
  onChanged, // 更新後讓外層 refresh / mutate
}: {
  placeId: number;
  reviews: ReviewItem[];
  currentUserId?: number;
  onChanged?: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  async function handleSave(id: number) {
    const text = draft.trim();
    if (!text) return;
    await updateComment(placeId, id, text);
    setEditingId(null);
    onChanged?.();
  }

  async function handleDelete(id: number) {
    await deleteComment(placeId, id);
    onChanged?.();
  }

  // ✅ 小工具：用 FontAwesome 顯示星等
  function renderStars(score?: number | null) {
    const avg = Math.max(0, Math.min(5, Number(score) || 0));
    const rounded = Math.round(avg * 2) / 2; // 支援半星
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => {
          const index = i + 1;
          const icon =
            rounded >= index
              ? faStarSolid
              : rounded >= index - 0.5
                ? faStarHalfStroke
                : faStarRegular;
          return (
            <FontAwesomeIcon
              key={i}
              icon={icon}
              className="w-5 h-5 text-amber-500"
            />
          );
        })}
      </div>
    );
  }

  return (
    <section className="space-y-3 w-[60%]">
      {reviews.map((r) => {
        const uid = typeof currentUserId === 'number' ? currentUserId : NaN;
        const isMine = Number(r.userId) === uid;
        const inEdit = editingId === r.id;
        return (
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
                {renderStars(r.score)}
              </div>
              {/* 只有自己的留言才顯示編輯/刪除 */}
              {isMine && !inEdit && (
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs text-amber-600 hover:underline"
                    onClick={() => {
                      setEditingId(r.id);
                      setDraft(r.content);
                    }}
                  >
                    編輯
                  </button>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => handleDelete(r.id)}
                  >
                    刪除
                  </button>
                </div>
              )}
            </div>

            {/* 內容 / 編輯模式 */}
            {!inEdit ? (
              <p className="mt-2 text-sm">{r.content}</p>
            ) : (
              <div className="mt-3">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-300"
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="rounded-full border px-3 py-1.5 hover:bg-neutral-50"
                    onClick={() => setEditingId(null)}
                  >
                    取消
                  </button>
                  <button
                    className="rounded-full bg-amber-400 text-white px-4 py-1.5 hover:opacity-90 disabled:opacity-50"
                    onClick={() => handleSave(r.id)}
                    disabled={!draft.trim()}
                  >
                    儲存
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
