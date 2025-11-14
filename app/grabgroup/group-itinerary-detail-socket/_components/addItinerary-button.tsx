'use client';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
interface AddItineraryButtonProps {
  icon: IconProp;
  btn_name: string;
  onClick?: () => void;
}

export default function AddItineraryButton({
  icon,
  btn_name,
  onClick,
}: AddItineraryButtonProps) {
  return (
    <div className="flex flex-col gap-2.5 " onClick={onClick}>
      <div className="bg-white rounded-full w-11 h-11 flex justify-center items-center m-auto shadow-[0_4px_10px_rgba(0,0,0,0.4)] cursor-pointer">
        <FontAwesomeIcon icon={icon} />
      </div>

      <p>{btn_name}</p>
    </div>
  );
}
