'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TripCard from './TripCard';

import DatePicker, { registerLocale } from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

import { DestinationAPI, TripAPI } from '@/app/trip/utils/api';

registerLocale('zh-TW', zhTW);

// --------------------------------------------------
// 型別定義
// --------------------------------------------------
interface Destination {
  id: number;
  name: string;
  cover_url: string;
}

export default function NewTripForm() {
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: '',
    destinationId: '',
    startDate: '',
    endDate: '',
    coverImage: '',
  });

  // --------------------------------------------------
  // 取得目的地列表
  // --------------------------------------------------
  useEffect(() => {
    async function loadDestinations() {
      try {
        const list = await DestinationAPI.getAll();

        // 自動附上圖片
        const withImages = list.map((d) => ({
          ...d,
          cover_url: `https://picsum.photos/seed/dest-${d.id}/600/400`,
        }));

        setDestinations(withImages);
      } catch (err) {
        console.error('❌ 無法載入目的地列表:', err);
      }
    }

    loadDestinations();
  }, []);

  // --------------------------------------------------
  // 表單欄位：文字 or select
  // --------------------------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // 特別處理目的地 → 同步封面
    if (name === 'destinationId') {
      const selected = destinations.find((d) => d.id === Number(value));
      setForm((prev) => ({
        ...prev,
        destinationId: value,
        coverImage: selected?.cover_url ?? '',
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------------------------------------
  // 建立行程 submit
  // --------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.type ||
      !form.destinationId ||
      !form.startDate ||
      !form.endDate
    ) {
      alert('請完整填寫所有欄位');
      return;
    }

    // 取得使用者資料
    const userData = localStorage.getItem('BackpackUserInfo');
    const parsedUser = userData ? JSON.parse(userData) : null;
    const userId = parsedUser?.id ?? 1; // fallback

    // Payload (依照你 TripAPI.create 規格)
    const payload = {
      userId,
      title: form.title,
      type: form.type,
      destinationId: Number(form.destinationId),
      startDate: form.startDate,
      endDate: form.endDate,
      url: form.coverImage,
    };

    try {
      setSubmitting(true);

      const result = await TripAPI.create(payload);

      if (result.success) {
        router.push(`/trip/${result.data.id}/planner`);
      } else {
        alert(result.message || '建立失敗');
      }
    } catch (err) {
      alert('建立失敗，請稍後再試');
      console.error('❌ 建立行程錯誤：', err);
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl customize_shadow max-w-2xl mx-auto flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-center">建立新的旅程</h2>

      {/* 行程名稱 */}
      <input
        name="title"
        type="text"
        placeholder="行程名稱"
        value={form.title}
        onChange={handleChange}
        required
        className="border border-yellow-orange rounded-lg px-4 py-2 text-sm"
      />

      {/* 行程類型 */}
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
        className="border border-yellow-orange rounded-lg px-4 py-2 text-sm"
      >
        <option value="">選擇行程類型</option>
        <option value="獨旅">獨旅</option>
        <option value="朋友">朋友</option>
        <option value="情侶">情侶</option>
        <option value="家族">家族</option>
      </select>

      {/* 目的地 */}
      <select
        name="destinationId"
        value={form.destinationId}
        onChange={handleChange}
        required
        className="border border-yellow-orange rounded-lg px-4 py-2 text-sm"
      >
        <option value="">選擇目的地</option>
        {destinations.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {/* 日期選擇 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          locale="zh-TW"
          selected={form.startDate ? new Date(form.startDate) : null}
          onChange={(date) =>
            setForm((prev) => ({
              ...prev,
              startDate: date ? date.toISOString().split('T')[0] : '',
            }))
          }
          placeholderText="開始日期"
          dateFormat="yyyy/MM/dd"
          className="border border-yellow-orange rounded-lg px-4 py-2 text-sm w-full"
        />

        <DatePicker
          locale="zh-TW"
          selected={form.endDate ? new Date(form.endDate) : null}
          onChange={(date) =>
            setForm((prev) => ({
              ...prev,
              endDate: date ? date.toISOString().split('T')[0] : '',
            }))
          }
          placeholderText="結束日期"
          dateFormat="yyyy/MM/dd"
          className="border border-yellow-orange rounded-lg px-4 py-2 text-sm w-full"
        />
      </div>

      {/* 按鈕 */}
      <button
        type="submit"
        disabled={submitting}
        className="yellow-orange text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
      >
        {submitting ? '建立中...' : '建立行程'}
      </button>

      {/* 即時預覽 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">即時預覽</h3>
        <div className="max-w-[303px] mx-auto">
          <TripCard
            id={0}
            title={form.title || '預覽行程'}
            area={
              destinations.find((d) => d.id === Number(form.destinationId))
                ?.name || '尚未選擇'
            }
            date={
              form.startDate && form.endDate
                ? `${form.startDate} - ${form.endDate}`
                : '尚未選擇'
            }
            image={
              form.coverImage || 'https://picsum.photos/seed/default/600/400'
            }
          />
        </div>
      </div>
    </form>
  );
}
