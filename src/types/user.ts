export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
  avatar: string;
  dadSince: string;
  badges: Badge[];
  points: number;
  kids: number;
  xp: number;
  level: number;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  groupIds?: string[];
  isAdmin?: boolean;
  isModerator?: boolean;
  isBanned?: boolean;
  banReason?: string;
  status?: 'active' | 'suspended' | 'banned';
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId?: string;
  name: string;
  avatar?: string;
  points: number;
  xp?: number;
  level?: number;
  levelIcon?: string;
  badge?: string;
  isYou?: boolean;
}

export interface UserStats {
  postsCreated: number;
  commentsMade: number;
  eventsAttended: number;
  jokesShared: number;
}
