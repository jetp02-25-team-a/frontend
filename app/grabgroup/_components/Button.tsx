'use client';

interface ButtonProps {
  content: string;
  onClick?: () => void;
}

export default function Button({ content }: ButtonProps) {
  return (
    <button className="cursor-pointer text-gray-500 text-base bg-white border-2 border-yellow-orange px-10 py-2.5 rounded-full active:bg-[#F2A922] active:text-white">
      {content}
    </button>
  );
}
