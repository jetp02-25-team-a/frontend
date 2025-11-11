'use client';

interface ButtonProps {
  content: string;
  onClick?: () => void;
}

export default function Button({ content, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer mx-auto text-white w-[200px] text-base border-2 border-yellow-orange px-10 py-2.5 rounded-full bg-[#F2A922] "
    >
      {content}
    </button>
  );
}
