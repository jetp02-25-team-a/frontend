'use client';

interface ButtonProps {
  content: string;
  onClick?: () => void;
}

export default function Button({ content }: ButtonProps) {
  return (
    <button className="cursor-pointer text-white w-full text-base border-2 border-yellow-orange px-10 py-2.5 rounded-full bg-[#F2A922] ">
      {content}
    </button>
  );
}
