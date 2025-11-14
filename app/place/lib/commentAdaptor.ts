const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
// 讀 env 並轉 number；沒有就丟明確錯誤，避免 NaN

// 新增或覆寫（有 @@unique([userId, placeId]) 就 upsert）
export async function createOrUpsertComment(
  placeId: number,
  content: string,
  userId: number
) {
  const uidStr = String(userId);
  const r = await fetch(`${BASE}/api/place/${placeId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uidStr },
    body: JSON.stringify({ userId, placeId, content }),
  });
  // 讀文字避免二次取用 body
  const text = await r.text();
  if (!r.ok) {
    throw new Error(
      `create/upsert comment failed: ${r.status} ${r.statusText} — ${text}`
    );
  }
  // ok 時再安全地 parse
  const j = JSON.parse(text);
  return j.data;
}

// 更新（只能改自己的，後端會用 mockUser 判定誰是自己）
export async function updateComment(
  placeId: number,
  commentId: number,
  content: string,
  userId: number
) {
  const uidStr = String(userId);
  const r = await fetch(`${BASE}/api/place/${placeId}/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uidStr },
    body: JSON.stringify({ userId, placeId, content }),
  });
  const text = await r.text();
  if (!r.ok)
    throw new Error(`update failed: ${r.status} ${r.statusText} — ${text}`);
  return JSON.parse(text).data;
}

// 刪除留言和星等
export async function deleteReview(
  placeId: number,
  commentId: number,
  userId: number
) {
  const r = await fetch(`${BASE}/api/place/${placeId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': String(userId),
    },
  });
  const text = await r.text();
  if (!r.ok)
    throw new Error(`delete failed: ${r.status} ${r.statusText} — ${text}`);
  return JSON.parse(text).data;
}
