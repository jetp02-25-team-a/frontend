'use client';
interface InfoButtomProps {
  button_name: string;
  state: 'solid' | 'hollow';
  onClick?: () => void;
}

export default function InfoButton({
  button_name,
  state,
  onClick,
}: InfoButtomProps) {
  return (
    <>
      <button
        className={`${state === 'hollow' ? 'border-2 border-yellow-orange' : 'yellow-orange '}  rounded-md px-5 py-1.5 cursor-pointer`}
        onClick={onClick}
      >
        <p
          className={`${state === 'hollow' ? 'text-[#797878]' : ' text-white'}`}
        >
          {' '}
          {button_name}
        </p>
      </button>
    </>
  );
}
