export type QuestCategory = 'social' | 'content' | 'activity' | 'special';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestDefinition {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  icon: string;
  requirement: QuestRequirement;
  isDaily: boolean;
}

export interface QuestRequirement {
  type: QuestActionType;
  target: number;
}

export type QuestActionType =
  | 'add_friend'
  | 'react_to_posts'
  | 'join_group'
  | 'share_joke'
  | 'create_post'
  | 'add_comments'
  | 'play_game'
  | 'ask_wisdom'
  | 'view_leaderboard'
  | 'post_story'
  | 'vote_poll'
  | 'create_poll'
  | 'send_message'
  | 'visit_profile'
  | 'share_content'
  | 'complete_any_quest';

export interface UserQuestProgress {
  quest: QuestDefinition;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  claimedAt?: Date;
}

export interface DailyQuestState {
  date: string; // YYYY-MM-DD
  quests: UserQuestProgress[];
  completedCount: number;
  totalXpEarned: number;
}

export const QUEST_XP_REWARDS: Record<QuestDifficulty, number> = {
  easy: 15,
  medium: 25,
  hard: 50,
};

export const QUEST_CATEGORY_INFO: Record<QuestCategory, { label: string; icon: string; color: string }> = {
  social: { label: 'Social', icon: '👥', color: '#3b82f6' },
  content: { label: 'Content', icon: '📝', color: '#22c55e' },
  activity: { label: 'Activity', icon: '🎮', color: '#f59e0b' },
  special: { label: 'Special', icon: '⭐', color: '#8b5cf6' },
};
