"use client";

interface MessageBoxProps {
  avatar?: string;
  user_name: string;
  create_at: string;
  content: string;
}

export default function MessageBox({
  avatar,
  user_name,
  create_at,
  content,
}: MessageBoxProps) {
  return (
    <>
      <div className="bg-white border-2 border-[#E3E3E3] rounded-2xl w-[850px] h-auto p-[20px] space-y-[40px]">
        <div className="flex justify-between">
          <div className="flex items-center gap-[20px]">
            <img
              src={`./${avatar}`}
              className="rounded-full w-[40px] h-[40px]"
              alt=""
            />
            <h2 className="text-xl">{user_name}</h2>
          </div>
          <div className="text-sm text-gray-400">{create_at}</div>
        </div>
        <p>{content}</p>
      </div>
    </>
  );
}
