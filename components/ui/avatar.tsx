// import Image from 'next/image';
export default function Avatar() {
  return (
    <>
      <img
        src="/avatar_default.png"
        alt="用戶頭像"
        className=" rounded-full border-white border-2"
        width={36}
        height={36}
        // priority
      ></img>
    </>
  );
}
