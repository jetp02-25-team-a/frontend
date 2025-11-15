'use client';

import MessageBox from './message-box';

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

interface RoomData {
  createdAt: string;
  id: number;
  roomName: string;
}

interface Member {
  id: number;
  nickname: string;
  avatar: string;
}

interface RoomMessage {
  LatestMessage: {
    content: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
  } | null;
  members: Member[];
  roomData: RoomData;
}

interface FriendData {
  avatar: string | null;
  id: number;
  nickname: string;
}

interface PersonMessage {
  LatestMessage: {
    content: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
  };
  friendData: FriendData;
}

export default function ContactList({
  contact,
  userId,
  openChats,
  onOpenChat,
}: {
  contact: any;
  userId: number;
  openChats: ChatInterface[];
  onOpenChat: (chat: ChatInterface) => void;
}) {
  // console.log('contact==>', contact);
  return (
    <div>
      {/* 團體聊天室 */}
      {contact.allRoomsLatestMessages.map(
        (message: RoomMessage, index: number) => {
          // 取得第一個成員的頭像作為群組顯示圖片，或使用預設圖片
          // const groupImage =
          //   message.members && message.members.length > 0
          //     ? message.members[0].avatar
          //     : '/place-default_avatar.jpg';
          const groupImage = '/place-default_avatar.jpg';

          const newChat = {
            user_name: null,
            user_id: null,
            image: null,
            content: message.LatestMessage?.content ?? null,
            time: new Date().toISOString(),
            room_name: message.roomData.roomName,
            room_id: message.roomData.id,
            members: message.members, // 傳遞成員陣列
          };

          return (
            <MessageBox
              key={index}
              userId={userId}
              receiverId={message.LatestMessage?.receiverId}
              senderId={message.LatestMessage?.senderId}
              isRead={message.LatestMessage?.isRead}
              title={message.roomData.roomName}
              content={
                message.LatestMessage
                  ? message.LatestMessage.content
                  : '還沒有訊息'
              }
              image={groupImage}
              time={null}
              onClick={() => onOpenChat(newChat)}
            />
          );
        }
      )}

      {/* 個人聊天 */}
      {contact.allFriendLatestMessage.map(
        (message: PersonMessage, index: number) => {
          const newChat = {
            user_name: message.friendData.nickname,
            user_id: message.friendData.id,
            image: message.friendData.avatar,
            content: message.LatestMessage?.content ?? null,
            time: new Date().toISOString(),
            room_name: null,
            room_id: null,
          };

          return (
            <MessageBox
              key={index}
              userId={userId}
              receiverId={message.LatestMessage?.receiverId}
              senderId={message.LatestMessage?.senderId}
              isRead={message.LatestMessage?.isRead}
              title={message.friendData.nickname}
              content={
                message.LatestMessage
                  ? message.LatestMessage.content
                  : '還沒有訊息'
              }
              image={
                message.friendData.avatar
                  ? message.friendData.avatar
                  : '/avatar_default.png'
              }
              time={null}
              onClick={() => onOpenChat(newChat)}
            />
          );
        }
      )}
    </div>
  );
}
