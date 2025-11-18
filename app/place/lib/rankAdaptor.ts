import { API_URL } from '@/config/api-path';
const BASE = API_URL;
// 讀 env 並轉 number；沒有就丟明確錯誤，避免 NaN

// 新增或覆寫（有 @@unique([userId, placeId]) 就 upsert）
export async function createOrUpsertRank(
  placeId: number,
  score: number,
  userId: number
) {
  const uidStr = String(userId);
  const r = await fetch(`${BASE}/api/place/${placeId}/ranks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uidStr },
    body: JSON.stringify({ userId, score }),
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
export async function updateRank(
  placeId: number,
  rankId: number,
  score: string,
  userId: number
) {
  const uidStr = String(userId);
  const r = await fetch(`${BASE}/api/place/${placeId}/ranks/${rankId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uidStr },
    body: JSON.stringify({ userId, placeId, score }),
  });
  const text = await r.text();
  if (!r.ok)
    throw new Error(`update failed: ${r.status} ${r.statusText} — ${text}`);
  return JSON.parse(text).data;
}

// 刪除（只能刪自己的）
export async function deleteRank(
  placeId: number,
  rankId: number,
  userId: number
) {
  const uidStr = String(userId);
  const r = await fetch(`${BASE}/api/place/${placeId}/ranks/${rankId}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': uidStr,
    },
  });
  const text = await r.text();
  if (!r.ok)
    throw new Error(`delete failed: ${r.status} ${r.statusText} — ${text}`);
  return JSON.parse(text).data;
}
