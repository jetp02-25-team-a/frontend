'use client';
interface InfoButtomProps {
  button_name: string;
}

export default function InfoButton({ button_name }: InfoButtomProps) {
  return (
    <>
      <button className=" border-2 border-yellow-orange rounded-md px-5 py-1.5 cursor-pointer">
        <p className="text-[#797878]"> {button_name}</p>
      </button>
    </>
  );
}
