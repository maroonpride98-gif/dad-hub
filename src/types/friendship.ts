export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  friendDadSince: string;
  addedAt: string;
  lastMessageAt?: string;
}

export interface UserSearchResult {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  dadSince: string;
  isFriend: boolean;
  hasPendingRequest: boolean;
  requestDirection?: 'sent' | 'received';
}
