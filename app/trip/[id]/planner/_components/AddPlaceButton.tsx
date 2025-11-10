'use client';

interface AddPlaceButtonProps {
  label: string;
  onClick?: () => void;
}

export default function AddPlaceButton({
  label,
  onClick,
}: AddPlaceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 focus:outline-none"
    >
      <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center shadow-[0_4px_10px_rgba(0,0,0,0.25)] cursor-pointer">
        <span className="text-lg">＋</span>
      </div>
      <p className="text-sm text-gray-700">{label}</p>
    </button>
  );
}
