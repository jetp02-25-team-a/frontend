'use client';

interface ListButton {
  name: string;
  icon?: any;
  active: boolean;
  onClick: () => void;
}

export default function ListButton({
  name,
  icon,
  active,
  onClick,
}: ListButton) {
  return (
    <div
      className={`w-full py-2 rounded-t-xl ${active === true ? 'bg-white' : ''}`}
      onClick={onClick}
    >
      <p className="text-center">{name}</p>
    </div>
  );
}
