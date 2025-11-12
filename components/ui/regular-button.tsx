'use client';

interface ButtonProps {
  content: string;
  onClick?: () => void;
  mode: 'hollow' | 'solid';
}

export default function Button({ content, onClick, mode }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${mode === 'solid' ? 'text-white bg-[#F2A922]' : 'text-gray-500 bg-white border-yellow-orange'} cursor-pointer inline-flex items-center justify-center text-base border-2 px-6 py-2 rounded-full shrink-0`}
    >
      {content}
    </button>
  );
}
