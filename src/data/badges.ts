import { BadgeDefinition } from '../types/gamification';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Social Badges
  {
    id: 'first_friend',
    name: 'Social Butterfly',
    icon: '🦋',
    description: 'Made your first dad friend',
    rarity: 'common',
    requirement: { type: 'friends', threshold: 1 },
  },
  {
    id: 'popular_dad',
    name: 'Popular Dad',
    icon: '🤝',
    description: 'Connected with 10 fellow dads',
    rarity: 'rare',
    requirement: { type: 'friends', threshold: 10 },
  },
  {
    id: 'influencer',
    name: 'Dad Influencer',
    icon: '📣',
    description: 'Built a network of 50 dad friends',
    rarity: 'epic',
    requirement: { type: 'friends', threshold: 50 },
  },
  {
    id: 'dad_network',
    name: 'Dad Network King',
    icon: '👑',
    description: 'Connected with 100 dads',
    rarity: 'legendary',
    requirement: { type: 'friends', threshold: 100 },
  },

  // Content Badges
  {
    id: 'first_post',
    name: 'First Words',
    icon: '📝',
    description: 'Created your first post',
    rarity: 'common',
    requirement: { type: 'posts', threshold: 1 },
  },
  {
    id: 'contributor',
    name: 'Active Contributor',
    icon: '✏️',
    description: 'Created 10 posts',
    rarity: 'common',
    requirement: { type: 'posts', threshold: 10 },
  },
  {
    id: 'prolific',
    name: 'Prolific Poster',
    icon: '✍️',
    description: 'Created 25 posts sharing your dad wisdom',
    rarity: 'rare',
    requirement: { type: 'posts', threshold: 25 },
  },
  {
    id: 'author',
    name: 'Dad Author',
    icon: '📚',
    description: 'Created 100 posts - a true dad content creator',
    rarity: 'epic',
    requirement: { type: 'posts', threshold: 100 },
  },

  // Comment Badges
  {
    id: 'first_comment',
    name: 'Voice Heard',
    icon: '💬',
    description: 'Left your first comment',
    rarity: 'common',
    requirement: { type: 'comments', threshold: 1 },
  },
  {
    id: 'conversationalist',
    name: 'Conversationalist',
    icon: '🗣️',
    description: 'Left 25 comments supporting fellow dads',
    rarity: 'rare',
    requirement: { type: 'comments', threshold: 25 },
  },
  {
    id: 'mentor',
    name: 'Dad Mentor',
    icon: '🧙',
    description: 'Left 100 comments of wisdom',
    rarity: 'epic',
    requirement: { type: 'comments', threshold: 100 },
  },

  // Joke Badges
  {
    id: 'first_joke',
    name: 'Aspiring Comedian',
    icon: '😄',
    description: 'Shared your first dad joke',
    rarity: 'common',
    requirement: { type: 'jokes', threshold: 1 },
  },
  {
    id: 'comedian',
    name: 'Dad Comedian',
    icon: '🎭',
    description: 'Shared 5 dad jokes',
    rarity: 'common',
    requirement: { type: 'jokes', threshold: 5 },
  },
  {
    id: 'joke_master',
    name: 'Joke Master',
    icon: '😂',
    description: 'Shared 25 dad jokes',
    rarity: 'rare',
    requirement: { type: 'jokes', threshold: 25 },
  },
  {
    id: 'legendary_jokester',
    name: 'Legendary Jokester',
    icon: '🃏',
    description: 'Shared 100 dad jokes - the ultimate pun master',
    rarity: 'legendary',
    requirement: { type: 'jokes', threshold: 100 },
  },

  // Streak Badges
  {
    id: 'three_day_streak',
    name: 'Getting Started',
    icon: '🌱',
    description: 'Maintained a 3-day streak',
    rarity: 'common',
    requirement: { type: 'streaks', threshold: 3 },
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    icon: '⚡',
    description: 'Maintained a 7-day streak',
    rarity: 'common',
    requirement: { type: 'streaks', threshold: 7 },
  },
  {
    id: 'two_week_titan',
    name: 'Two Week Titan',
    icon: '💪',
    description: 'Maintained a 14-day streak',
    rarity: 'rare',
    requirement: { type: 'streaks', threshold: 14 },
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    icon: '🔥',
    description: 'Maintained a 30-day streak',
    rarity: 'rare',
    requirement: { type: 'streaks', threshold: 30 },
  },
  {
    id: 'streak_champion',
    name: 'Streak Champion',
    icon: '🏅',
    description: 'Maintained a 60-day streak',
    rarity: 'epic',
    requirement: { type: 'streaks', threshold: 60 },
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    icon: '💎',
    description: 'Maintained a 100-day streak - incredible dedication!',
    rarity: 'legendary',
    requirement: { type: 'streaks', threshold: 100 },
  },

  // XP Badges
  {
    id: 'rising_star',
    name: 'Rising Star',
    icon: '⭐',
    description: 'Earned 500 XP',
    rarity: 'common',
    requirement: { type: 'xp', threshold: 500 },
  },
  {
    id: 'dedicated_dad',
    name: 'Dedicated Dad',
    icon: '🌟',
    description: 'Earned 1,000 XP',
    rarity: 'common',
    requirement: { type: 'xp', threshold: 1000 },
  },
  {
    id: 'veteran',
    name: 'Veteran Dad',
    icon: '🎖️',
    description: 'Earned 2,500 XP',
    rarity: 'rare',
    requirement: { type: 'xp', threshold: 2500 },
  },
  {
    id: 'elite',
    name: 'Elite Dad',
    icon: '🏅',
    description: 'Earned 10,000 XP',
    rarity: 'epic',
    requirement: { type: 'xp', threshold: 10000 },
  },
  {
    id: 'legendary_dad',
    name: 'Legendary Dad',
    icon: '👑',
    description: 'Earned 50,000 XP - you are a legend!',
    rarity: 'legendary',
    requirement: { type: 'xp', threshold: 50000 },
  },

  // Event Badges
  {
    id: 'first_event',
    name: 'Event Goer',
    icon: '📅',
    description: 'Attended your first dad event',
    rarity: 'common',
    requirement: { type: 'events', threshold: 1 },
  },
  {
    id: 'social_dad',
    name: 'Social Dad',
    icon: '🎉',
    description: 'Attended 5 dad events',
    rarity: 'rare',
    requirement: { type: 'events', threshold: 5 },
  },
  {
    id: 'event_enthusiast',
    name: 'Event Enthusiast',
    icon: '🎊',
    description: 'Attended 25 dad events',
    rarity: 'epic',
    requirement: { type: 'events', threshold: 25 },
  },

  // Group Badges
  {
    id: 'group_joiner',
    name: 'Group Explorer',
    icon: '🔍',
    description: 'Joined your first dad group',
    rarity: 'common',
    requirement: { type: 'groups', threshold: 1 },
  },
  {
    id: 'group_enthusiast',
    name: 'Group Enthusiast',
    icon: '🏘️',
    description: 'Joined 5 dad groups',
    rarity: 'rare',
    requirement: { type: 'groups', threshold: 5 },
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    icon: '🏛️',
    description: 'Active member of 10 groups',
    rarity: 'epic',
    requirement: { type: 'groups', threshold: 10 },
  },

  // Story Badges
  {
    id: 'first_story',
    name: 'Story Teller',
    icon: '📸',
    description: 'Posted your first story',
    rarity: 'common',
    requirement: { type: 'stories', threshold: 1 },
  },
  {
    id: 'story_pro',
    name: 'Story Pro',
    icon: '🎬',
    description: 'Posted 25 stories',
    rarity: 'rare',
    requirement: { type: 'stories', threshold: 25 },
  },
  {
    id: 'story_legend',
    name: 'Story Legend',
    icon: '🌠',
    description: 'Posted 100 stories sharing dad life moments',
    rarity: 'epic',
    requirement: { type: 'stories', threshold: 100 },
  },

  // Level Badges
  {
    id: 'level_5',
    name: 'Dad Joke Legend',
    icon: '😂',
    description: 'Reached Level 5',
    rarity: 'common',
    requirement: { type: 'level', threshold: 5 },
  },
  {
    id: 'level_7',
    name: 'Elite Father',
    icon: '⚡',
    description: 'Reached Level 7',
    rarity: 'rare',
    requirement: { type: 'level', threshold: 7 },
  },
  {
    id: 'level_9',
    name: 'Legendary Father',
    icon: '👑',
    description: 'Reached Level 9',
    rarity: 'epic',
    requirement: { type: 'level', threshold: 9 },
  },
  {
    id: 'level_10',
    name: 'Dad God',
    icon: '🌟',
    description: 'Reached the maximum level - Dad God!',
    rarity: 'legendary',
    requirement: { type: 'level', threshold: 10 },
  },

  // Reaction Badges
  {
    id: 'first_reaction',
    name: 'Reactor',
    icon: '👍',
    description: 'Received your first reaction',
    rarity: 'common',
    requirement: { type: 'reactions', threshold: 1 },
  },
  {
    id: 'reaction_magnet',
    name: 'Reaction Magnet',
    icon: '🧲',
    description: 'Received 100 reactions on your content',
    rarity: 'rare',
    requirement: { type: 'reactions', threshold: 100 },
  },
  {
    id: 'viral_dad',
    name: 'Viral Dad',
    icon: '🚀',
    description: 'Received 1000 reactions - your content is legendary!',
    rarity: 'legendary',
    requirement: { type: 'reactions', threshold: 1000 },
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find(b => b.id === id);
}

export function getBadgesByRarity(rarity: BadgeDefinition['rarity']): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(b => b.rarity === rarity);
}

export function getBadgesByRequirementType(type: BadgeDefinition['requirement']['type']): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(b => b.requirement.type === type);
}

export const RARITY_COLORS: Record<BadgeDefinition['rarity'], { bg: string; border: string; text: string }> = {
  common: { bg: 'rgba(120, 113, 108, 0.2)', border: '#78716c', text: '#a8a29e' },
  rare: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#60a5fa' },
  epic: { bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7', text: '#c084fc' },
  legendary: { bg: 'rgba(255, 215, 0, 0.2)', border: '#ffd700', text: '#ffd700' },
};
