import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface JoinButtonProps {
  content: string;
  className?: string;
  onClick?: () => void;
  mode?: 'white';
}
export default function JoinButton({
  content,
  className,
  onClick,
  mode,
}: JoinButtonProps) {
  return (
    <>
      <button
        className={` ${mode === 'white' ? 'text-black bg-white' : 'text-white yellow-orange'} cursor-pointer py-3 px-6 rounded-full flex gap-2 items-center
  ${className}`}
        onClick={onClick}
      >
        {content}
        <FontAwesomeIcon
          icon={faArrowRight}
          className={`${mode === 'white' ? 'text-black' : ''}`}
        />
      </button>
    </>
  );
}
