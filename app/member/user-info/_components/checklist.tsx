'use client';
import Image from 'next/image';
import InfoButton from './InfoButton';
import { useAuth } from '@/hooks/use-Auth';
interface ChecklistProps {
  title: string;
  type: 'agree' | 'answer';
  snederName: string;
  senderAvatar: string;
  invitationId?: number;
  refresh?: () => void;
}

export default function Checklist({
  title,
  type,
  snederName,
  senderAvatar,
  invitationId,
  refresh,
}: ChecklistProps) {
  const { user, isReady } = useAuth();

  const agreeInvite = async (invitationResponse: number) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${
      process.env.NEXT_PUBLIC_BACKEND_API_PORT
    }/api/itineraries/invite`;
    const data = {
      invitationId: invitationId,
      userId: user ? user.id : 0,
      invitationResponse: invitationResponse,
    };
    try {
      const result = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (result.ok) {
        console.log('成功修改');
        refresh && refresh();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-white flex items-center justify-between px-10 py-5 border-b-2 border-gray-300">
      {/* 團主個人訊息 */}
      <div className="flex items-center gap-5">
        <Image
          width={77}
          height={77}
          src={
            senderAvatar
              ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/images/${senderAvatar}`
              : '/avatar.png'
          }
          alt=""
        />
        <div>
          <h3 className="text-xl">{snederName}</h3>
          <InfoButton button_name="個人檔案" state="hollow" />
        </div>
      </div>
      <h2 className="text-2xl">{title}</h2>
      {type === 'answer' && (
        <InfoButton button_name="已加入團隊" state="solid" />
      )}
      {type === 'agree' && (
        <div className="flex gap-2.5">
          <InfoButton
            button_name="同意"
            state="solid"
            onClick={() => agreeInvite(1)} //1 agree
          />
          <InfoButton
            button_name="不同意"
            state="hollow"
            onClick={() => agreeInvite(2)} //2 reject
          />
        </div>
      )}
    </div>
  );
}
