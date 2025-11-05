import Link from 'next/link';

interface ComponentsButtonProps {
  path: string;
  text: string;
}

export default function ButtonO({ path, text }: ComponentsButtonProps) {
  return (
    <Link href={path}>
      <button className="bg-[#F2A922] px-10 py-0.5 rounded-xl text-white">
        {text}
      </button>
    </Link>
  );
}
