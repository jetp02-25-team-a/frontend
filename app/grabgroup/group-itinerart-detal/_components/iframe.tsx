'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
interface IframeProps {
  visible: boolean;
  onSend: (msg: boolean) => void;
}

export default function Iframe({ visible, onSend }: IframeProps) {
  const router = useRouter();
  const url = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}/grabgroup/panel`;
  return (
    <>
      <div
        className={`absolute bg-[#F7FAFC] w-[564px] h-[779px] rounded-2xl p-4  shadow-[0_4px_10px_rgba(0,0,0,0.4)] space-y-2.5 `}
      >
        <div className="flex justify-end">
          {/* 回上一頁 */}
          <span className={` w-full m-auto`}>
            <FontAwesomeIcon icon={faAngleLeft} onClick={() => router.back()} />
          </span>
          {/* 關閉 */}
          <FontAwesomeIcon
            icon={faXmark}
            onClick={() => onSend(!visible)}
            className="cursor-pointer"
          />
        </div>

        <iframe src={url} className="w-full h-full" />
      </div>
    </>
  );
}
