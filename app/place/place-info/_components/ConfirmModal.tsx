'use client';

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h2>
        <p className="text-sm text-neutral-600 whitespace-pre-line mb-4">
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm hover:bg-neutral-50 hover:cursor-pointer"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            className="rounded-full bg-red-500 px-4 py-1.5 text-sm text-white hover:bg-red-600 hover:cursor-pointer"
            onClick={onConfirm}
          >
            確定刪除
          </button>
        </div>
      </div>
    </div>
  );
}
