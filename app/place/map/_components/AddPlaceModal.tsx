'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import Toast from '@/app/place/_components/Toast';
import { useAuth } from '@/hooks/use-Auth';
import { createOrUpsertRank } from '@/app/place/lib/rankAdaptor';
import { createOrUpsertComment } from '@/app/place/lib/commentAdaptor';

type OpeningRow = {
  weekday: number; // 0~6
  isClosed: boolean;
  openTime: string; // "HH:mm" or ""
  closeTime: string; // "HH:mm" or ""
};

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

/** ⭐ 星等輸入（FontAwesome＋hover 放大動畫） */
function StarRatingInput({
  value = 0,
  onChange,
  size = 22,
  readOnly = false,
  ariaLabel = '星等評分',
  className = '',
}: {
  value?: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => setRating(value), [value]);

  const display = hover ?? rating;
  const stars = useMemo(() => Array.from({ length: 5 }, (_, i) => i + 1), []);

  function commit(v: number) {
    if (readOnly) return;
    setRating(v);
    onChange?.(v);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (readOnly) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const v = Math.min(5, (hover ?? rating) + 1);
      setHover(v);
      commit(v);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const v = Math.max(0, (hover ?? rating) - 1);
      setHover(v);
      commit(v);
    }
    if (e.key === '0' || e.key.toLowerCase() === 'backspace') {
      e.preventDefault();
      setHover(null);
      commit(0);
    }
  }

  return (
    <div
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={display}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={onKeyDown}
      className={`inline-flex items-center gap-1 select-none ${className}`}
    >
      {stars.map((v, i) => {
        const active = v <= display;
        const scale = hover !== null && v === hover ? 'scale-110' : 'scale-100';
        return (
          <button
            type="button"
            key={v}
            disabled={readOnly}
            aria-label={`${v} 星`}
            onMouseEnter={() => !readOnly && setHover(v)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onFocus={() => !readOnly && setHover(rating || 0)}
            onBlur={() => !readOnly && setHover(null)}
            onClick={() => commit(v)}
            className="grid place-items-center p-0.5 outline-none cursor-pointer disabled:cursor-default rounded
                       focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{
              width: size,
              height: size,
              transitionDelay: `${i * 15}ms`,
            }}
          >
            <FontAwesomeIcon
              icon={active ? faStarSolid : faStarRegular}
              className={`${scale} transition-transform duration-120 ease-out transform-gpu will-change-transform`}
              style={{
                width: size,
                height: size,
                color: active ? '#f59e0b' : '#e5e7eb',
              }}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-neutral-600">{display || '-'}</span>
    </div>
  );
}

export default function AddPlaceModal({
  open,
  onClose,
  onCreated, // 建立成功回調
  apiBase,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (place: any) => void;
  apiBase: string;
}) {
  const [type, setType] = useState<'food' | 'spot'>('spot');
  const [name, setName] = useState('');
  const [introduce, setIntroduce] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [contact, setContact] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hours, setHours] = useState<OpeningRow[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      weekday: i,
      isClosed: true,
      openTime: '',
      closeTime: '',
    }))
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { user, isReady } = useAuth();
  const isLoggedIn = !!user.email;
  const userId = user.id;
  const token = user?.token;

  // 將 "HH:mm" 轉成 UTC ISO 字串，例如 "08:00" → "1970-01-01T08:00:00.000Z"
  function timeToUtcIso(t: string | undefined | null) {
    if (!t) return null; // 給後端判斷要不要存
    const [h, m] = t.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;

    const d = new Date(Date.UTC(1970, 0, 1, h, m, 0));
    return d.toISOString(); // e.g. "1970-01-01T08:00:00.000Z"
  }

  const openingHoursPayload = useMemo(() => {
    return hours.map((h) => {
      if (h.isClosed) {
        return {
          weekday: h.weekday,
          isClosed: true,
          openTime: null,
          closeTime: null,
        };
      }

      return {
        weekday: h.weekday,
        isClosed: false,
        openTime: timeToUtcIso(h.openTime), // "HH:mm" -> ISO UTC
        closeTime: timeToUtcIso(h.closeTime),
      };
    });
  }, [hours]);

  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!open) {
      // reset when close
      setType('spot');
      setName('地標建立測試');
      setIntroduce('這是一個Demo用的地標建立測試');
      setAddress('臺北市大安區復興南路一段390號');
      setRegion('大安區');
      setContact('02-12345678');
      setLatitude('25.0339444');
      setLongitude('121.5432777');
      setPhotoFiles([]); // 有問題
      setScore(5);
      setComment('寫前端跟後端真是太好玩了，五星好評!');
      setHours(
        Array.from({ length: 7 }, (_, i) => ({
          weekday: i,
          isClosed: true,
          openTime: '',
          closeTime: '',
        }))
      );
      setErr(null);
      setLoading(false);
    }
  }, [open]);

  function appendFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (!arr.length) return;
    setPhotoFiles((prev) => [...prev, ...arr]);
  }

  async function handleSubmit() {
    setErr(null);

    if (!name.trim()) return setErr('請輸入名稱');
    if (!introduce.trim() || introduce.trim().length < 10) {
      return setErr('介紹至少 10 個字');
    }
    if (!address.trim()) return setErr('請輸入地址');
    if (!region.trim()) return setErr('請輸入地區/城市');

    if (!(score >= 1 && score <= 5)) return setErr('請選擇 1～5 分的評分');
    if (!comment.trim()) return setErr('請輸入留言');

    setLoading(true);

    try {
      // ⭐⭐ 用 FormData 取代 JSON
      const form = new FormData();
      form.append('type', type);
      form.append('name', name.trim());
      form.append('address', address.trim());
      form.append('region', region.trim());
      form.append('introduce', introduce.trim());
      form.append('openingHours', JSON.stringify(openingHoursPayload));

      const trimmedContact = contact.trim();
      if (trimmedContact) {
        form.append('contact', trimmedContact);
      }

      if (latitude !== '' && longitude !== '') {
        form.append('latitude', latitude);
        form.append('longitude', longitude);
      }

      // ⭐⭐ 把所有 File 都 append 進去（後端會用 multer.array("photos") 接收）
      photoFiles.forEach((file) => {
        form.append('photos', file);
      });

      // 1) 建立地標 — multipart/form-data

      console.log('token =', token);
      const res = await fetch(`${apiBase}/api/place`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`建立地標失敗: ${text}`);
      }

      const json = await res.json();
      const place = json.data;
      if (!place?.id) throw new Error('建立成功但未取得 place.id');

      // 2) 建立評分

      await createOrUpsertRank(place.id, score, userId);

      // 3) 建立留言
      await createOrUpsertComment(place.id, comment.trim(), userId);

      // 4) 🔍 再打一次詳情 API，把 Photos 也拉回來
      let fullPlace: any = place;
      try {
        const detailRes = await fetch(`${apiBase}/api/place/${place.id}`, {
          method: 'GET',
        });
        if (detailRes.ok) {
          const detailJson = await detailRes.json();
          if (detailJson?.data) {
            fullPlace = detailJson.data; // 這個通常就會有 Photos
          }
        }
      } catch (e) {
        console.warn('fetch place detail failed, use basic place only', e);
      }

      // 5) 補齊 stats 後再通知父層（fullPlace 裡如果有 Photos，Drawer 就吃得到）
      const placeForUI = {
        ...fullPlace,
        stats: fullPlace?.stats ?? { avg: score, count: 1 },
        ratingAvg: (fullPlace as any)?.ratingAvg ?? score,
        ratingCount: (fullPlace as any)?.ratingCount ?? 1,
      };

      try {
        onCreated?.(placeForUI); // 🔥 這裡丟出去的就是「有 Photos 的版本」
        setToast({
          message: '地標已成功建立！',
          type: 'success',
        });
      } catch (e) {
        console.error('onCreated error:', e);
        setErr('建立成功，但更新畫面時發生錯誤（缺少 avg）。');
      }
    } catch (e: any) {
      setErr(e?.message ?? '發生錯誤');
    } finally {
      setLoading(false);
    }
  }

  function toggleClosed(i: number) {
    setHours((prev) => {
      const next = [...prev];
      const row = { ...next[i], isClosed: !next[i].isClosed };
      if (row.isClosed) {
        row.openTime = '';
        row.closeTime = '';
      }
      next[i] = row;
      return next;
    });
  }

  function setTime(i: number, key: 'openTime' | 'closeTime', val: string) {
    setHours((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val, isClosed: false, weekday: i };
      return next;
    });
  }

  if (!open && !toast) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-[min(720px,95vw)] max-h-[90vh] overflow-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-amber-800">新增地標</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full border border-amber-200 text-sm text-amber-700 hover:bg-amber-50"
          >
            關閉
          </button>
        </div>

        {err && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
            {err}
          </div>
        )}

        {/* 奶茶色大卡片 */}
        <div className="rounded-3xl border-2 border-amber-300 bg-[#FFF7E4] px-6 py-5 space-y-5">
          {/* 基本資料 */}
          <div className="grid grid-cols-2 gap-4">
            <label className="col-span-1 text-sm text-amber-900">
              類型
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="spot">景點</option>
                <option value="food">美食</option>
              </select>
            </label>

            <label className="col-span-1 text-sm text-amber-900">
              地名*
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="輸入地標名稱"
              />
            </label>

            <label className="col-span-2 text-sm text-amber-900">
              描述*
              <textarea
                value={introduce}
                onChange={(e) => setIntroduce(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                rows={3}
                placeholder="簡短介紹這個地標…（至少 10 字）"
              />
            </label>

            <label className="col-span-2 text-sm text-amber-900">
              地址*
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="例如：新北市新店區…"
              />
            </label>

            <label className="col-span-1 text-sm text-amber-900">
              地區/城市*
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="例如：新店區 / 台北市"
              />
            </label>

            <label className="col-span-1 text-sm text-amber-900">
              聯絡方式（選填）
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="電話或社群帳號"
              />
            </label>

            <label className="col-span-1 text-sm text-amber-900">
              緯度 (lat)
              <input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                type="number"
                step="any"
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="25.033944"
              />
            </label>
            <label className="col-span-1 text-sm text-amber-900">
              經度 (lng)
              <input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                type="number"
                step="any"
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="121.543278"
              />
            </label>
          </div>

          {/* 圖片：拖拉上傳區塊 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-amber-900">圖片：</div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.length) {
                  appendFiles(e.dataTransfer.files);
                  e.dataTransfer.clearData();
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                isDragging
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-amber-300 bg-white'
              }`}
            >
              <div className="text-3xl leading-none text-amber-400">+</div>
              <p className="mt-2 text-sm text-gray-700">
                Drop your files here, or{' '}
                <span className="text-indigo-500 underline">
                  click to browse
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Unlimited files, 5GB total limit.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  appendFiles(e.target.files);
                  // 讓同一檔案可以再次選取
                  e.target.value = '';
                }
              }}
            />
            {photoFiles.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                已選擇 {photoFiles.length} 張照片
                <div className="mt-1 flex flex-wrap gap-1">
                  {photoFiles.map((f, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900"
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 評分與留言 */}
          <div className="rounded-2xl border border-amber-200 bg-white px-4 py-3">
            <div className="font-medium text-amber-900 mb-2">您的評價：</div>
            <label className="block text-sm text-amber-900">
              留言
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                rows={3}
                placeholder="Type your comment here ︱"
              />
            </label>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-gray-700">評分</span>
              <StarRatingInput value={score} onChange={(v) => setScore(v)} />
            </div>
          </div>

          {/* 營業時間 */}
          <div>
            <div className="mb-2 font-medium text-amber-900 text-sm">
              營業時間（可公休）
            </div>
            <div className="space-y-2">
              {hours.map((h, i) => (
                <div
                  key={h.weekday}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="w-10 text-amber-900">
                    週{weekdays[h.weekday]}
                  </div>
                  <label className="flex items-center gap-2 text-amber-900">
                    <input
                      type="checkbox"
                      checked={h.isClosed}
                      onChange={() => toggleClosed(i)}
                    />
                    公休
                  </label>
                  <input
                    type="time"
                    disabled={h.isClosed}
                    value={h.openTime}
                    onChange={(e) => setTime(i, 'openTime', e.target.value)}
                    className="rounded-md border border-amber-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <span>—</span>
                  <input
                    type="time"
                    disabled={h.isClosed}
                    value={h.closeTime}
                    onChange={(e) => setTime(i, 'closeTime', e.target.value)}
                    className="rounded-md border border-amber-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-800 bg-white hover:bg-amber-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
          >
            {loading ? '建立中…' : '完成'}
          </button>
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {
            // Toast 淡出結束 or 點 × 時會呼叫這裡
            setToast(null);

            // ✅ 只有成功時我們才希望自動關 modal
            if (toast.type === 'success') {
              onClose();
            }
          }}
        />
      )}
    </div>
  );
}
