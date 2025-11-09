'use client';
import RegularButton from '@/components/ui/regular-button';
import { use, useState } from 'react';
import { useAuth } from '@/hooks/use-Auth';
import { number } from 'framer-motion';

interface ResponseBoxProps {
  itineraryId?: number;
}

export default function ResponseBox({ itineraryId }: ResponseBoxProps) {
  const { user, isReady } = useAuth();
  if (user) console.log('user==>', user.email, user.nickname, user.id);
  const url = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}:${process.env.NEXT_PUBLIC_BACKEND_API_PORT}/api/itineraries/create-comment`;
  const handleSubmit = async (input: string) => {
    if (!user) return;
    const body = {
      content: input,
      itineraryId: itineraryId,
      senderId: user.id,
    };
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (result.ok) {
        setComment('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [comment, setComment] = useState('');

  return (
    <>
      <h2 className="text-3xl">回應</h2>
      <textarea
        placeholder="輸入您想留下的內容"
        className="w-[850px] h-[166px] rounded-2xl border-2 border-gray-400 p-4  text-xl"
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(comment);
          }
        }}
      />
      <RegularButton content="回應" onClick={() => handleSubmit(comment)} />
    </>
  );
}
