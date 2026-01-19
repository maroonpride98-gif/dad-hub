import { PostReaction } from './reaction';

export type GroupCategory =
  | 'Grill Masters'
  | 'Coach Dads'
  | 'New Dads'
  | 'Tech Dads'
  | 'DIY Dads'
  | 'Stay-at-Home Dads'
  | 'Working Dads'
  | 'Gaming Dads'
  | 'Fitness Dads'
  | 'Outdoor Dads'
  | 'Music Dads'
  | 'Sports Dads'
  | 'Other';

export const GROUP_CATEGORIES: { category: GroupCategory; icon: string; color: string }[] = [
  { category: 'Grill Masters', icon: '🍖', color: '#ef4444' },
  { category: 'Coach Dads', icon: '🏈', color: '#f97316' },
  { category: 'New Dads', icon: '👶', color: '#eab308' },
  { category: 'Tech Dads', icon: '💻', color: '#22c55e' },
  { category: 'DIY Dads', icon: '🔨', color: '#14b8a6' },
  { category: 'Stay-at-Home Dads', icon: '🏠', color: '#06b6d4' },
  { category: 'Working Dads', icon: '💼', color: '#3b82f6' },
  { category: 'Gaming Dads', icon: '🎮', color: '#8b5cf6' },
  { category: 'Fitness Dads', icon: '💪', color: '#ec4899' },
  { category: 'Outdoor Dads', icon: '🏕️', color: '#84cc16' },
  { category: 'Music Dads', icon: '🎸', color: '#a855f7' },
  { category: 'Sports Dads', icon: '⚽', color: '#f43f5e' },
  { category: 'Other', icon: '👨‍👧‍👦', color: '#6b7280' },
];

export type MemberRole = 'owner' | 'admin' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: GroupCategory;
  createdBy: string;
  createdByName: string;
  createdAt?: Date;
  memberCount: number;
  postCount: number;
  isPublic: boolean;
  rules?: string[];
  coverImage?: string;
  isMember?: boolean;
  userRole?: MemberRole;
}

export interface GroupMember {
  userId: string;
  userName: string;
  userAvatar: string;
  role: MemberRole;
  joinedAt?: Date;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  author: string;
  avatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  reactions: PostReaction[];
  commentCount: number;
  createdAt?: Date;
  mentions?: string[];
  isPinned?: boolean;
}

export interface GroupPostComment {
  id: string;
  postId: string;
  authorId: string;
  author: string;
  avatar: string;
  text: string;
  createdAt?: Date;
  mentions?: string[];
}

export interface GroupInvite {
  id: string;
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedByName: string;
  invitedUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt?: Date;
}

export function getCategoryInfo(category: GroupCategory) {
  return GROUP_CATEGORIES.find(c => c.category === category) || GROUP_CATEGORIES[GROUP_CATEGORIES.length - 1];
}
