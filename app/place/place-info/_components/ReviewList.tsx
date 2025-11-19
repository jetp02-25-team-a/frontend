'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import SuccessModal from './SuccessModal';
import ConfirmModal from './ConfirmModal';
import StarRating from './StarRating';
import { updateComment, deleteReview } from '@/app/place/lib/commentAdaptor';
import { createOrUpsertRank } from '@/app/place/lib/rankAdaptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as faStarSolid,
  faStarHalfStroke,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { AVATAR_PATH, buildImageUrl } from '@/config/image-path';

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
  onChanged, // 更新後讓外層 refresh / mutate
}: {
  placeId: number;
  reviews: ReviewItem[];
  onChanged?: () => void;
}) {
  const { user, isReady } = useAuth();
  const isLoggedIn = !!user.email;

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [rating, setEditScore] = useState<number>(0);

  const [successModal, setSuccessModal] = useState<{
    title: string;
    message: string;
    type: string;
  } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{
    commentId: number;
  } | null>(null);

  if (!isReady) {
    return null;
  }

  async function handleSave(id: number) {
    if (!isLoggedIn) return;

    const text = draft.trim();
    if (!text) return;

    const uid = Number(user.id);
    if (!Number.isFinite(uid) || uid <= 0) return;

    const score = rating || 0;
    if (!score) return; // 不讓 0 分送出

    await Promise.all([
      updateComment(placeId, id, text, uid),
      createOrUpsertRank(placeId, score, uid),
    ]);
    setEditingId(null);
    onChanged?.();
    setSuccessModal({
      title: '編輯成功',
      message: '已更新你的評論與評分。',
      type: 'edit',
    });
  }

  async function handleDelete(commentId: number) {
    if (!isLoggedIn) return;
    const uid = Number(user.id);
    await deleteReview(placeId, commentId, uid);
    onChanged?.();
    setSuccessModal({
      title: '刪除成功',
      message: '已刪除這則評論。',
      type: 'delete',
    });
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
        const uid = user.id;
        const isMine = Number(r.userId) === uid;
        const inEdit = editingId === r.id;

        return (
          <article
            key={r.id}
            className="rounded-2xl border p-4 bg-white relative"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  r.avatar ? `${AVATAR_PATH}${r.avatar}` : '/default-avatar.png'
                }
                className="h-8 w-8 rounded-full object-cover"
              />

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
              {isLoggedIn && isMine && !inEdit && (
                <div className="absolute bottom-3 right-3 flex items-center gap-2 mt-10">
                  {/* 編輯 */}
                  <button
                    className="text-amber-600 hover:text-green-500 hover:cursor-pointer transition"
                    onClick={() => {
                      setEditingId(r.id);
                      setDraft(r.content);
                      setEditScore(Number(r.score) || 0);
                    }}
                    title="編輯"
                  >
                    <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                  </button>

                  {/* 刪除 */}
                  <button
                    className="text-amber-600 hover:text-red-600 hover:cursor-pointer transition"
                    onClick={() => setConfirmDelete({ commentId: r.id })}
                    title="刪除"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 內容 / 編輯模式 */}
            {!inEdit ? (
              <p className="mt-2 text-sm">{r.content}</p>
            ) : (
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-neutral-600">評分</span>
                  <StarRating
                    value={rating}
                    onChange={setEditScore}
                    size={18}
                  />
                </div>
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
      {/* ✅ 成功訊息 Modal（新增 / 編輯 / 刪除都會用到） */}
      {successModal && (
        <SuccessModal
          title={successModal.title}
          message={successModal.message}
          type={successModal.type}
          onClose={() => setSuccessModal(null)}
        />
      )}

      {/* ✅ 刪除前確認 Modal */}
      {confirmDelete && (
        <ConfirmModal
          title="刪除評論"
          message="確定要刪除此則評論嗎？ 刪除後將無法恢復喔。"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            await handleDelete(confirmDelete.commentId);
            setConfirmDelete(null);
          }}
        />
      )}
    </section>
  );
}
