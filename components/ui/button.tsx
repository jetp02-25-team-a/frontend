import Link from 'next/link';
export default function Button() {
  return (
    <Link href="/member/login">
      <button className="bg-amber-100 px-10 py-0.5 rounded-xl">
        登入/註冊
      </button>
    </Link>
  );
}
