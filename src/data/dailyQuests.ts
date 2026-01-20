import { QuestDefinition } from '../types/quests';

export const DAILY_QUESTS: QuestDefinition[] = [
  // Social Quests
  {
    id: 'add_friend_daily',
    title: 'Make a New Friend',
    description: 'Add a new dad friend to your network',
    category: 'social',
    difficulty: 'easy',
    xpReward: 15,
    icon: '🤝',
    requirement: { type: 'add_friend', target: 1 },
    isDaily: true,
  },
  {
    id: 'react_to_posts',
    title: 'Spread the Love',
    description: 'React to 3 posts from other dads',
    category: 'social',
    difficulty: 'easy',
    xpReward: 15,
    icon: '❤️',
    requirement: { type: 'react_to_posts', target: 3 },
    isDaily: true,
  },
  {
    id: 'join_group_daily',
    title: 'Join the Gang',
    description: 'Join a new dad group',
    category: 'social',
    difficulty: 'medium',
    xpReward: 25,
    icon: '👨‍👨‍👦',
    requirement: { type: 'join_group', target: 1 },
    isDaily: true,
  },
  {
    id: 'send_messages',
    title: 'Stay Connected',
    description: 'Send 5 messages to fellow dads',
    category: 'social',
    difficulty: 'medium',
    xpReward: 25,
    icon: '💬',
    requirement: { type: 'send_message', target: 5 },
    isDaily: true,
  },
  {
    id: 'visit_profiles',
    title: 'Meet the Dads',
    description: 'Visit 3 other dad profiles',
    category: 'social',
    difficulty: 'easy',
    xpReward: 15,
    icon: '👀',
    requirement: { type: 'visit_profile', target: 3 },
    isDaily: true,
  },

  // Content Quests
  {
    id: 'share_joke_daily',
    title: 'Dad Joke Master',
    description: 'Share a dad joke with the community',
    category: 'content',
    difficulty: 'easy',
    xpReward: 15,
    icon: '😂',
    requirement: { type: 'share_joke', target: 1 },
    isDaily: true,
  },
  {
    id: 'create_post_daily',
    title: 'Share Your Story',
    description: 'Create a post about your dad life',
    category: 'content',
    difficulty: 'medium',
    xpReward: 25,
    icon: '📝',
    requirement: { type: 'create_post', target: 1 },
    isDaily: true,
  },
  {
    id: 'add_comments_daily',
    title: 'Join the Conversation',
    description: 'Comment on 5 posts',
    category: 'content',
    difficulty: 'medium',
    xpReward: 25,
    icon: '💭',
    requirement: { type: 'add_comments', target: 5 },
    isDaily: true,
  },
  {
    id: 'post_story_daily',
    title: 'Story Time',
    description: 'Post a story to share your day',
    category: 'content',
    difficulty: 'easy',
    xpReward: 15,
    icon: '📸',
    requirement: { type: 'post_story', target: 1 },
    isDaily: true,
  },
  {
    id: 'create_poll_daily',
    title: 'Ask the Dads',
    description: 'Create a poll for the community',
    category: 'content',
    difficulty: 'medium',
    xpReward: 25,
    icon: '📊',
    requirement: { type: 'create_poll', target: 1 },
    isDaily: true,
  },
  {
    id: 'vote_polls',
    title: 'Voice Your Opinion',
    description: 'Vote on 3 polls',
    category: 'content',
    difficulty: 'easy',
    xpReward: 15,
    icon: '🗳️',
    requirement: { type: 'vote_poll', target: 3 },
    isDaily: true,
  },

  // Activity Quests
  {
    id: 'play_game_daily',
    title: 'Game Time',
    description: 'Play a mini-game in Dad Games',
    category: 'activity',
    difficulty: 'easy',
    xpReward: 15,
    icon: '🎮',
    requirement: { type: 'play_game', target: 1 },
    isDaily: true,
  },
  {
    id: 'ask_wisdom_daily',
    title: 'Seek Wisdom',
    description: 'Ask Dad Wisdom for advice',
    category: 'activity',
    difficulty: 'easy',
    xpReward: 15,
    icon: '🧠',
    requirement: { type: 'ask_wisdom', target: 1 },
    isDaily: true,
  },
  {
    id: 'view_leaderboard_daily',
    title: 'Check the Ranks',
    description: 'View the weekly leaderboard',
    category: 'activity',
    difficulty: 'easy',
    xpReward: 15,
    icon: '🏆',
    requirement: { type: 'view_leaderboard', target: 1 },
    isDaily: true,
  },
  {
    id: 'share_content_daily',
    title: 'Spread the Word',
    description: 'Share Dad Hub content externally',
    category: 'activity',
    difficulty: 'medium',
    xpReward: 25,
    icon: '📤',
    requirement: { type: 'share_content', target: 1 },
    isDaily: true,
  },

  // Special/Bonus Quests
  {
    id: 'quest_completionist',
    title: 'Overachiever',
    description: 'Complete 5 quests today',
    category: 'special',
    difficulty: 'hard',
    xpReward: 50,
    icon: '🌟',
    requirement: { type: 'complete_any_quest', target: 5 },
    isDaily: true,
  },
  {
    id: 'react_spree',
    title: 'Reaction Spree',
    description: 'React to 10 posts in one day',
    category: 'special',
    difficulty: 'hard',
    xpReward: 50,
    icon: '🔥',
    requirement: { type: 'react_to_posts', target: 10 },
    isDaily: true,
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Add 3 new friends today',
    category: 'special',
    difficulty: 'hard',
    xpReward: 50,
    icon: '🦋',
    requirement: { type: 'add_friend', target: 3 },
    isDaily: true,
  },
];

// Helper to get random daily quests
export function getDailyQuests(count: number = 5): QuestDefinition[] {
  // Shuffle the quests
  const shuffled = [...DAILY_QUESTS].sort(() => Math.random() - 0.5);

  // Ensure variety - pick from different categories
  const selected: QuestDefinition[] = [];
  const categories = ['social', 'content', 'activity'];

  // First, pick one from each main category
  for (const category of categories) {
    const quest = shuffled.find(q => q.category === category && !selected.includes(q));
    if (quest) {
      selected.push(quest);
    }
  }

  // Fill remaining slots with any quests
  for (const quest of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(quest)) {
      selected.push(quest);
    }
  }

  return selected.slice(0, count);
}

// Get quests by category
export function getQuestsByCategory(category: string): QuestDefinition[] {
  return DAILY_QUESTS.filter(q => q.category === category);
}

// Get quest by ID
export function getQuestById(id: string): QuestDefinition | undefined {
  return DAILY_QUESTS.find(q => q.id === id);
}
