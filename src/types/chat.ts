export type ChatType = 'dm' | 'group';

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  members: number;
  memberIds: string[];
  lastMessage: string;
  lastMessageAt?: string;
  time: string;
  unread: number;
  emoji: string;
  createdBy?: string;
  createdAt?: string;
  // DM-specific fields
  dmPartnerId?: string;
  dmPartnerName?: string;
  dmPartnerAvatar?: string;
  // Per-user unread tracking
  unreadCounts?: Record<string, number>;
  lastReadAt?: Record<string, string>;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface Message {
  id: string;
  chatId?: string;
  senderId?: string;
  sender: string;
  senderAvatar?: string;
  text: string;
  time: string;
  timestamp?: string;
  isMe: boolean;
  reactions?: MessageReaction[];
}

export type MessagesMap = Record<string, Message[]>;

export interface CreateGroupChatParams {
  name: string;
  emoji: string;
  memberIds: string[];
}

export interface CreateDMParams {
  friendId: string;
}
