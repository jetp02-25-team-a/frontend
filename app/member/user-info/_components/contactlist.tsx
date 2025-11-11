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
}

interface RoomData {
  createdAt: string;
  id: number;
  roomName: string;
}

interface RoomMessage {
  LatestMessage: {
    content: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
  };
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
  return (
    <div>
      {/* 團體聊天室 */}
      {contact.allRoomsLatestMessages.map(
        (message: RoomMessage, index: number) => {
          const newChat = {
            user_name: null,
            user_id: null,
            image: null,
            content: message.LatestMessage?.content ?? null,
            time: new Date().toISOString(),
            room_name: message.roomData.roomName,
            room_id: message.roomData.id,
          };

          return (
            <MessageBox
              key={index}
              userId={userId}
              title={message.roomData.roomName}
              content={
                message.LatestMessage
                  ? message.LatestMessage.content
                  : '還沒有訊息'
              }
              image={'/place-default_avatar.jpg'}
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
