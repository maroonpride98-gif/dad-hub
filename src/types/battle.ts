export type BattleStatus = 'pending' | 'active' | 'voting' | 'completed';

export interface JokeBattleParticipant {
  userId: string;
  userName: string;
  userAvatar: string;
  joke: string;
  votes: number;
  voterIds: string[];
  submittedAt?: Date;
}

export interface JokeBattle {
  id: string;
  title: string;
  theme?: string;
  participant1: JokeBattleParticipant;
  participant2: JokeBattleParticipant;
  status: BattleStatus;
  winnerId?: string;
  totalVotes: number;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  xpReward: number;
  isFeatured?: boolean;
}

export interface BattleChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  challengedId: string;
  challengedName: string;
  challengedAvatar: string;
  theme?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

export interface BattleStats {
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  totalVotesReceived: number;
  lastBattleAt?: Date;
}

export interface BattleLeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  wins: number;
  winRate: number;
  title?: string;
  titleEmoji?: string;
}

export const BATTLE_THEMES = [
  { id: 'classic', label: 'Classic Dad Jokes', emoji: '😂' },
  { id: 'puns', label: 'Pun-ishment', emoji: '🤦' },
  { id: 'food', label: 'Food & Grill', emoji: '🍔' },
  { id: 'sports', label: 'Sports Humor', emoji: '⚽' },
  { id: 'tech', label: 'Tech Dad', emoji: '💻' },
  { id: 'kids', label: 'Kid Logic', emoji: '👶' },
  { id: 'holiday', label: 'Holiday Themed', emoji: '🎄' },
  { id: 'random', label: 'Anything Goes', emoji: '🎲' },
];

export const BATTLE_XP_REWARDS = {
  participation: 25,
  win: 100,
  winStreak3: 50,
  winStreak5: 100,
  winStreak10: 200,
  firstWin: 150,
  championTitle: 500,
};
