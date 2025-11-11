'use client';
import { useEffect, useMemo, useState } from 'react';

type OpeningRow = {
  weekday: number; // 0~6
  isClosed: boolean;
  openTime: string; // "HH:mm" or ""
  closeTime: string; // "HH:mm" or ""
};

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

export default function AddPlaceModal({
  open,
  onClose,
  onPickCoord, // 觸發一次「從地圖點選座標」
  mapCenter, // [lat, lng]
  onCreated, // 建立成功回調
  apiBase,
}: {
  open: boolean;
  onClose: () => void;
  onPickCoord: () => void;
  mapCenter: [number, number];
  onCreated?: (place: any) => void;
  apiBase: string;
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

  const [hours, setHours] = useState<OpeningRow[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      weekday: i,
      isClosed: true,
      openTime: '',
      closeTime: '',
    }))
  );

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

  async function handleSubmit() {
    setErr(null);

    if (!name.trim()) return setErr('請輸入名稱');
    if (!introduce.trim() || introduce.trim().length < 10) {
      return setErr('介紹至少 10 個字');
    }
    if (!address.trim()) return setErr('請輸入地址');
    if (!region.trim()) return setErr('請輸入地區/城市');

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
      console.log('送出 openingHours：', openingHoursPayload);

      const res = await fetch(`${apiBase}/api/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || '建立失敗');
      }

      onCreated?.(json.data);
      onClose();
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
