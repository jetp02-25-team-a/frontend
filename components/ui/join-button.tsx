import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface JoinButtonProps {
  content: string;
  className?: string;
}
export default function JoinButton({ content, className }: JoinButtonProps) {
  return (
    <>
      <button
        className={`yellow-orange text-white cursor-pointer py-[12px] px-[24px] rounded-full flex gap-[8px] items-center
  ${className}`}
      >
        {content}
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </>
  );
}
