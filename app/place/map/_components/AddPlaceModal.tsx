'use client';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

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
  onPickCoord, // 觸發一次「從地圖點選座標」
  mapCenter, // [lat, lng]
  onCreated, // 建立成功回調
  apiBase,
  currentUserId = 10, // TODO: 之後接登入
}: {
  open: boolean;
  onClose: () => void;
  onPickCoord: () => void;
  mapCenter: [number, number];
  onCreated?: (place: any) => void;
  apiBase: string;
  currentUserId?: number;
}) {
  const [type, setType] = useState<'food' | 'spot'>('spot');
  const [name, setName] = useState('');
  const [introduce, setIntroduce] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [photosText, setPhotosText] = useState(''); // 以換行輸入圖片 URL
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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

  const openingHoursPayload = useMemo(() => {
    // 只送有意義的天；公休送 { weekday, isClosed: true }
    return hours.map((h) => {
      if (h.isClosed) return { weekday: h.weekday, isClosed: true };
      return {
        weekday: h.weekday,
        openTime: h.openTime, // "HH:mm"
        closeTime: h.closeTime,
      };
    });
  }, [hours]);

  useEffect(() => {
    if (!open) {
      // reset when close
      setType('spot');
      setName('');
      setIntroduce('');
      setAddress('');
      setRegion('');
      setLatitude('');
      setLongitude('');
      setPhotosText('');
      setScore(0);
      setComment('');
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

  async function postJSON(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text().catch(() => '');
    if (!res.ok)
      throw new Error(`${url} ${res.status}: ${text || 'Request failed'}`);
    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
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
      const photos = photosText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const body: any = {
        type,
        name: name.trim(),
        address: address.trim(),
        region: region.trim(),
        introduce: introduce.trim(),
        openingHours: openingHoursPayload,
        photos: photos.length ? photos : undefined,
      };

      // 經緯度可選：若有就帶
      if (latitude !== '' && longitude !== '') {
        body.latitude = Number(latitude);
        body.longitude = Number(longitude);
      }

      // 1) 建地標
      const placeJson = await postJSON(`${apiBase}/api/place`, body);
      const place = placeJson?.data ?? placeJson; // 相容不同包裝
      if (!place?.id) throw new Error('建立地標成功但未取得 place.id');

      // 2) 建立評分（必填）
      // 優先嘗試 nested 路由；失敗再嘗試非 nested
      try {
        await postJSON(`${apiBase}/api/place/${place.id}/ranks`, {
          score,
          userId: currentUserId,
        });
      } catch {
        await postJSON(`${apiBase}/api/rank`, {
          placeId: place.id,
          score,
          userId: currentUserId,
        });
      }

      // 3) 建立留言（必填）
      try {
        await postJSON(`${apiBase}/api/place/${place.id}/comments`, {
          content: comment.trim(),
          userId: currentUserId,
        });
      } catch {
        await postJSON(`${apiBase}/api/comment`, {
          placeId: place.id,
          content: comment.trim(),
          userId: currentUserId,
        });
      }

      // 4) 補齊 stats 後再通知父層（避免父層拿到沒有 avg 的 place）
      const placeForUI = {
        ...place,
        // 你項目裡其他地方可能讀 stats.avg 或 ratingAvg，兩個都補上
        stats: place?.stats ?? { avg: score, count: 1 },
        ratingAvg: (place as any)?.ratingAvg ?? score,
        ratingCount: (place as any)?.ratingCount ?? 1,
      };

      try {
        onCreated?.(placeForUI); // 父層再拿去 setState
        onClose();
      } catch (e) {
        console.error('onCreated error:', e);
        setErr('建立成功，但更新畫面時發生錯誤（缺少 avg）。'); // 不會再顯示 undefined.avg
      }
    } catch (e: any) {
      setErr(e?.message ?? '發生錯誤');
    } finally {
      setLoading(false);
    }
  }

  function useMapCenter() {
    setLatitude(mapCenter[0]);
    setLongitude(mapCenter[1]);
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                w-[min(640px,95vw)] max-h-[90vh] overflow-auto rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">新增地標</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border hover:bg-gray-50"
          >
            關閉
          </button>
        </div>

        {err && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700">
            {err}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-1 text-sm">
            類型
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-1 w-full rounded-md border px-2 py-1"
            >
              <option value="spot">景點</option>
              <option value="food">美食</option>
            </select>
          </label>

          <label className="col-span-1 text-sm">
            名稱*
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border px-2 py-1"
              placeholder="地標名稱"
            />
          </label>

          <label className="col-span-2 text-sm">
            介紹*（至少 10 字）
            <textarea
              value={introduce}
              onChange={(e) => setIntroduce(e.target.value)}
              className="mt-1 w-full rounded-md border px-2 py-2"
              rows={3}
              placeholder="簡短介紹這個地標…"
            />
          </label>

          <label className="col-span-2 text-sm">
            地址*
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-md border px-2 py-1"
              placeholder="完整地址"
            />
          </label>

          <label className="col-span-1 text-sm">
            地區/城市*
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full rounded-md border px-2 py-1"
              placeholder="例如：台北市"
            />
          </label>

          <div className="col-span-1 flex items-end gap-2">
            <button
              onClick={useMapCenter}
              className="h-9 rounded-md border px-3 text-sm hover:bg-gray-50"
              title="用目前地圖中心設定經緯度"
            >
              用地圖中心
            </button>
            <button
              onClick={onPickCoord}
              className="h-9 rounded-md border px-3 text-sm hover:bg-gray-50"
              title="在地圖上點一個位置"
            >
              從地圖取點
            </button>
          </div>

          <label className="col-span-1 text-sm">
            緯度 (lat)
            <input
              value={latitude}
              onChange={(e) =>
                setLatitude(e.target.value ? Number(e.target.value) : '')
              }
              type="number"
              step="any"
              className="mt-1 w-full rounded-md border px-2 py-1"
              placeholder="例如 25.03"
            />
          </label>
          <label className="col-span-1 text-sm">
            經度 (lng)
            <input
              value={longitude}
              onChange={(e) =>
                setLongitude(e.target.value ? Number(e.target.value) : '')
              }
              type="number"
              step="any"
              className="mt-1 w-full rounded-md border px-2 py-1"
              placeholder="例如 121.56"
            />
          </label>

          <label className="col-span-2 text-sm">
            照片 URL（每行一個）
            <textarea
              value={photosText}
              onChange={(e) => setPhotosText(e.target.value)}
              className="mt-1 w-full rounded-md border px-2 py-2"
              rows={2}
              placeholder="https://...jpg\nhttps://...png"
            />
          </label>
        </div>

        {/* ⭐ 評分與留言（必填） */}
        <div className="mt-5 rounded-xl border p-3">
          <div className="font-medium">評分與留言（必填）</div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-gray-600">評分</span>
            <StarRatingInput value={score} onChange={(v) => setScore(v)} />
          </div>
          <label className="block mt-3 text-sm">
            留言
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full rounded-md border px-2 py-2"
              rows={3}
              placeholder="請輸入你的心得（必填）"
            />
          </label>
        </div>

        {/* 營業時間 */}
        <div className="mt-4">
          <div className="mb-2 font-medium">營業時間（可公休）</div>
          <div className="space-y-2">
            {hours.map((h, i) => (
              <div key={h.weekday} className="flex items-center gap-3">
                <div className="w-8 text-sm text-gray-600">
                  週{weekdays[h.weekday]}
                </div>
                <label className="flex items-center gap-2 text-sm">
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
                  className="rounded-md border px-2 py-1"
                />
                <span>—</span>
                <input
                  type="time"
                  disabled={h.isClosed}
                  value={h.closeTime}
                  onChange={(e) => setTime(i, 'closeTime', e.target.value)}
                  className="rounded-md border px-2 py-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? '建立中…' : '建立地標'}
          </button>
        </div>
      </div>
    </div>
  );
}
