export interface XPEvent {
  id: string;
  userId: string;
  amount: number;
  reason: XPReason;
  timestamp: Date;
}

export type XPReason =
  | 'post_created'
  | 'comment_added'
  | 'reaction_received'
  | 'joke_shared'
  | 'event_attended'
  | 'friend_added'
  | 'daily_login'
  | 'streak_bonus'
  | 'badge_earned'
  | 'poll_created'
  | 'poll_voted'
  | 'story_posted'
  | 'group_joined'
  | 'group_post'
  | 'wisdom_asked'
  | 'challenge_completed'
  | 'game_won'
  | 'quest_completed'
  | 'referral_bonus';

export const XP_VALUES: Record<XPReason, number> = {
  post_created: 15,
  comment_added: 5,
  reaction_received: 2,
  joke_shared: 10,
  event_attended: 25,
  friend_added: 20,
  daily_login: 10,
  streak_bonus: 5,
  badge_earned: 50,
  poll_created: 15,
  poll_voted: 5,
  story_posted: 10,
  group_joined: 15,
  group_post: 10,
  wisdom_asked: 5,
  challenge_completed: 30,
  game_won: 20,
  quest_completed: 25,
  referral_bonus: 100,
};

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeRequirement {
  type: 'posts' | 'comments' | 'friends' | 'streaks' | 'xp' | 'jokes' | 'events' | 'reactions' | 'groups' | 'stories' | 'level';
  threshold: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: BadgeRarity;
  requirement: BadgeRequirement;
}

export interface LevelDefinition {
  level: number;
  name: string;
  minXP: number;
  icon: string;
  color: string;
}

export const LEVELS: LevelDefinition[] = [
  { level: 1, name: 'Rookie Dad', minXP: 0, icon: '🍼', color: '#78716c' },
  { level: 2, name: 'Diaper Pro', minXP: 100, icon: '👶', color: '#a8a29e' },
  { level: 3, name: 'Bedtime Boss', minXP: 300, icon: '🌙', color: '#84cc16' },
  { level: 4, name: 'Grill Master', minXP: 600, icon: '🔥', color: '#22c55e' },
  { level: 5, name: 'Dad Joke Legend', minXP: 1000, icon: '😂', color: '#3b82f6' },
  { level: 6, name: 'Super Dad', minXP: 1500, icon: '🦸', color: '#8b5cf6' },
  { level: 7, name: 'Elite Father', minXP: 2500, icon: '⚡', color: '#ec4899' },
  { level: 8, name: 'Dad of the Year', minXP: 4000, icon: '🏆', color: '#f59e0b' },
  { level: 9, name: 'Legendary Father', minXP: 6000, icon: '👑', color: '#ef4444' },
  { level: 10, name: 'Dad God', minXP: 10000, icon: '🌟', color: '#ffd700' },
];

export interface UserGamification {
  xp: number;
  level: number;
  levelName: string;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  streakFreezes: number;
  totalActiveDays: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  streakFreezes: number;
  totalActiveDays: number;
  activityHistory: ActivityDay[];
}

export interface ActivityDay {
  date: string;
  active: boolean;
  xpEarned: number;
}

export type LeaderboardType = 'weekly' | 'monthly' | 'allTime';

export interface LeaderboardData {
  type: LeaderboardType;
  entries: LeaderboardEntryFull[];
  updatedAt: Date;
  periodStart?: Date;
  periodEnd?: Date;
}

export interface LeaderboardEntryFull {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  levelIcon: string;
  isYou?: boolean;
  title?: string;
  titleEmoji?: string;
}

export function getLevelFromXP(xp: number): LevelDefinition {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPToNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.minXP - xp;
}

export function getLevelProgress(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  if (!nextLevel) return 100;
  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForLevel = nextLevel.minXP - currentLevel.minXP;
  return Math.round((xpInCurrentLevel / xpNeededForLevel) * 100);
}
