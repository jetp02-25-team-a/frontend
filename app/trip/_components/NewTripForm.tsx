'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trip } from '../types/trip';
import TripCard from './TripCard';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhTW } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('zh-TW', zhTW);

export default function NewTripForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    type: '',
    departure: '',
    destination: '',
    transport: '',
    startDate: '',
    endDate: '',
    notes: '',
    coverImage: '/covers/tainan.jpg',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('請先登入');
      router.push('/trip/member/login');
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const payload = {
      title: form.title,
      area: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      url: form.coverImage,
    };

    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (result.success) {
      router.push('/trip');
    } else {
      alert('建立失敗：' + result.message);
    }
  };

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

      <input
        type="text"
        name="destination"
        placeholder="目的地"
        value={form.destination}
        onChange={handleChange}
        required
        className="border border-yellow-orange rounded-lg px-4 py-2 text-sm"
      />

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

      {/* ✅ 封面圖片選擇器 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-sm">選擇封面圖片</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            '/covers/tainan.jpg',
            '/covers/hualien.jpg',
            '/covers/taipei.jpg',
          ].map((img) => (
            <img
              key={img}
              src={img}
              alt="封面選擇"
              onClick={() => setForm((prev) => ({ ...prev, coverImage: img }))}
              className={`h-24 w-full object-cover rounded-lg cursor-pointer border-2 ${
                form.coverImage === img
                  ? 'border-yellow-orange'
                  : 'border-transparent'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="yellow-orange text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
      >
        建立行程
      </button>

      {/* ✅ 即時預覽 TripCard */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">即時預覽</h3>
        <div className="max-w-[303px] mx-auto">
          <TripCard
            title={form.title || '預覽行程'}
            area={form.destination || '尚未填寫'}
            date={
              form.startDate && form.endDate
                ? `${form.startDate} - ${form.endDate}`
                : '尚未選擇'
            }
            image={form.coverImage}
          />
        </div>
      </div>
    </form>
  );
}
