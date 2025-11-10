import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface JoinButtonProps {
  content: string;
  className?: string;
  onClick?: () => void;
}
export default function JoinButton({
  content,
  className,
  onClick,
}: JoinButtonProps) {
  return (
    <>
      <button
        className={`yellow-orange text-white cursor-pointer py-[12px] px-[24px] rounded-full flex gap-[8px] items-center
  ${className}`}
        onClick={onClick}
      >
        {content}
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </>
  );
}
