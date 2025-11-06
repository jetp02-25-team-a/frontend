const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
// 讀 env 並轉 number；沒有就丟明確錯誤，避免 NaN
const DEMO_UID_NUM = Number(process.env.NEXT_PUBLIC_MOCK_USER_ID ?? '');
if (!Number.isFinite(DEMO_UID_NUM) || DEMO_UID_NUM <= 0) {
  throw new Error(
    'Missing or invalid NEXT_PUBLIC_MOCK_USER_ID. ' +
      '請在 .env.local 設定，例如：NEXT_PUBLIC_MOCK_USER_ID=1，並重啟 dev server。'
  );
}
const DEMO_UID = String(DEMO_UID_NUM);

// 新增或覆寫（有 @@unique([userId, placeId]) 就 upsert）
export async function createOrUpsertRank(placeId: number, score: number) {
  const r = await fetch(`${BASE}/api/place/${placeId}/ranks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': DEMO_UID },
    body: JSON.stringify({ userId: DEMO_UID_NUM, placeId, score }),
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
  score: string
) {
  const r = await fetch(`${BASE}/api/place/${placeId}/ranks/${rankId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-user-id': DEMO_UID },
    body: JSON.stringify({ userId: DEMO_UID_NUM, placeId, score }),
  });
  const text = await r.text();
  if (!r.ok)
    throw new Error(`update failed: ${r.status} ${r.statusText} — ${text}`);
  return JSON.parse(text).data;
}

// 刪除（只能刪自己的）
export async function deleteRank(placeId: number, rankId: number) {
  const r = await fetch(`${BASE}/api/place/${placeId}/ranks/${rankId}`, {
    method: 'DELETE',
    headers: {
      'x-user-id': DEMO_UID, // 👈
    },
  });
  const text = await r.text();
  if (!r.ok)
    throw new Error(`delete failed: ${r.status} ${r.statusText} — ${text}`);
  return JSON.parse(text).data;
}
