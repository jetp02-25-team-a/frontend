// components/spot/Reviews/ReviewComposer.tsx
"use client";
import { useState } from "react";
export default function ReviewComposer() {
  const [text, setText] = useState("");
  const [star, setStar] = useState(5);
  return (
    <section className="rounded-2xl border p-4  w-[60%]">
      <h3 className="font-semibold mb-2">撰寫評論</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">評分</span>
        <select
          value={star}
          onChange={(e) => setStar(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map((s) => (
            <option key={s} value={s}>
              {s} ★
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="輸入你的心得（僅前端展示，不送出）"
        className="w-full min-h-[100px] rounded-xl border p-3"
      />
      <div className="mt-3 flex gap-2">
        <button className="rounded-xl bg-yellow-500 text-white px-4 py-2">
          送出（假）
        </button>
        <button
          className="rounded-xl border px-4 py-2"
          onClick={() => {
            setText("");
            setStar(5);
          }}
        >
          清除
        </button>
      </div>
    </section>
  );
}
