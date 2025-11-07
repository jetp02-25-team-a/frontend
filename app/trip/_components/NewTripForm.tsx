'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TripCard from './TripCard';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('zh-TW', zhTW);

const destinationCoverMap: Record<string, string> = {
  台北: '/covers/taipei.jpg',
  台中: '/covers/taichung.jpg',
  台南: '/covers/tainan.jpg',
  台東: '/covers/taitung.jpg',
  高雄: '/covers/kaohsiung.jpg',
  花蓮: '/covers/hualien.jpg',
  宜蘭: '/covers/yilan.jpg',
  屏東: '/covers/pingtung.jpg',
  桃園: '/covers/taoyuan.jpg',
  新竹: '/covers/hsinchu.jpg',
  嘉義: '/covers/chiayi.jpg',
  彰化: '/covers/changhua.jpg',
  雲林: '/covers/yunlin.jpg',
  苗栗: '/covers/miaoli.jpg',
  南投: '/covers/nantou.jpg',
  基隆: '/covers/keelung.jpg',
  金門: '/covers/kinmen.jpg',
  連江: '/covers/lienchiang.jpg',
  澎湖: '/covers/penghu.jpg',
};

export default function NewTripForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: '',
    destination: '',
    startDate: '',
    endDate: '',
    coverImage: 'https://picsum.photos/200/300.jpg',
  });

  // ✅ 表單變更
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'destination' && {
        coverImage: destinationCoverMap[value] || '/covers/default.jpg',
      }),
    }));
  };

  // ✅ 送出表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.destination || !form.startDate || !form.endDate) {
      alert('請完整填寫所有欄位');
      return;
    }

    // ✅ 從 localStorage 抓登入使用者資訊
    const userData = localStorage.getItem('BackpackUserInfo');
    const parsedUser = userData ? JSON.parse(userData) : null;

    const payload = {
      userId: parsedUser?.id || 1, // 預設 1，避免未登入出錯
      title: form.title,
      area: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      // ✅ 修正 URL 驗證問題：補上完整網址
      url: form.coverImage.startsWith('http')
        ? form.coverImage
        : `${window.location.origin}${form.coverImage}`,
    };

    try {
      setSubmitting(true);
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

      const res = await fetch(`${API_URL}/api/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parsedUser?.token || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        // ✅ 修正 undefined 問題：用 result.data.id
        router.push(`/trip/${result.data.id}/planner`);
      } else {
        alert('建立失敗：' + result.message);
      }
    } catch (err) {
      alert('建立失敗，請稍後再試');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ UI
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl customize_shadow max-w-2xl mx-auto flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-center">建立新的旅程</h2>
      <p className="text-sm text-center customize_text_gray">
        請填寫以下資訊以建立行程
      </p>

      <input
        type="text"
        name="title"
        placeholder="行程名稱"
        value={form.title}
        onChange={handleChange}
        required
        className="border border-yellow-orange rounded-lg px-4 py-2 text-sm"
      />

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

      <select
        name="destination"
        value={form.destination}
        onChange={handleChange}
        required
        className="border border-yellow-orange rounded-lg px-4 py-2 text-sm"
      >
        <option value="">選擇目的地</option>
        {Object.keys(destinationCoverMap).map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          locale="zh-TW"
          selected={form.startDate ? new Date(form.startDate) : null}
          onChange={(date) =>
            setForm((prev) => ({
              ...prev,
              startDate: date?.toISOString().split('T')[0] || '',
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
              endDate: date?.toISOString().split('T')[0] || '',
            }))
          }
          placeholderText="結束日期"
          dateFormat="yyyy/MM/dd"
          className="border border-yellow-orange rounded-lg px-4 py-2 text-sm w-full"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="yellow-orange text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
      >
        {submitting ? '建立中...' : '建立行程'}
      </button>

      {/* ✅ 即時預覽 TripCard */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">即時預覽</h3>
        <div className="max-w-[303px] mx-auto">
          <TripCard
            id={0}
            title={form.title || '預覽行程'}
            area={form.destination || '尚未填寫'}
            date={
              form.startDate && form.endDate
                ? `${form.startDate} - ${form.endDate}`
                : '尚未選擇'
            }
            image={form.coverImage || '/covers/default.jpg'}
          />
        </div>
      </div>
    </form>
  );
}
