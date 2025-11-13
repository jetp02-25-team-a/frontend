'use client';
import ChatBox from '../../_components/chat-box';

interface Member {
  id: number;
  nickname: string;
  avatar: string;
}

interface ChatInterface {
  user_name: string | null;
  user_id: number | null;
  image: string | null;
  content: string | null;
  time: string | null;
  room_name: string | null;
  room_id: number | null;
  members?: Member[]; // 新增成員陣列
}

export default function OpenChatWindows({
  openChats,
  setOpenChats,
}: {
  openChats: ChatInterface[];
  setOpenChats: React.Dispatch<React.SetStateAction<ChatInterface[]>>;
}) {
  //關閉聊天室
  const closeChat = (index: number) => {
    const nextChats = openChats.filter((room) => room !== openChats[index]);
    setOpenChats(nextChats);
  };
  return (
    <div className="absolute right-0 bottom-0 flex gap-2.5 items-end">
      {openChats.map((chatroom, index) => {
        return (
          <ChatBox
            key={index}
            roomId={chatroom.room_id}
            roomTitle={chatroom.room_name}
            userId={chatroom.user_id}
            userNickname={chatroom.user_name}
            members={chatroom.members}
            onClose={() => closeChat(index)}
          />
        );
      })}
    </div>
  );
}
